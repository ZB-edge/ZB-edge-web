<template>
  <div>
    <el-row>
      <el-breadcrumb separator="/" style="margin-top: 5px;font-size: 16px;margin-left: 20px">
        <el-breadcrumb-item :to="{ path: '/index'}"><i class="el-icon-s-home" />首页</el-breadcrumb-item>
        <el-breadcrumb-item>场景服务</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row>
      <search-bar @onSearch="searchResult" ref="searchBar" style="margin-left: 15px"></search-bar>
      <!--新增按钮-->
      <el-button type="success" icon="el-icon-circle-plus-outline" size="mini"  style="float: right;margin-right: 20px;margin-bottom: 5px;" @click="createDialog = true">新增
      </el-button>
      <div>
        <el-dialog
          title="新增/修改场景服务"
          :visible.sync="createDialog"
          width="30%"
          @close="clear">
          <el-form label-width="40%" style="text-align: left" ref="dataForm">
            <el-form-item label="场景服务名称">
              <el-input v-model="scenarioEdit.name" autocomplete="off" placeholder="请输入场景服务名称"></el-input>
            </el-form-item>
            <el-form-item label="选择网关">
              <el-select v-model="gwIndex" placeholer="请选择网关" @change="handleGW">
                <el-option v-for="(item, i) in gwList" :key="i" :label="item.name" :value="i">
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ip}}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="设备及命令">
              <el-select v-model="command" multiple placeholder="请选择设备及命令">
                <el-option v-for="(item, i) in commandList" :key="i" :label="item.commandName" :value="i">
                  <span style="float: left">指令：{{ item.commandName }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">设备：{{ item.deviceName}}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="规则引擎">
              <el-select v-model="scenarioEdit.rules" multiple placeholder="请配置规则引擎">
                <el-option v-for="(item, i) in ruleList" :key="i" :label="item.ruleName" :value="item.ruleName"></el-option>
              </el-select>
            </el-form-item>
            <!--          <el-form-item label="服务命令内容">-->
            <!--            <el-input type="textarea" :row="10" v-model="form.command" autocomplete="off" placeholder="请输入要执行的命令名称JSON数组，如: [{'name':'1'},{'name':'2'}]"></el-input>-->
            <!--          </el-form-item>-->
          </el-form>
          <div slot="footer" class="dialog-footer" style="text-align: center">
            <el-button type="primary" @click="onSubmit">确定</el-button>
            <el-button @click=clear>取消</el-button>
          </div>
        </el-dialog>
      </div>

      <scenario-device-state ref="scenarioDeviceState"></scenario-device-state>
      <el-table
        ref="multipleTable"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.3)"
        :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
        tooltip-effect="dark"
        stripe
        style="width: 100%;">
        <el-table-column
          prop="name"
          label="服务名称">
        </el-table-column>
        <el-table-column
          label="网关名称及IP">
          <template slot-scope="scope">
              <li v-for="item in scope.row.content" :key="item.index">{{ item.gatewayName }} : {{ item.gatewayIP }}</li>
          </template>
        </el-table-column>
        <el-table-column
          label="设备及指令"
          width="500px">
          <template slot-scope="scope">
            <ul v-for="(item, i) in scope.row.content" :key="i">
              <li v-for="(subItem, j) in item.commands" :key="j">
                <span>device: {{ subItem.deviceName }}</span><br />
                <span>command: {{ subItem.commandName }}</span>
              </li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column label="规则" width="100px">
          <template slot-scope="scope">
            <li v-for= "(item, i) in scope.row.rules" :key="i">{{ item }}</li>
          </template>
        </el-table-column>
        <el-table-column
          label="创建日期"
          prop="created">
        </el-table-column>
        <el-table-column
          label="操作"
          width="250px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleStatus(scope.$index, scope.row)">查看设备状态</el-button>
