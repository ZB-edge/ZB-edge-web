<template>
    <div>
      <el-row>
        <el-breadcrumb separator="/" style="margin-top: 5px;font-size: 16px;margin-left: 20px">
          <el-breadcrumb-item :to="{ path: '/index'}"><i class="el-icon-s-home" />首页</el-breadcrumb-item>
          <el-breadcrumb-item>网关管理</el-breadcrumb-item>
        </el-breadcrumb>
      </el-row>
      <el-row>
        <search-bar @onSearch="searchResult" ref="searchBar" style="margin-left: 15px;"></search-bar>
        <br>
        <!--新增按钮-->
        <el-button type="success" icon="el-icon-circle-plus-outline" size="mini"  style="float: right;margin-right: 20px;margin-bottom: 5px;" @click="createDialog = true">新增
        </el-button>
        <div>
          <el-dialog
            title="新增网关信息"
            :visible.sync="createDialog"
            width="30%"
            @close="clear">
            <el-form v-model="gwForm" label-width="40%" style="text-align: left">
              <el-form-item label="网关名称" prop="name">
                <el-input v-model="gwForm.name" autocomplete="off" placeholder="请输入网关名称"></el-input>
              </el-form-item>
              <el-form-item label="网关IP地址" prop="ip">
                <el-input v-model="gwForm.ip" autocomplete="off" placeholder="请输入网关IP地址"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align: center;">
              <el-button type="primary" @click="createOnSubmit">确定</el-button>
              <el-button @click="clear">取消</el-button>
            </div>
          </el-dialog>
        </div>
        <div>
          <el-dialog
            title="修改网关IP地址"
            :visible.sync="editDialog"
            width="30%"
            @close="clear">
            <el-form v-model="gwEdit" label-width="120px" style="text-align: left">
              <el-form-item label="网关名称" prop="name">
                <el-input v-model="gwEdit.name" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="创建时间" prop="created">
                <el-input v-model="gwEdit.created" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="网关IP地址" prop="ip">
                <el-input v-model="gwEdit.ip" autocomplete="off" placeholder="请输入新的IP地址"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="editOnSubmit">确定</el-button>
              <el-button @click="clear">取消</el-button>
            </div>
          </el-dialog>
        </div>
        <div>
          <el-dialog
            title="网关恢复"
            width="30%"
            :visible.sync="recoverDialog"
            @close="recoverClear">
            <el-form v-model="gwRecoverForm" label-width="120px" style="text-align: left">
              <el-form-item label="网关名称" prop="name">
                <el-input v-model="gwRecoverForm.name" autocomplete="off" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="网关IP地址" prop="ip">
                <el-input v-model="gwRecoverForm.ip" autocomplete="off" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="选择版本">
                <el-select v-model="gwRecoverForm.version">
                  <el-option v-for="item in versionList" :key="item.version" :label="item.version" :value="item.version"></el-option>
                </el-select>
              </el-form-item>
<!--              <el-form-item label="恢复项：">-->
<!--                <el-switch v-model="gwRecoverForm.command" inactive-text="指令" active-color="#13ce66" inactive-color="#ff4949" active-value="1" inactive-value="0"></el-switch>-->
<!--                <el-switch v-model="gwRecoverForm.deviceprofile" inactive-text="设备模板" active-color="#13ce66" inactive-color="#ff4949" active-value="1" inactive-value="0"></el-switch>-->
<!--                <el-switch v-model="gwRecoverForm.deviceservice" inactive-text="设备服务" active-color="#13ce66" inactive-color="#ff4949" active-value="1" inactive-value="0"></el-switch>-->
<!--                <el-switch v-model="gwRecoverForm.export" inactive-text="导出层" active-color="#13ce66" inactive-color="#ff4949" active-value="1" inactive-value="0"></el-switch>-->
<!--                <el-switch v-model="isDisplay" inactive-text="设备" active-color="#13ce66" inactive-color="#ff4949" active-value="inline" inactive-value="none"></el-switch>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="设备管理ip" prop="device" :style="{display: isDisplay}">-->
<!--                <el-input v-model="gwRecoverForm.deviceIp" autocomplete="off" placeholder="请输入需恢复的设备管理服务器IP"></el-input>-->
<!--              </el-form-item>-->
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="recoverOnSubmit">确定</el-button>
              <el-button @click="recoverClear">取消</el-button>
            </div>
          </el-dialog>
        </div>
        <br>
<!--        <gateway-state ref="gatewayState"></gateway-state>-->
        <el-table
          ref="multipleTable"
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.3)"
          :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
          tooltip-effect="dark"
          stripe
          style="width: 100%;"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="index"
            label="序号"
            align="center">
          </el-table-column>
          <el-table-column
            prop="name"
            label="网关名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="ip"
            label="IP地址"
            align="center">
          </el-table-column>
          <el-table-column
            prop="created"
            label="创建时间"
            align="center">
          </el-table-column>
          <el-table-column
            label="网关状态"
            width="250%"
            align="center">
            <template slot-scope="scope">
              <ul style="text-align: left">
                <li v-for="(value, key) in scope.row.state" :key="key">
                  {{ key }} : {{ value }}
                </li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="400%"
            align="center">
            <template slot-scope="scope">
