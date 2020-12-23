<template>
  <div id="app" class="rulePage">
    <el-row>
      <el-breadcrumb separator="/" style="margin-top: 5px;font-size: 16px;margin-left: 20px">
        <el-breadcrumb-item :to="{ path: '/index'}"><i class="el-icon-s-home" />首页</el-breadcrumb-item>
        <el-breadcrumb-item>规则引擎</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row >
      <search-bar @onSearch="searchResult" ref="searchBar" style="margin-left: 15px"></search-bar>
      <br>
      <!--新增按钮-->
      <el-button type="success" icon="el-icon-circle-plus-outline" size="mini"  style="float: right;margin-right: 20px;margin-bottom: 5px;" @click="dialogCreateVisible = true">新增
      </el-button>
      <br>
      <!--表格数据及操作-->
      <el-table :data="table.slice((currentPage-1)*pagesize,currentPage*pagesize)"
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.3)" style="width: 100%" stripe ref="multipleTable" tooltip-effect="dark">
        <!--勾选框-->
        <el-table-column type="selection" width="30px">
        </el-table-column>
        <!--序号-->
        <el-table-column label="序号" width="50px">
          <template slot-scope="scope">
            {{scope.$index+1}}
          </template>
        </el-table-column>
        <!--表头-->
        <el-table-column prop="ruleName" label="规则名称" width="80px">
        </el-table-column>
        <el-table-column prop="ruleCondition" label="规则条件1" width="250px">
          <template slot-scope="scope">
            {{scope.row.device}}:{{scope.row.parameter}}{{scope.row.ruleJudge}}{{scope.row.ruleParaThreshold}}
          </template>
        </el-table-column>
        <el-table-column prop="rule2" label="规则条件2" width="280px">
        </el-table-column>
        <el-table-column prop="rule3" label="规则条件3" width="280px">
        </el-table-column>
        <el-table-column prop="rule4" label="规则条件4" width="280px">
        </el-table-column>
        <el-table-column prop="rule5" label="规则条件5" width="280px">
        </el-table-column>
        <el-table-column prop="ruleExecute" label="执行功能" width="120px">
        </el-table-column>
        <el-table-column prop="service" label="服务" width="80px">
        </el-table-column>
        <el-table-column prop="gateway" label="网关" width="80px">
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="del(scope.row,scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <!--分页条-->
    <el-row >
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pagesize"
        :total="table.length">
      </el-pagination>
    </el-row>

    <el-dialog
      title="新建规则"
      :visible.sync="dialogCreateVisible"
      width="85%"
      :before-close="handleClose"
    >
      <div>
        <el-form ref="form" :model="form" label-width="70px" class="ruleForm">
          <el-row>
            <el-col :span="24">
              <el-form-item label="规则名称">
                <el-input v-model="form.ruleName"  placeholder="请输入内容" style="width: 100%"></el-input>
              </el-form-item>
              <el-form-item label="网关选择">
