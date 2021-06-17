<template>
  <body id="paper">
  <div class="login-container">
    <el-form :model="loginForm" :rules="rules" label-position="right" label-width="80px" v-loading="loading">
      <h3 class="login_title">系统登录</h3>
      <el-form-item prop="username" label="用户名">
        <el-input type="text" v-model="loginForm.username"
                  auto-complete="off" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input type="password" v-model="loginForm.password"
                  auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
      <el-checkbox class="login_remember" v-model="checked"
                   label-position="left"><span style="color: #505458">记住密码</span></el-checkbox>
    </el-form>
    <el-button type="primary" style="width: 40%;background: #505458;border: none" v-on:click="login">登录</el-button>
<!--    <router-link to="register"><el-button type="primary" style="width: 40%;background: #505458;border: none">注册</el-button></router-link>-->
  </div>
  </body>
</template>
<script>
export default{
  name: 'Login',
  data () {
    return {
      rules: {
        username: [{required: true, message: '用户名不能为空', trigger: 'blur'}],
        password: [{required: true, message: '密码不能为空', trigger: 'blur'}]
      },
      checked: true,
      loginForm: {
        username: '',
        password: ''
      },
      loading: false
    }
  },
  methods: {
    login () {
      var _this = this
      this.$axios
        // 实际API
        // .post('http://localhost:8093/api/login', {
        // kong网关代理API
        .post(localStorage.socket + '/u/login', {
        // .post('http://localhost:8000/u/login', {
        // 开发代理API
        // .post('/users/login', {
          username: this.loginForm.username,
          password: this.loginForm.password
        })
        .then(resp => {
          if (resp.data.code === 200) {
            let data = resp.data.result
            _this.$store.commit('login', data)
            let path = _this.$route.query.redirect
            _this.$router.replace({path: path === '/' || path === undefined ? '/index' : path})
            // this.$router.replace({path: '/index'})
          } else {
            this.$alert(resp.data.message, '提示', {
              confirmButtonText: '确定'
            })
          }
        }).catch(() => {})
    }
  }
}
</script>
<style>
  #paper {
    background:url("../assets/img/img.png") no-repeat;
    background-position: center;
    height: 100%;
    width: 100%;
    background-size: cover;
    position: fixed;
  }
  body{
    margin: 0;
  }
  .login-container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 90px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }
  .login_title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
  .login_remember {
    margin: 0px 0px 35px 0px;
    text-align: left;
  }
</style>