<!--            <el-button-->
<!--              size="mini"-->
<!--              @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>-->
<!--            <el-button-->
<!--              size="mini"-->
<!--              type="success"-->
<!--              @click="handleShow(scope.$index, scope.row)">场景展示</el-button>-->
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pagesize"
        :total="tableData.length">
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
import SearchBar from '../common/SearchBar'
import ScenarioDeviceState from './ScenarioDeviceState'
import ScenarioShow from './ScenarioShow'
export default {
  name: 'ScenarioServcie',
  components: {ScenarioShow, ScenarioDeviceState, SearchBar},
  data () {
    return {
      currentPage: 1,
      pagesize: 18,
      tableData: [],
      loading: true,
      createDialog: false,
      gwList: [],
      ruleList: [],
      commandList: [],
      gwIndex: '',
      command: [],
      gwAndDevice: {
        gatewayName: '',
        gatewayIP: '',
        commands: []
      },
      scenarioEdit: {
        name: '',
        rules: [],
        content: []
      }
    }
  },
  mounted () {
    this.loadScenarios()
  },
  methods: {
    loadScenarios () {
      var _this = this
      this.$axios
        // 实际API
        // .get('http://localhost:8092/api/scenario').then(resp => {
        // kong网关代理API
        .get(localStorage.socket + '/s').then(resp => {
        // .get('http://localhost:8000/s').then(resp => {
        // 开发模式下代理API
        // .get('/scenarios').then(resp => {
          if (resp && resp.status === 200) {
            _this.tableData = resp.data
            _this.loading = false
          }
        }).catch(() => {
          _this.$message.error('数据加载失败！')
        })
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
    },
    handleStatus (index, tablerow) {
      // 实际API
      // this.$axios.get('http://localhost:8092/api/scenario/status/' + tablerow.name).then(resp => {
      // kong网关代理API
      this.$axios.get(localStorage.socket + '/s/status/' + tablerow.name).then(resp => {
      // this.$axios.get('http://localhost:8000/s/status/' + tablerow.name).then(resp => {
      // 开发模式下代理API
      // this.$axios.get('/scenarios/status/' + tablerow.name).then(resp => {
        if (resp && resp.status === 200) {
          this.$refs.scenarioDeviceState.statusData = resp.data
          this.$refs.scenarioDeviceState.dialogFormVisible = true
        }
      }).catch(() => {
        this.$message.error('获取状态信息失败！')
      })
    },
    handleUpdate (index, row) {

    },
    handleDelete (index, tablerow) {
      this.$confirm('此操作将永久删除该场景，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'waring'
      }).then(() => {
        this.$axios
          // 实际API
          // .delete('http://localhost:8092/api/scenario/name/' + tablerow.name, {
          // kong网关代理API
          .delete(localStorage.socket + '/s/name/' + tablerow.name, {
          // .delete('http://localhost:8000/s/name/' + tablerow.name, {
          // 开发模式下代理API
          // .delete('/scenarios/name/' + tablerow.name, {
          }).then(resp => {
            if (resp && resp.status === 200) {
              this.$message.success('已删除场景服务：' + tablerow.name)
              this.loadScenarios()
            }
          })
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '删除操作已取消！'
        })
      })
    },
    getGWList () {
      // 实际API
      // this.$axios.get('http://localhost:8089/api/gateway').then(resp => {
      // kong网关代理API
      this.$axios.get(localStorage.socket + '/gc').then(resp => {
      // this.$axios.get('http://localhost:8000/gc').then(resp => {
      // 开发模式代理API
      // this.$axios.get('/gateways').then(resp => {
        if (resp && resp.status === 200) {
          this.gwList = resp.data
        }
      }).catch(() => {
        this.$message.error('获取网关信息失败！请重试！')
      })
      this.getRuleList()
    },
    handleGW () {
      this.gwAndDevice.gatewayName = this.gwList[this.gwIndex].name
      this.gwAndDevice.gatewayIP = this.gwList[this.gwIndex].ip
      // 实际API
      // this.$axios.get('http://localhost:8082/api/command/list').then(resp => {
      // kong网关代理API
      this.$axios.get(localStorage.socket + '/cc/' + this.gwAndDevice.gatewayName).then(resp => {
      // this.$axios.get('http://localhost:8000/c/list').then(resp => {
      // 开发模式下代理API
      // this.$axios.get('/commands/list').then(resp => {
        if (resp && resp.status === 200) {
          this.commandList = resp.data
        }
      }).catch(() => {
        this.$message.error('获取指令列表失败！')
      })
    },
    getRuleList () {
      // 实际API
      // this.$axios.get('http://localhost:8083/api/getRuleLists').then(resp => {
      // kong网关代理API
      this.$axios.get(localStorage.socket + '/rL').then(resp => {
      // this.$axios.get('http://localhost:8000/rc/getRuleLists').then(resp => {
      // 开发模式下代理API
      // this.$axios('/rules/getRuleLists').then(resp => {
        if (resp && resp.status === 200) {
          this.ruleList = resp.data
        }
      }).catch(() => {
        this.$message.error('获取规则失败！')
      })
    },
    clear () {
      this.createDialog = false
      this.gwIndex = ''
      this.command = []
      this.gwAndDevice = {
        gatewayName: '',
        gatewayIP: '',
        commands: []
      }
      this.scenarioEdit = {
        name: '',
        rules: [],
        content: []
      }
    },
    onSubmit () {
      let item = {}
      for (let x in this.command) {
        let y = this.command[x]
        item.commandName = this.commandList[y].commandName
        item.deviceName = this.commandList[y].deviceName
        this.gwAndDevice.commands.push(item)
        item = {}
      }
      this.scenarioEdit.content.push(this.gwAndDevice)
      this.$axios
        // 实际API
        // .post('http://localhost:8092/api/scenario', this.scenarioEdit).then(resp => {
        // kong网关代理API
        .post(localStorage.socket + '/s', this.scenarioEdit).then(resp => {
        // .post('http://localhost:8000/s', this.scenarioEdit).then(resp => {
        // 开发模式下代理API
        // .post('/scenarios', this.scenarioEdit).then(resp => {
          if (resp && resp.status === 200) {
            this.createDialog = false
            this.loadScenarios()
          }
        })
    },
    searchResult (e) {
      var _this = this
      this.$axios
        .get(localStorage.socket + '/s/search?keywords=' + e, {
        // .get('http://localhost:8000/s/search?keywords=' + e, {
        // .get('/s/search?keywords=' + e, {
        }).then(resp => {
          if (resp && resp.status === 200) {
            _this.tableData = resp.data
          }
        }).catch(() => {
          this.$message.error('搜索失败！')
        })
    }
  },
  watch: {
    createDialog: function (newValue, oldValue) {
      if (newValue) {
        this.getGWList()
      }
    }
  }
}
</script>

<style scoped>

</style>
