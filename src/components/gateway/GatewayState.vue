<template>
    <div>
      <el-dialog
        title="查看网关状态"
        width="30%"
        :visible.sync="dialogFormVisible"
        @close="clear">
        <el-form v-model="gwState" label-width="160px" style="text-align: left">
          <el-form-item label="网关名称" prop="name">
            <el-input v-model="gwState.name" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="网关IP" prop="ip">
            <el-input v-model="gwState.ip" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="微服务总数量">
            <el-input v-model="gwState.counter" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="edgex微服务总数量">
            <el-input v-model="gwState.edgexCounter" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="网关微服务总数量">
            <el-input v-model="gwState.serviceCounter" :disabled="true"></el-input>
          </el-form-item>
        </el-form>
          <el-form v-model="edgexOffline" label-width="160px" style="text-align: left">
            <el-form-item label="未启动的edgex微服务">
              <el-input v-model="edgexOffline" :disabled="true"></el-input>
            </el-form-item>
          </el-form>
          <el-form v-model="serviceOffline" label-width="160px" style="text-align: left">
            <el-form-item label="未启动微服务">
              <el-input v-model="serviceOffline" :disabled="true"></el-input>
            </el-form-item>
          </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button @click="dialogFormVisible = false">关闭</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'GatewayState',
  data () {
    return {
      gwState: {
        name: '',
        ip: '',
        counter: 0,
        edgexCounter: 0,
        edgexOnline: 0,
        serviceCounter: 0,
        serviceOnline: 0
      },
      edgexOffline: [],
      serviceOffline: [],
      FormData: {},
      dialogFormVisible: false
    }
  },
  // mounted () {
  //   this.loadState()
  // },
  methods: {
    loadState () {
      var _this = this
      this.$axios
        .get(localStorage.socket + '/gc/state/' + this.gwState.name).then(resp => {
        // .get('/gateways/gateway/state/' + this.gwState.name).then(resp => {
          if (resp && resp.status === 200) {
            _this.FormData = resp.data
            delete _this.FormData[0].gatewayName
            delete _this.FormData[0].gatewayIP
            _this.stateCounter()
          }
        }).catch(() => {
          _this.$message('获取状态失败！')
        })
    },
    stateCounter () {
      for (var key in this.FormData[0]) {
        this.gwState.counter += 1
        if (key.indexOf('edgex') !== -1) {
          this.gwState.edgexCounter += 1
          if (this.FormData[0][key] === 'ONLINE') {
            this.gwState.edgexOnline += 1
          } else {
            this.edgexOffline.push(key)
          }
        } else if (this.FormData[0][key] === 'OFFLINE') {
          this.serviceOffline.push(key)
          this.gwState.serviceCounter += 1
        } else {
          this.gwState.serviceCounter += 1
          this.gwState.serviceOnline += 1
        }
      }
      if (this.edgexOffline.length === 0) {
        this.edgexOffline.push('无')
      }
      if (this.serviceOffline.length === 0) {
        this.serviceOffline.push('无')
      }
    },
    clear () {
      this.dialogFormVisible = false
    }
  }
}
</script>

<style scoped>

</style>
