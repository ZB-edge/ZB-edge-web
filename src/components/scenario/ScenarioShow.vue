<template>
  <div>
    <el-row>
      <el-breadcrumb separator="/" style="margin-top: 5px;font-size: 16px;margin-left: 20px">
        <el-breadcrumb-item :to="{ path: '/index'}"><i class="el-icon-s-home" />首页</el-breadcrumb-item>
        <el-breadcrumb-item>场景展示</el-breadcrumb-item>
        <el-breadcrumb-item>{{ scenarioSelect }}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row>
      <el-container>
        <el-header>
          <el-form label-width="50%" style="float: left;text-align: left;margin-top: 10px;margin-left: 0px">
            <el-form-item label="场景选择：" >
              <el-select v-model="scenarioSelect" @change="handleScenario" >
                <el-option v-for="item in scenarioList" :key="item.name" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-header>
        <el-main>
          <div class="dashboard-editor-container">
            <scenario-panel ref="scenarioPanel" />
            <el-row :gutter="32">
              <el-col :xs="24" :sm="24" :lg="24">
                <div class="chart-wrapper" style="margin-top: 50px">
                  <scenario-alert ref="scenarioAlert" />
                </div>
              </el-col>
            </el-row>
          </div>
        </el-main>
      </el-container>
    </el-row>
  </div>
</template>

<script>
import ScenarioPanel from './ScenarioPanel'
import ScenarioAlert from './ScenarioAlert'
export default {
  name: 'ScenarioShow',
  components: {ScenarioAlert, ScenarioPanel},
  data () {
    return {
      scenarioList: [],
      scenarioSelect: ''
    }
  },
  mounted () {
    this.loadScenarios()
  },
  methods: {
    loadScenarios () {
      var _this = this
      // 实际API
      // this.$axios.get('http://localhost:8092/api/scenario').then(resp => {
      // kong 网关代理API
      this.$axios.get(localStorage.socket + '/s').then(resp => {
      // this.$axios.get('http://localhost:8000/s').then(resp => {
      // 开发模式下代理API
      // this.$axios.get('/scenarios').then(resp => {
        if (resp && resp.status === 200) {
          _this.scenarioList = resp.data
        }
      }).catch(() => {
        _this.$message('加载场景列表失败！')
      })
    },
    handleScenario () {
      this.$refs.scenarioAlert.scenarioName = this.scenarioSelect
      // 实际API
      // this.$axios.get('http://localhost:8092/api/scenario/name/' + this.scenarioSelect).then(resp => {
      // kong网关代理API
      this.$axios.get(localStorage.socket + '/s/name/' + this.scenarioSelect).then(resp => {
      // this.$axios.get('http://localhost:8000/s/name/' + this.scenarioSelect).then(resp => {
      // 开发模式下代理API
      // this.$axios.get('/scenarios/name/' + this.scenarioSelect).then(resp => {
        if (resp && resp.status === 200) {
          this.$refs.scenarioPanel.gatewayNum = resp.data.content.length
          var Num = 0
          var deviceNum = []
          var deviceOnline = []
          for (var x = 0; x < resp.data.content.length; x++) {
            Num += resp.data.content[x].commands.length
            for (var i = 0; i < resp.data.content[x].commands.length; i++) {
              if (deviceNum.indexOf(resp.data.content[x].commands[i].deviceName) === -1) {
                deviceNum.push(resp.data.content[x].commands[i].deviceName)
              }
            }
            // 实际API
            // this.$axios.get('http://localhost:8081/api/device/online/' + resp.data.content[x].gatewayIP).then(resp => {
            // kong网关代理API
            this.$axios.get(localStorage.socket + '/d/online/' + resp.data.content[x].gatewayIP).then(resp => {
            // this.$axios.get('http://localhost:8000/d/online/' + resp.data.content[x].gatewayIP).then(resp => {
            // 开发模式下代理API
            // this.$axios.get('/devices/online/' + resp.data.content[x].gatewayIP).then(resp => {
              if (resp && resp.status === 200) {
                deviceOnline.concat(resp.data)
              }
            })
          }
          this.$refs.scenarioPanel.commandNum = Num
          this.$refs.scenarioPanel.deviceTotalNum = deviceNum.length
          this.$refs.scenarioPanel.deviceOnlineNum = deviceOnline.length
        }
      })
    },
    clear () {}
  }
}
</script>

<style scoped>

</style>
