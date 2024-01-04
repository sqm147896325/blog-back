export default {
  methods: {
    // 混入socket标准化传输格式
    sokcet (nsp, type = 'init', data = {}) {
      const params = { name: this.$store.state.user.userInfo.username, time: new Date().getTime(), userId: this.$store.state.user.userInfo.id }
      Object.assign(params, data)
      this.$socket[nsp].emit(type, params)
    }
  }
}
