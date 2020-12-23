<template>
    <div>
      <el-dialog
        title="新增设备模板"
        :visible.sync="dialogFormVisible"
        @close="hideDialog">
<!--        <el-form v-model="form" style="text-align: left" ref="dataForm">-->
<!--          <el-form-item label="yaml格式文本">-->
<!--            <el-input type="textarea" :row="10" v-model="form" autocomplete="off" placeholder="请输入yaml格式的文本"></el-input>-->
<!--          </el-form-item>-->
<!--        </el-form>-->

<!--        <el-input v-model="gwip" autocomplete="off" placeholder="请输入网关的IP地址"></el-input>-->
        <el-form v-model="profileForm" label-width="35%" style="text-align: left">
<!--          <el-form-item label="模板名称" prop="name">-->
<!--            <el-input v-model="profileForm.name" autocomplete="off" placeholder="请输入模板名称"></el-input>-->
<!--          </el-form-item>-->
          <el-form-item label="YML描述" >
            <el-input type="textarea"  v-model="profileForm.ymlStr" placeholder="请检查上传yml文件内容，或输入yml格式文本" style="width: 40%;"></el-input>
            <file-reader @load="profileForm.ymlStr = $event" style="height: 31px;text-align: center;width: 20%; float: right;margin-right: 33%" ></file-reader>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button type="primary" @click="onSubmit">确定</el-button>
          <el-button @click="hideDialog">取消</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
import FileReader from './FileReader'
export default {
  name: 'ProfileEditForm',
  components: {FileReader},
  data () {
    return {
      profileForm: {
        ymlStr: ''
      }
    }
  },
  props: {
    dialogFormVisible: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  methods: {
    hideDialog () {
      this.profileForm = {
        ymlStr: ''
      }
      this.$emit('hideDialog')
    },
    onSubmit () {
      var _this = this
      var axios = require('axios')
      var instance = axios.create({
        headers: {'content-type': 'text/plain'}
      })
      // 实际API
      // instance.post('http://localhost:8091/api/profile', _this.profileForm.ymlStr
      // kong网关代理API
      instance.post('http://localhost:8000/p', _this.profileForm.ymlStr
      // 开发模式下代理API
      // instance.post('/profiles', _this.profileForm.ymlStr
      ).then(resp => {
        if (resp && resp.status === 200) {
          // _this.dialogFormVisible = false
          _this.$emit('onSubmit')
          this.hideDialog()
        }
      })
    }
  }

}
</script>

<style scoped>

</style>
