import { mapState } from 'vuex';

export default {
    computed: {
        // debug标志
        ...mapState('app', ['debug'])
    },
    methods: {
        // 混入socket标准化传输格式
        sokcet(type='init', data) {
            const params = {name: this.$store.state.user.userInfo.username, time: new Date().getTime(), userId: this.$store.state.user.userInfo.id}
            Object.assign( params, data)
            this.$socket.emit(type, params)
        },
    }
}