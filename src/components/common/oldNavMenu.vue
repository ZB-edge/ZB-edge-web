<template>
  <el-menu
    :default-active="'/index'"
    router
    mode="horizontal"
    background-color="white"
    text-color="#222"
    active-text-color="red"
    style="min-width: 1300px">
    <span style="position: absolute;padding-top: 20px;font-size: 20px;font-weight: bold">BJTU边缘计算平台</span>
    <el-menu-item v-for="(item,i) in navList" :key="i" :index="item.name">
      {{ item.navItem }}
    </el-menu-item>
    <i class="el-icon-switch-button" v-on:click="logout" style="float: right;font-size: 40px;color: #222;padding: 10px;"></i>
  </el-menu>
</template>

<script>
export default {
  name: 'NavMenu',
  data () {
    return {
      navList: [
        {name: '/index', navItem: '首页'},
        {name: '/gateway', navItem: '网关管理'},
        {name: '/messageRouting', navItem: '消息路由'},
        {name: '/rule', navItem: '规则引擎'},
        {name: '/profile', navItem: '设备模板'},
        {name: '/device', navItem: '设备管理'},
        {name: '/scenario', navItem: '场景服务'},
        {name: '/command', navItem: '指令管理'},
        {name: '/user', navItem: '用户管理'},
        {name: '/logIndex', navItem: '操作审计'}
      ]
    }
  },
  methods: {
    logout () {
      var _this = this
      this.$axios.get('/logout').then(resp => {
        if (resp.data.code === 200) {
          // _this.$store.commit('logout')
          _this.$router.replace('/login')
        }
      })
    }
  }
}
</script>

<style scoped>
  a {
    text-decoration: none;
  }
  span {
    pointer-events: none;
  }
  .el-icon-switch-button {
    cursor: pointer;
    outline: 0;
  }
</style>
