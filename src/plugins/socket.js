// !现不支持自定义连接时机，默认vue安装插件时自动连接
export default class MadderSocket{

    constructor({vuex, options}){
        this.vuex = vuex;
        this.options = options;
    }

    install(Vue) {
        Vue.mixin(this.connect(Vue, this.options)); // 混入逻辑增加 vue 中 $options 调用
        this.emitter = new Emitter(this.vuex, this.options);   // 分配逻辑
        const listener = new Listener(this.io, this.emitter);    // 为vuex增加监听
    }

    connect(Vue, options) {
        if (!options.length) {
            console.error('配置项错误')
            return false
        }
        let socket = {}
        let IO = this.io = Vue.prototype.$socket = {}
        Vue.prototype.$MadderSocket = this;
        options.forEach(e => {
            IO[e.name] = io(e.ip)   //! socket.io从一开始注册的时候其实就连接了
            socket[e.name] = {}
        })
        return {
            // 创建前定义绑定方法
            beforeCreate(){
                if(!this.sockets) this.sockets = socket;
                Object.keys(this.sockets).forEach(e => {
                    this.sockets[e].subscribe = (event, callback) => {
                        this.$MadderSocket.emitter.addListener(event, callback, this);
                    };
                    this.sockets[e].unsubscribe = (event) => {
                        this.$MadderSocket.emitter.removeListener(event, this);
                    };
                });
            },
            // 挂载时绑定对应options
            mounted(){
                Object.keys(this.sockets).forEach(e1 => {
                    if(this.$options.sockets && this.$options.sockets[e1]){
                        Object.keys(this.$options.sockets[e1]).forEach(e2 => {
                            if(e2 !== 'subscribe' && e2 !== 'unsubscribe') {
                                // this.$MadderSocket.emitter.addListener(e2, this.$options.sockets[e1][e2], this)
                                this.$MadderSocket.emitter.addListener(e1, e2, this)
                            }
                        });
                    }
                })
            },
            // 销毁时解绑对应options
            beforeDestroy(){
                Object.keys(this.sockets).forEach(e1 => {
                    if(this.$options.sockets && this.$options.sockets[e1]){
                        Object.keys(this.$options.sockets[e1]).forEach(e2 => {
                            this.$MadderSocket.emitter.removeListener(e1, e2, this); //! 这里直接销毁了没有断开事件了
                        });
                    }
                })
            }
        }
    }

}

class Emitter {
    constructor(vuex){
        this.store = vuex;
        this.listeners = new Map;
    }

    // 在listeners中写入监听
    addListener(nps, event, component){
        if(typeof component.$options.sockets[nps][event] === 'function'){
            if (!this.listeners.has(nps)) {
                this.listeners.set(nps, new Map)
            }
            if (!this.listeners.get(nps).has(event)) this.listeners.get(nps).set(event, []); // 没有该事件则设置事件
            this.listeners.get(nps).get(event).push({ callback: component.$options.sockets[nps][event], component });    // 将监听的组件和处理方法压入
        } else {
            throw new Error(`callback must be a function`);
        }
    }

    // 在listeners中移除监听
    removeListener(nps, event, component){
        if(this.listeners.get(nps).has(event)){
            const listeners = this.listeners.get(nps).get(event).filter(listener => (
                listener.component !== component
            ));
            if (listeners.length > 0) {
                this.listeners.get(nps).set(event, listeners);   // 只是某一组件移除监听则重新计算并设置需要监听的组件数组
            } else {
                this.listeners.get(nps).delete(event);   // 如果没有组件监听这个事件则移除该监听
            }
        }
    }

    // 发送信息到对应的组件
    emit(event, args, nps){
        if (!this.listeners.get(nps)) {
            return false
        }
        if(this.listeners.get(nps).has(event)){
            this.listeners.get(nps).get(event).forEach((listener) => {
                listener.callback.call(listener.component, args);
            });
        }
        if(event !== 'ping' && event !== 'pong') {
            this.dispatchStore(event, args, nps);
        }
    }


    // 发送信息到vuex中
    dispatchStore(event, args, nps){
        if(this.store && this.store._actions){
            let prefixed_event = event
            if(nps) {
                prefixed_event  = (nps + '_' + event).toUpperCase();
            }
            for (let key in this.store._actions) {
                let action = key.split('/').pop();  // 如果在模块中拿到对应模块
                if(action === prefixed_event) {
                    // 名称对应则发送dispatch
                    this.store.dispatch(key, args);
                }
            }
            for (let key in this.store._mutations) {
                let mutation = key.split('/').pop();
                if(mutation === prefixed_event) {
                    this.store.commit(key, args);
                }
            }
        }
    }

}

class Listener {

    //! 这些是socket中自带的静态事件，连接、断开等事件的绑定时机可能在组件外导致无法监听
    static staticEvents = [
        'connect',
        'error',
        'disconnect',
        'reconnect',
        'reconnect_attempt',
        'reconnecting',
        'reconnect_error',
        'reconnect_failed',
        'connect_error',
        'connect_timeout',
        'connecting',
        'ping',
        'pong'
    ];

    constructor(io, emitter){
        this.io = io;
        this.register();
        this.emitter = emitter;
    }

    // 注册监听
    register(){
        Object.keys(this.io).forEach(name => {
            this.io[name].onevent = (packet) => {
                // 监听所有消息并做对应发送
                let [event, ...args] = packet.data;
                if(args.length === 1) args = args[0];
                this.onEvent(event, args, packet.nsp.split('/').pop())
            };
            Listener.staticEvents.forEach(event => this.io[name].on(event, args => this.onEvent(event, args, name))) // 给默认监听的默认事件添加绑定
        })
    }

    // 监听所需数据抛给emitter类处理
    onEvent(event, args, name){
        this.emitter.emit(event, args, name);
    }

}