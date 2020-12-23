<template>
  <div>
    <el-row style="margin: 18px 0 0 18px;">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>管理中心</el-breadcrumb-item>
        <el-breadcrumb-item>系统设置</el-breadcrumb-item>
        <el-breadcrumb-item>系统信息</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <system-info-edit @onSubmit="loadInfo()" ref="edit"></system-info-edit>
    <el-card style="margin: 18px 2%;width: 95%;">
      <el-card style="margin: 20px auto 20px auto;width: 70%;height: 500px;" bodyStyle="padding: 10px" shadow="hover">
        <div class="cover">
          <img :src="form.logoUrl" alt="系统LOGO">
        </div>
        <h3>用户系统名称:</h3>
        <div class="info">{{ form.name }}</div>
        <h3>后台管理系统名称:</h3>
        <div class="info">{{ form.nameAdmin }}</div>
      </el-card>
    </el-card>
  </div>
</template>

<script>
import SystemInfoEdit from './SystemInfoEdit'
export default {
  name: 'SystemInfo',
  components: {SystemInfoEdit},
  data () {
    return {
      form: {
        logoUrl: '',
        name: '',
        nameAdmin: ''
      }
    }
  },
  // computed: {
  //   logo () {
  //     return localStorage.socket + '/u/file/' + this.form.logoUrl
  //   }
  // },
  mounted () {
    this.loadInfo()
  },
  methods: {
    loadInfo () {
      // 实际API
      // this.$axios.get('http://localhost:8093/api/system/info').then(resp => {
      // kong网关代理API
      this.$axios.get(localStorage.socket + '/u/system/info').then(resp => {
      // this.$axios.get('http://localhost:8000/u/system/info').then(resp => {
      // 开发代理API
      // this.$axios.get('/users/system/info').then(resp => {
        if (resp && resp.data.code === 200) {
          this.form.logoUrl = localStorage.socket + '/u/file/' + resp.data.result[0].logoUrl
          this.form.name = resp.data.result[0].name
          this.form.nameAdmin = resp.data.result[0].nameAdmin
        }
      }).catch(() => {
        this.$message.error('获取系统信息失败')
      })
    }
    // editInfo () {
    //   this.$refs.edit.form = this.form
    //   this.$refs.edit.dialogFormVisible = true
    // }
  }
}
</script>

<style scoped>
  .cover {
    height: 200px;
    margin-bottom: 7px;
    overflow: hidden;
    cursor: pointer;
    text-align: center;
  }
  img {
    height: 200px;
  }
  h3 {
    text-align: left;
  }
  .info {
    background-color: #333;
    font-size: 20px;
    text-align: center;
    font-weight: bold;
    line-height:50px;
    color: white;
    font-family: 楷体;
  }

</style>
