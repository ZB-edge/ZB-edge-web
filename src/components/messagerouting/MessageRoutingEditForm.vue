<template>
    <div>
      <el-dialog
        title="新增消息路由"
        width="30%"
        :visible.sync="createDialog"
        @close="clear">
        <el-form v-model="FormData" label-width="40%" style="text-align: left">
          <el-form-item label="消息路由名称">
            <el-input v-model="FormData.name" placeholder="请输入消息路由名称"></el-input>
          </el-form-item>
          <el-form-item label="传入队列">
            <el-input v-model="FormData.incomingQueue" placeholder="请输入传入队列名称"></el-input>
          </el-form-item>
          <el-form-item label="传出队列">
            <el-input v-model="FormData.outgoingQueue" placeholder="请输入传出队列名称"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button type="primary" @click="onSubmit">确定</el-button>
          <el-button @click="clear">取消</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'MessageRoutingEditForm',
  data () {
    return {
      FormData: {
        name: '',
        incomingQueue: '',
        outgoingQueue: ''
      }
    }
  },
  props: {
    createDialog: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  methods: {
    clear () {
      this.FormData = {
        name: '',
        incomingQueue: '',
        outgoingQueue: ''
      }
      this.$emit('hideDialog')
    },
    onSubmit () {
      var _this = this
      this.$axios
        // 实际API
        // .post('http://localhost:8084/api/router', _this.FormData).then(resp => {
        // kong网关代理API
        .post(localStorage.socket + '/mqr', _this.FormData).then(resp => {
        // .post('http://localhost:8000/mqr', _this.FormData).then(resp => {
        // 开发模式下代理API
        // .post('/mqr', _this.FormData).then(resp => {
          if (resp && resp.status === 200) {
            _this.$emit('onSubmit')
            _this.clear()
          }
        }).catch(() => {
          this.$message.error('添加消息路由失败！')
        })
    }
  }
}
</script>

<style scoped>

</style>
