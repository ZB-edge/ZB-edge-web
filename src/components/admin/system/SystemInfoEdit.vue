<template>
    <div style="text-align: left">
      <el-button class="add-button" type="success" @click="dialogFormVisible = true">添加/修改系统信息</el-button>
      <el-dialog
        title="添加/修改系统信息"
        :visible.sync="dialogFormVisible"
        @close="clear">
        <el-form v-model="form" style="text-align: left" label-width="120px" ref="dataForm">
          <el-form-item label="系统名称" prop="name">
            <el-input v-model="form.name" autocomplete="off" placeholder="请输入系统名称"></el-input>
          </el-form-item>
          <el-form-item label="系统LOGO" prop="logo">
            <el-input v-model="form.logoUrl" autocomplete="off" placeholder="图片URL"></el-input>
            <img-upload @onUpload="uploadImg" ref="imgUpload"></img-upload>
          </el-form-item>
          <el-form-item label="后台名称" prop="nameAdmin">
            <el-input v-model="form.nameAdmin" autocomplete="off" placeholder="请输入后台管理系统名称"></el-input>
          </el-form-item>
        </el-form>
        <div solt="footer" class="dialog-footer">
          <el-button type="primary" @click="onSubmit">确定</el-button>
          <el-button @click="dialogFormVisible = false">取消</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
import ImgUpload from './ImgUpload'
export default {
  name: 'SystemInfoEdit',
  components: {ImgUpload},
  data () {
    return {
      dialogFormVisible: false,
      form: {
        name: '',
        logoUrl: '',
        nameAdmin: ''
      }
    }
  },
  methods: {
    clear () {
      this.$refs.imgUpload.clear()
      this.form = {
        name: '',
        logoUrl: '',
        nameAdmin: ''
      }
    },
    onSubmit () {
      // 实际API
      // this.$axios.post('http://localhost:8093/api/system/info', {
      // kong网关代理API
      this.$axios.post(localStorage.socket + '/u/system/info', {
      // this.$axios.post('http://localhost:8000/u/system/info', {
      // 开发代理API
      // this.$axios.post('/users/system/info', {
        name: this.form.name,
        logoUrl: this.form.logoUrl,
        nameAdmin: this.form.nameAdmin
      }).then(resp => {
        if (resp && resp.data.code === 200) {
          this.dialogFormVisible = false
          this.$emit('onSubmit')
        }
      })
    },
    uploadImg (e) {
      this.form.logoUrl = e
      console.log(this.form.logoUrl)
    }
  }
}
</script>

<style scoped>
  .add-button {
    margin: 18px 0 0 10px;
  }
</style>
