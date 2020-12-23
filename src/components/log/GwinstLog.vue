<template>
  <div>
    <el-dialog
      title="请先选择网关"
      width="30%"
      :visible.sync="selectDialog">
      <el-form v-model="gwip" label-width="35%" style="text-align: left">
        <el-form-item label="选择网关">
          <el-select style="width: 240px" v-model="gwip" placeholder="请选择网关查看设备">
            <el-option v-for="(item, i) in gwList" :key="i" :label="item.ip" :value="item.ip">
              <span style="float: left">网关名称：{{ item.name }}</span>
              <span style="float: right;color: #551513;font-size: 13px">IP：{{ item.ip }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button @click="selectDialog = false">取消</el-button>
        <el-button type="primary" @click="load">确定</el-button>
      </div>
    </el-dialog>
    <log ref="GwLog" :come="come" :gwip="gwip" :urlPath="urlPath" :sourceList="sourceList"></log>
  </div>
</template>

<script>
import Log from './Log'
export default {
  name: 'GwinstLog',
  components: {Log},
  data () {
    return {
      come: '网关日志',
      urlPath: 'gc/l',
      gwip: '',
      gwList: [],
      selectDialog: false,
      sourceList: [{value: '全部', label: '全部'},
        {value: '规则引擎', label: '规则引擎'},
        {value: '网关实例', label: '网关实例'},
        {value: '网关指令', label: '网关指令'}]
    }
  },
  mounted () {
    this.selectGw()
  },
  methods: {
    selectGw () {
      // 实际API
      // this.$axios.get('http://localhost:8089/api/gateway').then(resp => {
      // kong网关代理API
      this.$axios.get(localStorage.socket + '/gc').then(resp => {
      // this.$axios.get('http://localhost:8000/gc').then(resp => {
      // 开发模式下代理API
      // this.$axios.get('/gateways').then(resp => {
        if (resp && resp.status === 200) {
          this.gwList = resp.data
          this.selectDialog = true
        }
      }).catch(() => {
        this.$message.error('获取网关信息失败！')
      })
    },
    load () {
      this.selectDialog = false
      this.$refs.GwLog.refreshLog()
    }
  }
}
</script>

<style scoped>

</style>
