<template>
  <div id="app">
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
          <el-button type="primary" @click="loadDevices">确定</el-button>
          <el-button @click="selectDialog = false">取消</el-button>
        </div>
      </el-dialog>
    </div>
    <el-row>
      <el-col :span="12">
        <el-breadcrumb separator="/" style="margin-top: 5px;font-size: 16px;margin-left: 20px">
          <el-breadcrumb-item :to="{ path: '/index'}"><i class="el-icon-s-home" />首页</el-breadcrumb-item>
          <el-breadcrumb-item>设备管理</el-breadcrumb-item>
          <el-breadcrumb-item>ip: {{gwip}}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
      <el-col :span="12">
          <el-button type="text" icon="el-icon-refresh" @click="loadDevices" style="background-color: rgba(255,255,255,1.0);border-color: rgba(255,255,255,1.0);color: #000000;padding: 0px;float: right;margin-right: 20px;margin-top:5px;font-size: 16px">刷新</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="11" style="margin-left: 15px">
        <search-bar @onSearch="searchResult" ref="searchBar"></search-bar>
      </el-col>
      <el-col :span="11" style="margin-left: 5%">
        <div  style="margin-top: 20px;margin-bottom: 30px;float: right">
          <el-button type="success" icon="el-icon-guide">网关选择：</el-button>
          <el-select v-model="gwip" placeholder="请选择网关查看设备" @change="loadDevices">
            <el-option v-for="(item, i) in gwList" :key="i" :label="item.ip" :value="item.ip">
              <span style="float: left">网关名称：{{ item.name }}</span>
              <span style="float: right;color: #551513;font-size: 13px">IP：{{ item.ip }}</span>
            </el-option>
          </el-select>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <!--新增按钮-->
      <el-button type="success" icon="el-icon-circle-plus-outline" size="mini"  style="float: right;margin-right: 20px;margin-bottom: 5px;" @click="editDialog = true">新增
      </el-button>
      <br>
      <device-edit-form :gwList="gwList" :editDialog="editDialog" @onSubmit="loadDevices" @hideDialog="editDialog = false" ref="deviceEdit"></device-edit-form>
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
      <el-table-column type="selection">
      </el-table-column>
      <!--序号-->
      <el-table-column
        type="index"
        width="50"
        label="序号">
      </el-table-column>
      <!--表头-->
      <el-table-column prop="name" label="设备名称">
      </el-table-column>
      <el-table-column prop="id" label="设备ID">
      </el-table-column>
      <el-table-column label="支持协议">
        <template slot-scope="scope">
          <span v-for="(item, key) in scope.row.protocols" :key="key">{{ key }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="profile" label="设备模板">
      </el-table-column>
      <el-table-column prop="service" label="服务">
      </el-table-column>
      <el-table-column prop="description" label="设备描述">
      </el-table-column>
      <el-table-column prop="adminState" label="管理状态">
      </el-table-column>
      <el-table-column prop="operatingState" label="操作状态">
      </el-table-column>
      <el-table-column prop="createdTime" label="创建时间">
      </el-table-column>
      <el-table-column label="操作" width="250px">
        <template slot-scope="scope">
          <el-button type="success" icon="el-icon-edit" size="mini" @click="handleTest(scope.$index, scope.row)">测试</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
<!--          <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleTest(scope.$index, scope.row)">test</el-button>-->
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
import DeviceEditForm from './DeviceEditForm'
export default {
  components: {DeviceEditForm, SearchBar},
  data () {
    return {
      table: [],
      pagesize: 8,
      currentPage: 1,
      loading: true,
      gwList: [],
      gwip: '',
      selectDialog: false,
      editDialog: false
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
    loadDevices () {
      this.selectDialog = false
      var _this = this
      this.$axios
        // 实际API
        // .get('http://localhost:8081/api/device/ip/' + this.gwip).then(resp => {
        // kong网关代理API
        .get(localStorage.socket + '/d/ip/' + this.gwip).then(resp => {
        // .get('http://localhost:8000/d/ip/' + this.gwip).then(resp => {
        // 开发模式代理API
        // .get('/devices/ip/' + this.gwip).then(resp => {
          if (resp && resp.status === 200) {
            _this.table = resp.data
            _this.loading = false
          }
        }).catch(() => {
          this.$message.error('拉取设备列表失败！')
        })
    },
    createDevice () {
      this.$refs.deviceEdit.dialogFormVisible = true
    },
    // handleChart (index, row) {
    //   var date = new Date()
    //   var data1 = []
    //   var data2 = []
    //   this.$axios.get('/surveillances/surveillance/' + row.id).then(resp => {
    //     if (resp && resp.status === 200) {
    //       var type = Object.keys(resp.data)
    //       console.log(type)
    //       data1.push([date, resp.data[type[0]]])
    //       data2.push([date, resp.data[type[1]]])
    //       if (data1.length > 60) {
    //         data1.shift()
    //         data2.shift()
    //       }
    //       this.$refs.deviceMonitor.dataForm.type = type
    //       this.$refs.deviceMonitor.dataForm.data1 = data1
    //       this.$refs.deviceMonitor.dataForm.data2 = data2
    //       this.$refs.deviceMonitor.dialogFormVisible = true
    //     }
    //   })
    // },
    handleDelete (index, row) {
      var _this = this
      this.$confirm('此操作将永久删除该设备，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'waring'
      }).then(() => {
        this.$axios
          // 实际API
          // .delete('http://localhost:8081/api/device/ip/' + this.gwip + '/name/' + row.name).then(resp => {
          // kong网关代理API
          .delete(localStorage.socket + '/d/ip/' + this.gwip + '/name/' + row.name).then(resp => {
          // .delete('http://localhost:8000/d/ip/' + this.gwip + '/name/' + row.name).then(resp => {
          // 开发模式下代理API
          // .delete('/devices/ip/' + this.gwip + '/name/' + row.name).then(resp => {
            if (resp && resp.status === 200) {
              _this.loadDevices()
            }
          })
      }).catch(() => {
        this.message({
          type: 'error',
          message: '已取消删除'
        })
      })
    },
    handleTest (index, row) {
      // 实际API
      // this.$axios.get('http://localhost:8081/api/device/details/' + this.gwip + '/' + row.id).then(resp => {
      // kong网关代理API
      this.$axios.get(localStorage.socket + '/d/details/' + this.gwip + '/' + row.id).then(resp => {
      // this.$axios.get('http://localhost:8000/d/details/' + this.gwip + '/' + row.id).then(resp => {
      // 开发模式下代理API
      // this.$axios.get('/devices/details/' + this.gwip + '/' + row.id).then(resp => {
        if (resp && resp.status === 200) {
          if (JSON.stringify(resp.data) === '{}') {
            this.$message.error('当前设备读数异常，请检查设备连接!')
          } else {
            this.$message.success('当前设备读数为：' + JSON.stringify(resp.data))
          }
        }
      }).catch(() => {
        this.$message.error('连接设备失败！')
      })
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
    },
    searchResult (e) {
      var _this = this
      this.$axios
        // 实际API
        // .get('http://localhost:8081/api/device/ip/' + this.gwip + '/' + e).then(resp => {
        // kong网关代理API
        .get(localStorage.socket + '/d/ip/' + this.gwip + '/' + e).then(resp => {
        // .get('http://localhost:8000/d/ip/' + this.gwip + '/' + e).then(resp => {
        // 开发模式下代理API
        // .get('/devices/ip/' + this.gwip + '/' + e).then(resp => {
          if (resp && resp.status === 200) {
            _this.table = resp.data
          }
        }).catch(() => {
          this.$message.error('搜索失败！')
        })
    }
  }

}

</script>
