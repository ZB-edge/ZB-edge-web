<template>
  <div style="text-align: left">
    <el-button class="add-button" type="success" @click="dialogFormVisible = true">批量添加用户</el-button>
    <el-dialog
      title="添加用户"
      :visible.sync="dialogFormVisible"
      @close="clear"
      width="25%">
      <el-form v-model="loginForm" :rules="rules" label-position="left"
               label-width="120px">
        <el-form-item prop="username" label="用户名：">
          <el-input type="text" v-model="loginForm.username"
                    auto-complete="off" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码：">
          <el-input type="password" v-model="loginForm.password"
                    auto-complete="off" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item prop="name"  label="真实姓名：">
          <el-input type="text" v-model="loginForm.name"
                    auto-complete="off" placeholder="真实姓名"></el-input>
        </el-form-item>
        <el-form-item prop="phone"  label="电话号码：">
          <el-input type="text" v-model="loginForm.phone"
                    auto-complete="off" placeholder="电话号码"></el-input>
        </el-form-item>
        <el-form-item prop="email"  label="邮箱：">
          <el-input type="text" v-model="loginForm.email"
                    auto-complete="off" placeholder="E-Mail"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="register">确 定</el-button>
        <el-button @click="clear">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'BulkRegistration',
  data () {
    return {
      dialogFormVisible: false,
      rules: {
        username: [{required: true, message: '用户名不能为空', trigger: 'blur'}],
        password: [{required: true, message: '密码不能为空', trigger: 'blur'}]
      },
      loginForm: {
        username: '',
        password: '',
        name: '',
        phone: '',
        email: ''
      }
    }
  },
  methods: {
    clear () {
      this.dialogFormVisible = false
      this.loginForm = {
        username: '',
        password: '',
        name: '',
        phone: '',
        email: ''
      }
    },
    register () {
      this.$axios
        // 实际API
        // .post('http://localhost:8093/api/register', {
        // kong网关代理API
        .post(localStorage.socket + '/u/register', {
        // .post('http://localhost:8000/u/register', {
        // 开发代理API
        // .post('/users/register', {
          username: this.loginForm.username,
          password: this.loginForm.password,
          name: this.loginForm.name,
          phone: this.loginForm.phone,
          email: this.loginForm.email
        })
        .then(resp => {
          if (resp.data.code === 200) {
            this.$alert('注册成功', '提示', {
              confirmButtonText: '确定'
            })
            this.clear()
            this.$emit('onSubmit')
          } else {
            this.$alert(resp.data.message, '提示', {
              confirmButtonText: '确定'
            })
          }
        })
        .catch(failResponse => {})
      this.dialogFormVisible = false
    }
  }
}
</script>

<style scoped>
  .add-button {
    margin: 18px 0 0 10px;
  }
</style>
