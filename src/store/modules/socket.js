import { defineStore } from 'pinia'

const useSocketStore = defineStore('socket', {
  namespaced: true,
  state: () => ({
  }),
  actions: {
    MSG_RES (e, value) {
    },
    MSG_CONNECT (e, value) {
      console.log('MSG_CONNECT', value)
    },
    MSG_200 (e, value) {
    },
    MSG_233 (e, value) {
    },
    MSG_250 (e, value) {
    }
  }
})

export default useSocketStore
