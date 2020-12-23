<template>
  <div id="GatewayExport">
    <div>
      <el-dialog
        title="请先选择网关"
        width="30%"
        :visible.sync="selectDialog">
        <el-form v-model="gwip" label-width="40%" style="text-align: left">
          <el-form-item label="选择网关">
            <el-select style="width: 240px" v-model="gwip" placeholder="请选择网关查看设备">
              <el-option v-for="(item, i) in gwList" :key="i" :label="item.ip" :value="item.ip">
                <span style="float: left">网关名称：{{ item.name }}</span>
                <span style="float: right;color: #551513;font-size: 13px">IP：{{ item.ip }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center;">
          <el-button type="primary" @click="loadTopic">确定</el-button>
          <el-button @click="selectDialog = false">取消</el-button>
        </div>
      </el-dialog>
    </div>
    <el-row>
      <el-breadcrumb separator="/" style="margin-top: 5px;font-size: 16px;margin-left: 20px">
        <el-breadcrumb-item :to="{ path: '/index'}"><i class="el-icon-s-home" />首页</el-breadcrumb-item>
        <el-breadcrumb-item>数据导出</el-breadcrumb-item>
        <el-breadcrumb-item>ip: {{gwip}}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-dialog
      title="注册云端"
      width="30%"
      :visible.sync="regDialog"
      @close="regClear">
      <el-form v-model="regForm" label-width="40%" style="text-align: left">
        <el-form-item label="云端名称">
          <el-input v-model="regForm.name" placeholder="名称不可重复"></el-input>
        </el-form-item>
        <el-form-item label="云端IP地址">
          <el-input v-model="regForm.address" placeholder="请输入IP地址"></el-input>
        </el-form-item>
        <el-form-item label="消息发布者">
          <el-input v-model="regForm.publisher" placeholder="请输入发布者"></el-input>
        </el-form-item>
        <el-form-item label="消息队列帐户">
          <el-input v-model="regForm.admin" placeholder="请输入账户"></el-input>
        </el-form-item>
        <el-form-item label="消息队列密码">
          <el-input type="password" v-model="regForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="主题类型">
          <el-input v-model="regForm.topic" placeholder="请输入主题" ></el-input>
        </el-form-item>
        <!--<el-form-item label="数据内容">-->
          <!--<el-input v-model="regForm.deviceIdentifiers" placeholder="选填"></el-input>-->
        <!--</el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button type="primary" @click="regSubmit">确定</el-button>
        <el-button @click="regClear">取消</el-button>
      </div>
    </el-dialog>
    <el-row>
      <br>
      <el-button type="success" icon="el-icon-circle-plus-outline" size="mini"  style="float: right;margin-right: 20px;margin-bottom: 5px;" @click="regDialog = true">注册云端信息
      </el-button>
    </el-row>
    <el-row>
      <!--表格数据及操作-->
      <el-table :data="table.slice((currentPage-1)*pagesize,currentPage*pagesize)" style="width: 100%"
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.3)"
                stripe ref="multipleTable" tooltip-effect="dark">
        <!--勾选框-->
        <!--      <el-table-column type="selection" width="55">-->
        <!--      </el-table-column>-->
        <!--序号-->
        <el-table-column type="index" label="序号" width="80">
        </el-table-column>
        <!--表头-->
        <el-table-column prop="name" label="云端名称"></el-table-column>
        <el-table-column prop="addressable.address" label="云端地址"></el-table-column>
        <el-table-column prop="addressable.publisher" label="消息发布者"></el-table-column>
        <el-table-column prop="addressable.topic" label="发布主题"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <!--分页条-->
    <el-row>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pagesize"
        :total="table.length">
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
import SearchBar from '../common/SearchBar'
export default {
  name: 'GatewayExport',
  components: {
    SearchBar
  },
  data () {
    return {
      table: [],
      pagesize: 8,
      currentPage: 1,
      createDialog: false,
      loading: true,
      regDialog: false,
      gwList: [],
      gwip: '',
      selectDialog: false,
      regForm: {
        name: '',
        address: '',
        publisher: '',
        admin: '',
        password: '',
        topic: '',
        deviceIdentifiers: ''
      }
    }
  },
  mounted () {
    this.selectGw()
    // this.loadDevices()
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
    loadTopic () {
      this.$axios
      // 实际API
      // .get('http://localhost:8089/api/gateway/export' + this.gwip).then(resp => {
      // kong网关代理API
        .get(localStorage.socket + '/gc/e/' + this.gwip).then(resp => {
          // 开发模式下代理API
          // .get('/instances/export'+this.gwip).then(resp => {
          if (resp && resp.status === 200) {
            this.table = resp.data
            this.loading = false
            this.selectDialog = false
          }
        }).catch(() => {
          this.$message.error('数据导出失败!')
        })
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
    },
    handleDelete (index, row) {
      this.$confirm('此操作将永久删除该信息，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'waring'
      }).then(() => {
        this.$axios
        // 实际API
        // .delete('http://localhost089/api/gateway/export/' + this.gwip + '/' + row.addressable.name).then(resp => {
        // kong网关代理API
          .delete(localStorage.socket + '/gc/e/' + this.gwip + '/' + row.name).then(resp => {
            // 开发模式下代理API
            // .delete('/instances/export/' + this.gwip + '/' + row.addressable.name).then(resp => {
            if (resp && resp.status === 200) {
              this.loadTopic()
            }
          })
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '删除操作已取消!'
        })
      })
    },
    regClear () {
      this.regForm = {
        name: '',
        address: '',
        publisher: '',
        admin: '',
        password: '',
        topic: ''
        // deviceIdentifiers: []
      }
      this.regDialog = false
    },
    regSubmit () {
      this.$axios
        // 实际API
        // .post('http://localhost:8089/api/gateway/export/' + this.gwip + '/?name=' + this.regForm.name + '&address=' + this.regForm.address + '&publisher=' + this.regForm.publisher + '&admin=' + this.reForm.admin + '&password='+ this.regForm.password + '&topic=' + this.regForm.topic + '&deviceIdentifiers=' + this.regForm.deviceIdentifiers).then(resp => {
        // kong网关代理API
        .post(localStorage.socket + '/gc/e/' + this.gwip + '?name=' + this.regForm.name + '&address=' + this.regForm.address + '&publisher=' + this.regForm.publisher + '&admin=' + this.regForm.admin + '&password=' + this.regForm.password + '&topic=' + this.regForm.topic + '&deviceIdentifiers= " "').then(resp => {
          if (resp && resp.status === 200) {
            this.loadTopic()
            this.regDialog = false
          }
        }).catch(() => {
          this.$message.error('消息注册失败!')
        })
    }
  }
}
</script>
