<template>
  <div>
    <el-form class="login-container" label-position="left"
             label-width="200px" :rules="ruleCustom" ref="form" :model="formItem">
      <h3 class="login_title">统一接入网关</h3>
      <el-form-item  label="后端微服务地址：" prop="address">
        <el-input style="width: 370px;float: right" type="text" v-model="formItem.address"
                  auto-complete="off" placeholder="例如:http://192.168.0.200:8000"></el-input>
      </el-form-item>
      <el-form-item >
        <el-button type="primary" @click.enter="test" style="background: #505458;border: none;margin-left: -100px">进入</el-button>
        <el-button type="success" @click="clear" style="background: #505458;border: none;margin-right: 90px">清除地址</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SocketConfig',
  data () {
    const validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入后端微服务ip地址'))
      } else {
        if (!value.startsWith('http://') && !value.startsWith('https://')) {
          callback(new Error('URL错误，必须是http:// 或 https://开头'))
          return
        }
        if (value.endsWith('/')) {
          callback(new Error('URL错误,不能以/结尾'))
          this.formItem.address = this.formItem.address.substr(0, this.formItem.address.length - 1)
          return
        }
        callback()
      }
    }
    return {
      formItem: {
        address: ''
      },
      ruleCustom: {
        address: [
          {validator: validatePass, trigger: 'blur'}
        ]
      }
    }
  },
  mounted () {
    this.formItem.address = localStorage.socket
  },
  methods: {
    saveConfig () {
      // let url = this.formItem.address.trim()
      // var result
      // localStorage.socket = this.formItem.address.trim()
      // if (url.includes('localhost')) {
      //   result = 'localhost'
      // } else {
      //   result = url.match(/(\d{1,3}\.){3}\d{1,3}/g)[0]
      // }
      // localStorage.serviceIP = result
      this.$store.commit('saveSocket', this.formItem.address)
      this.$store.commit('handleSocket', true)
      this.$router.push('/login')
    },
    clear () {
      localStorage.removeItem('socket')
      this.formItem.address = ''
    },
    test () {
      let _this = this
      this.$axios.get(_this.formItem.address.trim() + '/u/ping').then(resp => {
        if (resp && resp.status === 200) {
          this.saveConfig()
        } else {
          _this.$alert('该地址不通，请检查地址后重试')
        }
      }).catch(() => {
        _this.$alert('该地址不通，请检查地址后重试')
      })
    }
  }
}
</script>

<style scoped>

  .login-container {
    border-radius: 15px; /*添加圆角的边框*/
    /*background-clip: padding-box;  !*指定背景绘制区域。看https://www.runoob.com/try/try.php?filename=trycss3_background-clip*!*/
    margin: 90px auto; /*设置所有外边距属性 上右下左*/
    width: 500px;/*定义元素内容区的宽度*/
    padding: 35px 35px 15px 35px; /*设置所有内边距属性。指一个元素的内容和其边界之间的空间*/
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }
  body {
    margin: 0px;
  }

</style>
