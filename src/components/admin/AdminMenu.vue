<template>
  <div style="height: 796px;">
    <el-header>
      <i class="el-icon-s-fold" style="float: left;margin-top: 10px;font-size: 20px; padding: 5px;color: white;" @click="isC" ></i>
    </el-header>
    <el-menu
      :default-active="currentPath"
      router
      unique-opened
      background-color="transparent"
      text-color="#999"
      active-text-color="#36bed6"
      class="el-menu-vertical"
      :collapse="isCollapse">
      <el-submenu v-for="(item,i) in adminMenus" :key="i" :index="item.path">
        <template slot="title">
          <i :class=item.iconCls></i>
          <span>{{ item.nameZh}}</span>
        </template>
        <el-menu-item class="subMenu" v-for="children in item.children" :key="children.path" :index="children.path"><span class="menuText">{{children.nameZh}}</span></el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'AdminMenu',
  data () {
    return {
      isCollapse: false
    }
  },
  computed: {
    adminMenus () {
      return this.$store.state.adminMenus
    },
    currentPath () {
      return this.$route.path
    }
  },
  methods: {
    isC () {
      this.isCollapse = !this.isCollapse
      console.log(this.$store.state.adminMenus)
    }
  }
}
</script>

<style scoped>
  /*.el-menu-admin {*/
  /*  border-radius: 5px;*/
  /*  height: 100%;*/
  /*}*/
  .subMenu {
    background-color: #333 !important;
  }
  .menuText:hover {
    color: #36bed6;
  }
  .menuText:focus {
    color: #36bed6;
  }
  .el-menu-vertical:not(.el-menu--collapse) {
    width: 200px;
    min-height: 900px;
  }

</style>
