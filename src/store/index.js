import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: window.localStorage.getItem('username') == null ? '' : JSON.parse(window.localStorage.getItem('username' || '[]')),
    adminMenus: [],
    commonMenus: [],
    messageCenter: [],
    socket: window.localStorage.getItem('socket') == null ? '' : window.localStorage.getItem('socket' || '[]'),
    hadSocket: false
  },
  mutations: {
    initAdminMenu (state, adminMenus) {
      state.adminMenus = adminMenus
    },
    initCommonMenu (state, commonMenus) {
      state.commonMenus = commonMenus
    },
    addMessage (state, messages) {
      state.messageCenter.push(messages)
    },
    deleteMessage (state, messageIndex, count) {
      if (count) {
        state.messageCenter.splice(messageIndex, 1)
      } else {
        state.messageCenter = []
      }
    },
    saveSocket (state, socket) {
      state.socket = socket
      window.localStorage.setItem('socket', socket)
    },
    handleSocket (state, hadSocket) {
      state.hadSocket = hadSocket
    },
    login (state, data) {
      state.username = data
      window.localStorage.setItem('username', JSON.stringify(data))
    },
    logout (state) {
      // 注意不能用 null 清除，否则将无法判断 user 里具体的内容
      state.username = ''
      window.localStorage.removeItem('username')
      state.adminMenus = []
      state.commonMenus = []
    }
  },
  actions: {
  }
})