<!--                <el-input v-model="form.gateway"  placeholder="请输入内容" style="width: 100%;"></el-input>-->
                <el-select v-model="gateway" placeholder="请选择网关" @change="loaddeviceandcommand" style="width: 100%">
                  <el-option v-for="(item, i) in gateways" :key="i" :label="item.ip" :value="item.ip">
                    <span style="float: left">网关名称：{{ item.value }}</span>
                    <span style="float: right;color: #551513;font-size: 13px">IP：{{ item.ip }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-row>
                <el-col :span="3">
                  <el-form-item label="规则配置">
                  </el-form-item>
                </el-col>
                <el-col :span="4" style="margin-left: 5%">
                  <el-form-item label="设备选择" >
                    <el-select v-model="form.device" placeholder="请选择设备" style="width:100%">
                      <el-option v-for="item in devices" :key="item.id" :label="item.name" :value="item.name"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4" style="margin-left: 0.5%">
                  <el-form-item label="设备参数">
                    <el-select v-model="form.parameter" placeholder="请选择参数" style="width:100%">
                      <el-option v-for="item in paras" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4" style="margin-left: 0.5%">
                  <el-form-item label="规则条件">
                    <el-select v-model="form.ruleJudge" placeholder="请选择规则条件" style="width:100%">
                      <el-option label="大于" value=">"></el-option>
                      <el-option label="小于" value="<"></el-option>
                      <el-option label="等于" value="="></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4" style="margin-left: 0.5%">
                  <el-form-item label="参数门限">
                    <el-input v-model="form.ruleParaThreshold"  placeholder="请输入内容"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <el-form-item  label-width="18%">
                    <el-button type="primary" @click="addNewRule" icon="el-icon-plus" circle size="small"></el-button>
                  </el-form-item>
                </el-col>
                <div v-for="(item, index) in form.dynamicItem" :key="index">
                  <el-col :span="3" >
                    <el-form-item label="逻辑" :prop="'dynamicItem.' + index"  label-width="40px" style="margin-left: 30px">
                      <el-select v-model="item.logic" placeholder="请选择逻辑" style="width:100%" >
                        <el-option label="且" value="且"></el-option>
                        <el-option label="或" value="或"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4" style="margin-left: 5%">
                    <el-form-item label="设备选择" :prop="'dynamicItem.' + index" >
                      <el-select v-model="item.device" placeholder="请选择设备" style="width:100%">
                        <el-option v-for="item1 in devices" :key="item1.id" :label="item1.name" :value="item1.name"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4" style="margin-left: 0.5%">
                    <el-form-item label="设备参数" :prop="'dynamicItem.' + index">
                      <el-select v-model="item.parameter" placeholder="请选择参数" style="width:100%">
                        <el-option v-for="item1 in paras" :key="item1.value" :label="item1.label" :value="item1.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4" style="margin-left: 0.5%">
                    <el-form-item label="规则条件" :prop="'dynamicItem.' + index">
                      <el-select v-model="item.ruleJudge" placeholder="请选择规则条件" style="width:100%">
                        <el-option label="大于" value=">"></el-option>
                        <el-option label="小于" value="<"></el-option>
                        <el-option label="等于" value="="></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4" style="margin-left: 0.5%">
                    <el-form-item label="参数门限" :prop="'dynamicItem.' + index">
                      <el-input v-model="item.ruleParaThreshold"  placeholder="请输入内容"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="3" style="margin-left: 0.5%">
                    <el-form-item  label-width="20px">
                      <el-button type="primary" @click="addNewRule" icon="el-icon-plus" circle size="small"></el-button>
                      <el-button type="primary" @click="deleteNewRule(item,index)" icon="el-icon-minus" circle size="small"></el-button>
                    </el-form-item>
                  </el-col>
                </div>
              </el-row>
              <el-form-item label="执行功能">
                <el-select v-model="form.ruleExecute" placeholder="请选择功能" style="width:100%" class="line">
                  <el-option label="告警" value="告警"></el-option>
                  <el-option label="告警且操作设备" value="告警且操作设备"></el-option>
                  <el-option label="操作设备" value="操作设备"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="指令名称">
                <el-select v-model="form.service" placeholder="请选择指令" style="width:100%" class="line">
                  <el-option v-for="item in services" :key="item.id" :label="item.name" :value="item.name"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div >
        <span slot="footer" class="dialog-footer" style="text-align: center" >
          <el-button type="primary" @click="onSubmit()">确定</el-button>
          <el-button @click="dialogCreateVisible = false">取 消</el-button>
      </span>
      </div>

    </el-dialog>
  </div>
</template>

<script>
import SearchBar from '../common/SearchBar'
export default {
  components: {SearchBar},
  data () {
    return {
      paras: [{value: '温度', label: '温度'}, {value: '湿度', label: '湿度'}],
      devices: [{value: 'temp and humidity device', label: 'temp and humidity device'}, {value: 'temp and humidity device2', label: 'temp and humidity device2'}],
      services: [{value: '服务一', label: '服务一'}, {value: '服务二', label: '服务二'}],
      scenarios: [{value: '场景一', label: '场景一'}, {value: '场景二', label: '场景二'}],
      gateways: [{value: '网关一', label: '场景一'}, {value: '网关二', label: '场景二'}],
      form: {
        device: '',
        ruleName: '',
        parameter: '',
        ruleJudge: '',
        ruleParaThreshold: '',
        ruleExecute: '',
        service: '',
        dynamicItem: [],
        gateway: ''
      },
      loading: true,
      dialogCreateVisible: false,
      table: [],
      dialogVisible: false,
      activeIndex: '1',
      activeIndex2: '1',
      userIndex: 0,
      pagesize: 10,
      currentPage: 1,
      gateway: '',
      gatewayname: '',
      gwList: []
    }
  },
  created: function () {
    this.get()
    // this.getFormDevices()
    // this.getFormParas()
    // this.getFormService()
    this.getGateway()
  },
  methods: {
    onSubmit () {
      this.dialogCreateVisible = false
      this.post()
      this.get()
      this.add()
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {
        })
    },
    loaddeviceandcommand () {
      for (let obj of this.gateways) {
        if (obj['ip'] === this.gateway) {
          this.gatewayname = obj['value']
        }
      }
      this.loadDevices()
      this.loadCommands()
    },
    loadDevices () {
      this.devices = []
      // this.getFormDevices()
      this.selectDialog = false
      var _this = this
      this.$axios
        // 实际API
        // .get('http://localhost:8081/api/device/ip/' + this.gwip).then(resp => {
        // kong网关代理API
        .get(localStorage.socket + '/d/ip/' + this.gateway).then(resp => {
        // .get('http://localhost:8000/d/ip/' + this.gwip).then(resp => {
        // 开发模式代理API
        // .get('/devices/ip/' + this.gwip).then(resp => {
          console.log('+++++++++++++设备++++++++++++++++', resp.data)
          if (resp && resp.status === 200) {
            // _this.table = resp.data
            _this.devices = resp.data
            _this.loading = false
          }
        }).catch(() => {
          this.$message.error('拉取设备列表失败！')
        })
    },
    loadCommands () {
      this.services = []
      // this.getFormService()
      this.selectDialog = false
      var _this = this
      this.$axios
        // 实际API
        // .get('http://localhost:8094/api/commandconfig/' + this.gname).then(resp => {
        // kong网关代理API
        .get(localStorage.socket + '/cc/' + this.gatewayname).then(resp => {
        // .get(localStorage.socket + '/cc/' + this.gateway).then(resp => {
        // .get('http://localhost:8000/cc/'this.gname).then(resp => {
        // 开发模式下代理API
        // .get('/commands').then(resp => {
          console.log('++++++++++++++++++++++++++', resp)
          if (resp && resp.status === 200) {
            // _this.table = resp.data
            _this.services = resp.data
            _this.loading = false
          }
        }).catch(() => {
          this.$message.error('拉取指令列表失败！')
        })
    },
    add () {
      for (var i = 0; i < this.form.dynamicItem.length; i++) {
        var rule = 'rule' + (i + 2)
        this.form[rule] = this.form.dynamicItem[0].logic + ' ' + this.form.dynamicItem[i].device + ':' + this.form.dynamicItem[i].parameter + this.form.dynamicItem[i].ruleJudge + this.form.dynamicItem[i].ruleParaThreshold
      }
      this.table.push(this.form)
      this.form = {
        device: '',
        ruleName: '',
        parameter: '',
        ruleJudge: '',
        ruleParaThreshold: '',
        ruleExecute: '',
        service: '',
        // scenario: '',
        gateway: '',
        dynamicItem: []
      }
    },
    del (row, idx) {
      this.$confirm('确认删除？')
        .then(_ => {
          this.table.splice(idx, 1)
          // kong网关代理API
          this.$axios.post(localStorage.socket + '/rD',
            // this.$axios.post('http://localhost:8000/rc/ruleDelete',
            // 实际API
            // this.$axios.post('http://localhost:8083/api/ruleDelete',
            // 开发模式下代理API
            // this.$axios.post('/rules/ruleDelete',
            {
              'ruleName': row.ruleName,
              'ruleId': row.ruleId,
              'gateway': row.gateway
            }
          ).then(res => {
            console.log('------------------------------------', res)
          })
        })
        .catch(_ => {
        })
      this.get()
    },
    post () {
      // kong网关代理API
      this.$axios.post(localStorage.socket + '/rR',
        // this.$axios.post('http://localhost:8000/rc/webdata',
        // 实际API
        // this.$axios.post('http://localhost:8083/api/webdata',
        // 开发模式下代理API
        // this.$axios.post('/rules/webdata',
        {
          'ruleName': this.form.ruleName,
          'rulePara': this.form.parameter,
          'ruleJudge': this.form.ruleJudge,
          'ruleParaThreshold': this.form.ruleParaThreshold,
          'ruleExecute': this.form.ruleExecute,
          'service': this.form.service,
          'device': this.form.device,
          // 'scenario': this.form.scenario,
          'otherRules': this.form.dynamicItem,
          'gateway': this.gateway
        }
      ).then(res => {
      })
      this.ruleSave()
    },
    ruleSave () {
      // kong网关代理API
      this.$axios.post(localStorage.socket + '/rS',
        // this.$axios.post('http://localhost:8000/rc/ruleCreate',
        // 实际API
        // this.$axios.post('http://localhost:8083/api/ruleCreate',
        // 开发模式下代理API
        // this.$axios.post('/rules/ruleCreate',
        {
          'ruleName': this.form.ruleName,
          'rulePara': this.form.parameter,
          'ruleJudge': this.form.ruleJudge,
          'ruleParaThreshold': this.form.ruleParaThreshold,
          'ruleExecute': this.form.ruleExecute,
          'service': this.form.service,
          'device': this.form.device,
          // 'scenario': this.form.scenario,
          'otherRules': this.form.dynamicItem,
          'gateway': this.gateway
        }
      ).then(res => {
      })
    },
    get () {
      var _this = this
      // kong网关代理API
      this.$axios.get(localStorage.socket + '/rL').then(resp => {
        console.log(resp.data)
        // this.$axios.get('http://localhost:8000/rc/getRuleLists').then(resp => {
        // 实际API
        // this.$axios.get('http://localhost:8083/api/getRuleLists').then(resp => {
        // 开发模式下代理API
        // this.$axios.get('/rules/getRuleLists').then(resp => {
        var data = []
        for (var x = 0; x < resp.data.length; x++) {
          var obj = {}
          obj.ruleName = resp.data[x].ruleName
          obj.ruleParaThreshold = resp.data[x].threshold
          obj.ruleJudge = resp.data[x].ruleJudge
          obj.parameter = resp.data[x].parameter
          obj.ruleExecute = resp.data[x].ruleExecute
          obj.ruleId = resp.data[x].ruleId
          obj.service = resp.data[x].service
          obj.device = resp.data[x].device
          obj.gateway = resp.data[x].gateway
          for (var i = 0; i < resp.data[x].otherRules.length; i++) {
            var rule = 'rule' + (i + 2)
            obj[rule] = resp.data[x].otherRules[i].logic + ' ' + resp.data[x].otherRules[i].device + ':' + resp.data[x].otherRules[i].parameter + resp.data[x].otherRules[i].ruleJudge + resp.data[x].otherRules[i].ruleParaThreshold
          }
          data[x] = obj
        }
        if (resp && resp.status === 200) {
          _this.table = data
          _this.loading = false
        }
      })
    },
    // getgateway() {
    // },
    getFormDevices () {
      // kong网关代理API
      this.$axios.get(localStorage.socket + '/d/ip/' + this.gateway).then(resp => {
      // this.$axios.get(localStorage.socket + '/d/ip/127.0.0.1').then(resp => {
        // this.$axios.get('http://localhost:8000/d/ip/127.0.0.1').then(resp => {
        // 实际API
        // this.$axios.get('http://localhost:8081/api/device/ip/127.0.0.1').then(resp => {
        // 开发模式下代理API
        // this.$axios.get('/devices/ip/127.0.0.1').then(resp => {
        var data = []
        for (var x = 0; x < resp.data.length; x++) {
          var obj = {}
          obj.label = resp.data[x].name
          obj.value = resp.data[x].name
          data[x] = obj
        }
        this.devices = data
      })
    },
    getFormParas () {
      // kong网关代理API
      this.$axios.get(localStorage.socket + '/cc/l').then(resp => {
        // this.$axios.get('http://localhost:8000/c/list').then(resp => {
        // 实际API
        // this.$axios.get('http://localhost:8082/api/command/list').then(resp => {
        // 开发模式下代理API
        // this.$axios.get('/commands/list').then(resp => {
        var data = []
        for (var x = 0; x < resp.data.length; x++) {
          var obj = {}
          obj.label = resp.data[x].commandName
          obj.value = resp.data[x].commandName
          data[x] = obj
        }
        this.paras = data
      })
    },
    getFormScenario () {
      // kong网关代理API
      this.$axios.get(localStorage.socket + '/s').then(resp => {
        // this.$axios.get('http://localhost:8000/s').then(resp => {
        // 实际API
        // this.$axios.get('http://localhost:8092/api/scenario').then(resp => {
        // 开发模式下代理API
        // this.$axios.get('/scenarios').then(resp => {
        var data = []
        for (var x = 0; x < resp.data.length; x++) {
          var obj = {}
          obj.label = resp.data[x].name
          obj.value = resp.data[x].name
          data[x] = obj
        }
        this.scenarios = data
      })
    },
    getFormService () {
      // kong网关代理API
      this.$axios.get(localStorage.socket + '/cc').then(resp => {
        // this.$axios.get('http://localhost:8000/c').then(resp => {
        // 实际API
        // this.$axios.get('http://localhost:8082/api/command').then(resp => {
        // 开发模式下代理API
        // this.$axios.get('/commands/').then(resp => {
        var data = []
        for (var x = 0; x < resp.data.length; x++) {
          var obj = {}
          obj.label = resp.data[x].name
          obj.value = resp.data[x].name
          data[x] = obj
        }
        this.services = data
      })
    },
    getGateway () {
      // kong网关代理API
      this.$axios.get(localStorage.socket + '/gc').then(resp => {
        // this.$axios.get('http://localhost:8000/c').then(resp => {
        // 实际API
        // this.$axios.get('http://localhost:8082/api/command').then(resp => {
        // 开发模式下代理API
        // this.$axios.get('/commands/').then(resp => {
        var data = []
        for (var x = 0; x < resp.data.length; x++) {
          var obj = {}
          obj.label = resp.data[x].name
          obj.value = resp.data[x].name
          obj.ip = resp.data[x].ip
          data[x] = obj
        }
        this.gateways = data
      })
    },
    addNewRule () {
      this.form.dynamicItem.push({
        logic: '',
        device: '',
        parameter: '',
        ruleJudge: '',
        ruleParaThreshold: ''
      })
    },
    deleteNewRule (item, index) {
      this.form.dynamicItem.splice(index, 1)
    },
    searchResult (e) {
      var searchTable = []
      for (var x = 0; x < this.table.length; x++) {
        if (this.table[x].ruleName.indexOf(e) !== -1 ||
            this.table[x].ruleParaThreshold.toString().indexOf(e) !== -1 ||
            this.table[x].parameter.indexOf(e) !== -1 ||
            this.table[x].rule2.indexOf(e) !== -1 ||
            this.table[x].rule3.indexOf(e) !== -1 ||
            this.table[x].rule4.indexOf(e) !== -1 ||
            this.table[x].rule5.indexOf(e) !== -1 ||
            this.table[x].service.indexOf(e) !== -1 ||
            this.table[x].ruleExecute.indexOf(e) !== -1 ||
            this.table[x].device.indexOf(e) !== -1) {
          var obj = {}
          obj.ruleName = this.table[x].ruleName
          obj.ruleParaThreshold = this.table[x].ruleParaThreshold
          obj.ruleJudge = this.table[x].ruleJudge
          obj.parameter = this.table[x].parameter
          obj.ruleExecute = this.table[x].ruleExecute
          obj.ruleId = this.table[x].ruleId
          obj.service = this.table[x].service
          obj.device = this.table[x].device
          obj.rule2 = this.table[x].rule2
          obj.rule3 = this.table[x].rule3
          obj.rule4 = this.table[x].rule4
          obj.rule5 = this.table[x].rule5
          // obj.scenario = resp.data[x].scenario
          searchTable[x] = obj
        }
      }
      this.table = searchTable
    }
  }
}
</script>

<style>
  el-select-dropdown__item{
    width: 50%
  }
  .line  {
    width: 100%;
  }
</style>
