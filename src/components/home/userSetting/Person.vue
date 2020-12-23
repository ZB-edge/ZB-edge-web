<template>
  <div>
    <el-dialog
      title="修改用户信息"
      :visible.sync="dialogFormVisible">
      <el-form v-model="selectedUser" style="text-align: left;" ref="dataForm">
        <el-form-item label="用户名" label-width="120px" prop="username">
          <el-input v-model="selectedUser.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" label-width="120px" prop="name">
          <el-input v-model="selectedUser.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" label-width="120px" prop="phone">
          <el-input v-model="selectedUser.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="120px" prop="email">
          <el-input v-model="selectedUser.email" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit">确 定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-card style="margin: 18px 2%;width: 95%">
      <h1>个人资料</h1>
      <el-divider></el-divider>
      <div>
        <p>账户名称：{{ user.username }}</p>
        <p>真实姓名：{{ user.name }}</p>
        <p>联系方式：{{ user.phone }}</p>
        <p>邮箱地址：{{ user.email }}</p>
        <p>启用状态：{{ user.enable }}</p>
        <p>用户角色：<span style="margin-right: 10px;" v-for="role in user.roles" :index="role.id" :key="role.name">{{ role.nameZh }}</span></p>
      </div>
      <div style="margin: 20px 0 20px 0;float: left">
        <el-button @click="editUser">修改资料</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Person',
  data () {
    return {
      user: {
        id: '',
        username: '',
        name: '',
        phone: '',
        email: '',
        enable: '',
        roles: []
      },
      dialogFormVisible: false,
      selectedUser: {
        id: '',
        username: '',
        password: '',
        name: '',
        phone: '',
        email: ''
      }
    }
  },
  mounted () {
    this.getUserInfo()
  },
  methods: {
    getUserInfo () {
      // 实际API
      // this.$axios.get('http://localhost:8093/api/user/info').then(resp => {
      // kong网关代理API
      this.$axios.get(localStorage.socket + '/u/user/info').then(resp => {
      // this.$axios.get('http://localhost:8000/u/user/info').then(resp => {
      // 开发代理API
      // this.$axios.get('users/user/info').then(resp => {
        if (resp && resp.data.code === 200) {
          this.user = resp.data.result
          this.selectedUser.id = resp.data.result.id
          this.selectedUser.username = resp.data.result.username
          this.selectedUser.name = resp.data.result.name
          this.selectedUser.phone = resp.data.result.phone
          this.selectedUser.email = resp.data.result.email
          if (!resp.data.result.enable) {
            this.user.enable = '已启用'
          } else {
            this.user.enable = '已禁用'
          }
        }
      }).catch(() => {
        this.$message.warning('获取用户信息失败')
      })
    },
    editUser () {
      if (this.selectedUser.username === 'admin') {
        this.$alert('不允许编辑管理员用户')
      } else {
        this.dialogFormVisible = true
      }
    },
    onSubmit () {
      let _this = this
      // 根据视图绑定的角色 id 向后端传送角色信息
      // 实际API
      // this.$axios.put('http://localhost:8093/api/user/info', {
      // kong网关代理API
      this.$axios.put(localStorage.socket + '/u/user/info', {
      // this.$axios.put('http://localhost:8000/u/user/info', {
      // 开发代理API
      // this.$axios.put('/users/user/info', {
        id: _this.selectedUser.id,
        username: _this.selectedUser.username,
        name: _this.selectedUser.name,
        phone: _this.selectedUser.phone,
        email: _this.selectedUser.email
      }).then(resp => {
        if (resp && resp.data.code === 200) {
          this.$message.success('用户信息修改成功')
          this.dialogFormVisible = false
          // 修改角色后重新请求用户信息，实现视图更新
          _this.$store.commit('logout')
          _this.$router.replace('/login')
        } else {
          this.$alert(resp.data.message)
        }
      })
    }
  }
}
</script>

<style scoped>
  h1 {
    text-align: left;
  }
  p {
    text-align: left;
  }

</style>
