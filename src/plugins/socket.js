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
            IO[e.name] = io(e.ip)
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
                                this.$MadderSocket.emitter.addListener(e2, this.$options.sockets[e1][e2], this)
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
                            this.$vueSocketIo[e1].emitter.removeListener(e2, this);
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
        this.listeners = new Map();
    }

    // 在listeners中写入监听
    addListener(event, callback, component){
        if(typeof callback === 'function'){
            if (!this.listeners.has(event)) this.listeners.set(event, []); // 没有该事件则设置事件
            this.listeners.get(event).push({ callback, component });    // 将监听的组件和处理方法压入
        } else {
            throw new Error(`callback must be a function`);
        }
    }

    // 在listeners中移除监听
    removeListener(event, component){
        if(this.listeners.has(event)){
            const listeners = this.listeners.get(event).filter(listener => (
                listener.component !== component
            ));
            if (listeners.length > 0) {
                this.listeners.set(event, listeners);   // 只是某一组件移除监听则重新计算并设置需要监听的组件数组
            } else {
                this.listeners.delete(event);   // 如果没有组件监听这个事件则移除该监听
            }
        }
    }

    // 发送信息到对应的组件
    emit(event, args, e){
        if(this.listeners.has(event)){
            this.listeners.get(event).forEach((listener) => {
                listener.callback.call(listener.component, args);
            });
        }
        if(event !== 'ping' && event !== 'pong') {
            this.dispatchStore(event, args, e);
        }
    }


    // 发送信息到vuex中
    dispatchStore(event, args, e){
        if(this.store && this.store._actions){
            let prefixed_event = event
            if(e) {
                prefixed_event  = (e + '_' + event).toUpperCase();
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
    constructor(io, emitter){
        this.io = io;
        this.register();
        this.emitter = emitter;
    }

    // 注册监听
    register(){
        Object.keys(this.io).forEach(name => {
            console.log(this.io[name])
            this.io[name].onevent = (packet) => {
                // 监听所有消息并做对应发送
                let [event, ...args] = packet.data;
                if(args.length === 1) args = args[0];
                this.onEvent(event, args, packet.nsp.split('/').pop())
            };
        })
    }

    // 监听所需数据抛给emitter类处理
    onEvent(event, args, name){
        console.log(event)
        this.emitter.emit(event, args, name);
    }

}