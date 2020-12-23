<template>
  <el-container>
    <el-header style="width: 100%;height: 50px;padding: 0px;background-color: #333">
      <a href="/home">
        <img :src="info.logoUrl" alt="" style="float: left;height: 50px; width: 200px;min-width: 120px">
      </a>
      <span style="position: absolute;left: 220px;font-size: 20px;font-weight: bold;line-height:50px; color: white; font-family: 楷体">{{ info.nameAdmin }}</span>
      <span style="position: absolute;right: 20px;"><i class="el-icon-switch-button" v-on:click="logout" style="float: right;margin-top: 10px;font-size: 20px; padding: 5px;color: white"></i></span>
    </el-header>
    <el-container>
        <admin-menu style="background-color: #333 !important"></admin-menu>
      <el-main style="padding: 0px;">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AdminMenu from './AdminMenu'
import {createRouter} from '../../router'
export default {
  name: 'AdminIndex',
  components: {AdminMenu},
  data () {
    return {
      info: {
        name: '',
        logoUrl: '',
        nameAdmin: ''
      }
    }
  },
  // computed: {
  //   logo () {
  //     return localStorage.socket + '/u/file/' + this.info.logoUrl
  //   }
  // },
  mounted () {
    this.loadSysInfo()
  },
  methods: {
    loadSysInfo () {
      // 实际API
      // this.$axios.get('http://localhost:8093/api/system/info').then(resp => {
      // kong网关代理API
      this.$axios.get(localStorage.socket + '/u/system/info').then(resp => {
      // this.$axios.get('http://localhost:8000/u/system/info').then(resp => {
      // 开发代理API
      // this.$axios.get('/users/system/info').then(resp => {
        if (resp && resp.data.code === 200) {
          this.info.logoUrl = localStorage.socket + '/u/file/' + resp.data.result[0].logoUrl
          this.info.name = resp.data.result[0].name
          this.info.nameAdmin = resp.data.result[0].nameAdmin
        }
      }).catch(() => {
        this.$message.error('获取系统信息失败')
      })
    },
    logout () {
      var _this = this
      // 实际API
      // this.$axios.get('http://localhost:8093/api/logout').then(resp => {
      // kong网关代理API
      this.$axios.get(localStorage.socket + '/u/logout').then(resp => {
      // this.$axios.get('http://localhost:8000/u/logout').then(resp => {
      // 开发代理API
      // this.$axios.get('/users/logout').then(resp => {
        if (resp && resp.status === 200) {
          _this.$store.commit('logout')
          _this.$router.replace('/login')
          // 清空路由，防止路由重复加载
          const newRouter = createRouter()
          _this.$router.matcher = newRouter.matcher
        }
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>
</style>
