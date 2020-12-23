// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/font_icon/iconfont.css'
import store from './store'
import router from './router'
import App from './App'
import './style/style.css'

// Vue.use(Loading.directive)
Vue.use(ElementUI, {size: 'small'})
// var axios1 = require('axios')
// var axios = axios1.create({
//   withCredentials: true,
//   crossDomain: true,
//   timeout: 30000,
//   headers: {
//     'Content-Type': 'application/json;charset=UTF-8'
//   }
// })
var axios = require('axios')
// axios.defaults.baseURL = 'http://localhost:8000'
// 让前端能够带上 cookie，我们需要通过 axios 主动开启 withCredentials 功能
axios.defaults.withCredentials = true
// 全局注册，之后可在其他组件中通过 this.$axios 发送数据
Vue.prototype.$axios = axios
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  // if (!store.state.socket && !store.state.hadSocket) {
  //   next({
  //     path: '/socketConfig'
  //   })
  // }
  if (store.state.username) {
    initMenu(router, store)
  }
  // if (store.state.username && to.path.startsWith('/login')) {
  //   next({
  //     name: 'index'
  //   })
  // }
  // 如果前端没有登录信息则直接拦截，如果有，则判断后端是否正常登录（防止构造参数绕过）
  if (to.meta.requireAuth) {
    if (store.state.username) {
      // 实际API
      // axios.get('http://localhost:8093/api/authentication').then(resp => {
      // kong网关代理API
      axios.get(localStorage.socket + '/u/auth').then(resp => {
        // axios.get('http://localhost:8000/u/auth').then(resp => {
        // 开发代理api
        // axios.get('/users/authentication').then(resp => {
        if (resp && resp.status === 200) {
          next()
        }
      })
    } else {
      next({
        path: 'login',
        query: {redirect: to.fullPath}
      })
    }
  } else {
    next()
  }
})
const initMenu = (router, store) => {
  // 防止重复触发加载菜单操作
  if (store.state.adminMenus.length > 0 && store.state.commonMenus.length > 0) {
    return
  }
  // 实际API
  // axios.get('http://localhost:8093/api/admin/menu').then(resp => {
  // kong网关代理API
  axios.get(localStorage.socket + '/u/menu').then(resp => {
  // axios.get('http://localhost:8000/u/menu').then(resp => {
    // 开发代理API
    // axios.get('/admins/menu').then(resp => {
    if (resp && resp.status === 200) {
      let adminRoutes = formatRoutes(resp.data.result.admin)
      let commonRoutes = formatRoutes(resp.data.result.common)
      store.commit('initAdminMenu', adminRoutes)
      store.commit('initCommonMenu', commonRoutes)
      router.onReady(() => {
        router.addRoutes(adminRoutes)
        router.addRoutes(commonRoutes)
      })
    }
  })
}

const formatRoutes = (routes) => {
  let fmtRoutes = []
  routes.forEach(route => {
    if (route.children) {
      route.children = formatRoutes(route.children)
    }
    let fmtRoute = {
      path: route.path,
      component: resolve => {
        require(['./components/' + route.component + '.vue'], resolve)
      },
      name: route.name,
      nameZh: route.nameZh,
      iconCls: route.iconCls,
      meta: {
        requireAuth: true
      },
      children: route.children
    }
    fmtRoutes.push(fmtRoute)
  })
  return fmtRoutes
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store,
  components: { App },
  template: '<App/>'
})