<!--              <el-button-->
<!--                size="mini"-->
<!--                @click="handleState(scope.$index, scope.row)">查询网关状态</el-button>-->
              <el-button
                size="mini"
                type="warning"
                @click="handleEdit(scope.$index, scope.row)">修改IP</el-button>
              <el-button
                size="mini"
                type="primary"
                @click="handleBackup(scope.$index, scope.row)">备份</el-button>
              <el-button
                size="mini"
                type="success"
                @click="handleRecover(scope.$index, scope.row)">恢复</el-button>
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
// import GatewayState from './GatewayState'
export default {
  name: 'Gateway',
  components: {SearchBar},
  data () {
    return {
      currentPage: 1,
      pagesize: 8,
      tableData: [],
      gwForm: {
        name: '',
        ip: ''
      },
      gwEdit: {
        name: '',
        ip: '',
        created: ''
      },
      createDialog: false,
      editDialog: false,
      recoverDialog: false,
      versionList: [],
      gwRecoverForm: {
        name: '',
        ip: '',
        version: ''
      },
      multipleSelection: [],
      loading: true
    //   gwState: {
    //     counter: 0,
    //     edgexCounter: 0,
    //     edgexOnline: 0,
    //     serviceCounter: 0,
    //     serviceOnline: 0
    //   },
    //   edgexOffline: [],
    //   serviceOffline: []
    }
  },
  mounted () {
    this.loadGateways()
  },
  methods: {
    loadGateways () {
      let data = []
      this.$axios
        // 实际API
        // .get('http://localhost:8089/api/gateway').then(resp => {
        // kong网关代理API
        .get(localStorage.socket + '/gc').then(resp => {
        // .get('http://localhost:8000/gc').then(resp => {
        // 开发模式下代理API
        // .get('/gateways').then(resp => {
          if (resp && resp.status === 200) {
            data = resp.data
            for (let item in data) {
              // 实际API
              // this.$axios.get('http://localhost:8089/api/gateway/state/' + data[item].name).then(state => {
              // kong网关代理API
              this.$axios.get(localStorage.socket + '/gc/state/' + data[item].name).then(state => {
              // this.$axios.get('http://localhost:8000/gc/state/' + data[item].name).then(state => {
              // 开发模式下代理API
              // this.$axios.get('/gateways/state/' + data[item].name).then(state => {
                if (state && state.status === 200) {
                  data[item].state = state.data.state
                }
              }).catch(() => {
                this.$message.error('获取网关微服务状态信息失败！')
              })
            }
            this.tableData = data
            this.loading = false
          }
        })
    },
    clear () {
      this.createDialog = false
      this.editDialog = false
      this.gwForm = {
        name: '',
        ip: ''
      }
      this.gwEdit = {
        name: '',
        ip: '',
        created: ''
      }
    },
    recoverClear () {
      this.recoverDialog = false
      this.versionList = []
      this.gwRecoverForm = {
        name: '',
        ip: '',
        version: ''
      }
    },
    createOnSubmit () {
      const _this = this
      this.$axios
        // 实际API
      // .post('http://localhost:8089/api/gateway', {
        // kong网关代理API
        .post(localStorage.socket + '/gc', {
        // .post('http://localhost:8000/gc', {
        // 开发模式下代理API
        // .post('/gateways', {
          name: _this.gwForm.name,
          ip: _this.gwForm.ip
        }).then(resp => {
          if (resp && resp.status === 200) {
            _this.loadGateways()
            _this.$message.success('添加网关信息成功！')
            _this.createDialog = false
          }
        }).catch(e => {
          this.$message.error('添加失败' + e)
        })
    },
    editOnSubmit () {
      const _this = this
      this.$axios
        // 实际API
      // .put('http://localhost:8089/api/gateway', {
        // kong网关代理API
        .put(localStorage.socket + '/gc', {
        // .put('http://localhost:8000/gc', {
        // 开发模式下代理API
        // .put('/gateways', {
          name: _this.gwEdit.name,
          ip: _this.gwEdit.ip,
          created: _this.gwEdit.created
        }).then(resp => {
          if (resp && resp.status === 200) {
            _this.editDialog = false
            _this.$message.success('修改网关信息成功！')
            _this.loadGateways()
          }
        }).catch(e => {
          _this.$message.error('修改失败' + e)
        })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
    },
    // handleState (index, row) {
    //   this.$refs.gatewayState.gwState.name = row.name
    //   this.$refs.gatewayState.gwState.ip = row.ip
    //   this.$refs.gatewayState.dialogFormVisible = true
    // },
    handleEdit (index, row) {
      this.editDialog = true
      this.gwEdit.name = row.name
      this.gwEdit.created = row.created
    },
    handleBackup (index, tablerow) {
      this.$axios
        // 实际API
        // .get('http://localhost:8089/api/gateway/copy/' + tablerow.ip).then(resp => {
        // kong 网关代理API
        .get(localStorage.socket + '/gc/copy/' + tablerow.ip).then(resp => {
        // .get('http://localhost:8000/gc/copy/' + tablerow.ip).then(resp => {
        // 开发模式下代理API
        // .get('/gateways/copy/' + tablerow.ip).then(resp => {
          if (resp && resp.status === 200) {
            this.$message({
              showClose: true,
              type: 'success',
              message: '备份成功！'

            })
          }
        }).catch(() => {
          this.$message.error('备份失败！')
        })
    },
    handleRecover (index, row) {
      // 实际API
      // this.$axios.get('http://localhost:8089/api/gateway/version/' + row.ip).then(resp => {
      // kong网关代理API
      this.$axios.get(localStorage.socket + '/gc/version/' + row.ip).then(resp => {
      // this.$axios.get('http://localhost:8000/gc/version/' + row.ip).then(resp => {
      // 开发模式下代理API
      // this.$axios.get('/gateways/version/' + row.ip).then(resp => {
        if (resp && resp.status === 200) {
          this.versionList = resp.data
          this.recoverDialog = true
          this.gwRecoverForm.name = row.name
          this.gwRecoverForm.ip = row.ip
        }
      }).catch(() => {
        this.$message.error('获取网关备份版本信息失败！')
      })
    },
    recoverOnSubmit () {
      const _this = this
      this.$axios
        // 实际API
      // .post('http://localhost:8089/api/gateway/recover/ip/' + _this.gwRecoverForm.ip + '/version/' + _this.gwRecoverForm.version).then(resp => {
        // kong网关代理API
        .post(localStorage.socket + '/gc/recover/ip/' + _this.gwRecoverForm.ip + '/version/' + _this.gwRecoverForm.version).then(resp => {
        // .post('http://localhost:8000/gc/recover/ip/' + _this.gwRecoverForm.ip + '/version/' + _this.gwRecoverForm.version).then(resp => {
        // 开发模式代理API
        // .post('/gateways/recover/ip/' + _this.gwRecoverForm.ip + '/version/' + _this.gwRecoverForm.version).then(resp => {
          if (resp && resp.status === 200) {
            let command = ''
            let edgeXDevice = ''
            let edgeXService = ''
            let edgeXExport = ''
            for (let x in resp.data) {
              if (x === 'command') {
                command = resp.data.command
              } else if (x === 'edgeXDevice') {
                for (let i in resp.data[x]) {
                  edgeXDevice = i + ':' + resp.data[x][i] + ';'
                }
              } else if (x === 'edgeXService') {
                for (let i in resp.data[x]) {
                  edgeXService = i + ':' + resp.data[x][i] + ';'
                }
              } else if (x === 'edgeXExport') {
                for (let i in resp.data[x]) {
                  edgeXExport = i + ':' + resp.data[x][i] + ';'
                }
              } else {
                this.$message.warning('恢复成功！')
              }
              // _this.$message({
              //   showClose: true,
              //   dangerouslyUseHTMLString: true,
              //   type: 'success',
              //   message: x + '： ' + resp.data[x]
              // })
            }
            _this.$message({
              showClose: true,
              dangerouslyUseHTMLString: true,
              type: 'success',
              message: '<ul><li>command:' + command + '</li><li>edgeXDevice:' + edgeXDevice + '</li><li>edgeXService:' + edgeXService + '</li><li>edgeXEport:' + edgeXExport + '</li></ul>'
            })
            _this.recoverClear()
          }
        }).catch(e => {
          _this.$message.error('恢复失败!')
        })
    },
    handleDelete (index, tablerow) {
      const _this = this
      this.$confirm('此操作将永久删除该网关，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'waring'
      }).then(() => {
        this.$axios
          // 实际API
          // .delete('http://localhost:8089/api/gateway/' + tablerow.name).then(resp => {
          // kong网关代理API
          .delete(localStorage.socket + '/gc' + tablerow.name).then(resp => {
          // .delete('http://localhost:8000/gc' + tablerow.name).then(resp => {
          // 开发模式代理API
          // .delete('/gateways/' + tablerow.name).then(resp => {
            if (resp && resp.status === 200) {
              _this.loadGateways()
            }
          })
      }).catch(() => {
        this.message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    searchResult (e) {
      let _this = this
      this.$axios
        .get(localStorage.socket + '/gc/search?keywords=' + e, {
        // .get('/gateways/search?keywords=' + e, {
        }).then(resp => {
          if (resp && resp.status === 200) {
            _this.tableData = resp.data
          }
        }).catch(() => {
          this.$message.error('搜索失败!')
        })
    }
  }
}
</script>

<style scoped>

</style>
