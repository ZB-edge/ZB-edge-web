<template>
  <div id="app">
    <el-row>
      <el-col :span="12">
        <el-breadcrumb separator="/" style="margin-top: 5px;font-size: 16px;margin-left: 20px">
          <el-breadcrumb-item :to="{ path: '/index'}"><i class="el-icon-s-home" />首页</el-breadcrumb-item>
          <el-breadcrumb-item>日志管理</el-breadcrumb-item>
          <el-breadcrumb-item>{{ come }}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
      <el-col :span="12">
        <el-button type="text" icon="el-icon-refresh" @click="refreshLog()" style="background-color: rgba(255,255,255,1.0);border-color: rgba(255,255,255,1.0);color: #000000;padding: 0px;float: right;margin-right: 20px;margin-top:5px;font-size: 16px">刷新</el-button>
      </el-col>
    </el-row>
    <el-row>
      <div style="margin-top: 20px;margin-bottom: 30px;float: left; margin-left: 15px;">
        <el-date-picker v-model="firstDate" type="date" placeholder="请选择开始日期" style="width: 160px"></el-date-picker>
        <el-date-picker v-model="lastDate" type="date" placeholder="请选择结束日期" style="width: 160px; margin-left: 10px"></el-date-picker>
        <el-select v-model="source" placeholder="请选择日志来源" style="margin-left: 10px">
          <el-option v-for="item in sourceList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-select v-model="category" placeholder="请选择日志分类" style="margin-left: 10px">
          <el-option v-for="item in categoryList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-select v-model="operation" placeholder="请选择操作类型" style="margin-left: 10px">
          <el-option v-for="item in operationList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-button @click="search" style="margin-left: 10px">查询</el-button>
      </div>
    </el-row>
    <el-row>
      <log-echart ref="LogEchartDialog" :logs="table" v-bind:dialogVisible="chartDialog" @hideDialog="chartDialog = false" ></log-echart>
      <el-button type="success" @click="chartDialog = true" style="float: right;margin-right: 20px;margin-bottom: 5px;">日志统计图</el-button>
    </el-row>
    <el-row>
      <!--表格数据及操作-->
      <el-table :data="table.slice((currentPage-1)*pagesize,currentPage*pagesize)" style="width: 100%; "
                :row-class-name="tableRowClassName"
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.3)"
                ref="multipleTable" tooltip-effect="dark">
        <el-table-column prop="date" label="时间" sortable >
        </el-table-column>
        <el-table-column
          prop="source"
          label="日志来源"
          :filters="[
          { text: '网关管理', value: '网关管理'},
          { text: '设备管理', value: '设备管理'},
          { text: '网关实例', value: '网关实例'},
          { text: '指令管理', value: '指令'},
          { text: '场景管理', value: '场景'},
          { text: '消息路由', value: '消息路由'},
          { text: '设备模板', value: '设备模板'}]"
          :filter-method="filterSource"
          filter-placement="bottom-end">
          <template slot-scope="scope">
            <el-tag
              close-transition>{{scope.row.source}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="category"
          label="级别"
          :filters="[
          { text: '信息', value: 'info'},
          { text: '警告', value: 'warn'},
          { text: '错误', value: 'error'},
          { text: '调试', value: 'debug'}]"
          :filter-method="filterCategory"
          filter-placement="bottom-end">
          <template slot-scope="scope">
            <el-tag
              close-transition>{{scope.row.category}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="message" label="日志信息">
        </el-table-column>
<!--        <el-table-column label="操作">-->
<!--          <template slot-scope="scope">-->
<!--            <el-button type="danger" icon="el-icon-delete" size="mini" @click="del(scope.row,scope.$index)">删除</el-button>-->
<!--          </template>-->
<!--        </el-table-column>-->
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
import LogEchart from './LogEchart'
export default {
  name: 'Log',
  components: {LogEchart},
  props: {
    come: {
      type: String,
      default: '',
      required: true
    },
    urlPath: {
      type: String,
      required: true
    },
    gwip: {
      type: String,
      required: true
    },
    sourceList: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      table: [],
      chartDialog: false,
      pagesize: 4,
      currentPage: 1,
      loading: false,
      firstDate: '',
      lastDate: '',
      source: '全部',
      category: 'all',
      operation: 'all',
      categoryList: [{value: 'all', label: 'all'},
        {value: 'debug', label: 'debug'},
        {value: 'info', label: 'info'},
        {value: 'warn', label: 'warn'},
        {value: 'error', label: 'error'},
        {value: 'null', label: 'null'}],
      operationList: [{value: 'all', label: 'all'},
        {value: 'create', label: 'create'},
        {value: 'delete', label: 'delete'},
        {value: 'update', label: 'update'},
        {value: 'retrieve', label: 'retrieve'},
        {value: 'null', label: 'null'}]
    }
  },
  // mounted: function () {
  //   this.refreshLog()
  // },
  methods: {
    refreshLog () {
      if (this.come === '运维日志') {
        this.loadOamLogs()
        this.search = this.searchOamPost
      } else {
        this.loadLogs()
        this.search = this.searchPost
      }
    },
    loadLogs () {
      this.$axios
        // 实际API
        // .get(`http://${this.ip}:${this.port}/api/log`).then(resp => {
        // kong网关代理API
        .get(`${localStorage.socket}/${this.urlPath}/r?ip=${this.gwip}`).then(resp => {
        // .get(`http://localhost:8000/${this.port}/log`).then(resp => {
        // .get('http://' + this.ip + ':' + this.port + '/gi/log').then(resp => {
        // 开发模式下代理API
        // .get('/logs').then(resp => {
          if (resp && resp.status === 200) {
            this.table = resp.data
            this.loading = false
          }
        }).catch(() => {
          this.$message.error('获取日志失败!')
        })
    },
    loadOamLogs () {
      this.$axios
        // 实际API
        // .get(`http://${this.ip}:${this.port}/api/log`).then(resp => {
        // kong网关代理API
        .get(`${localStorage.socket}/${this.urlPath}/r`).then(resp => {
        // .get(`http://localhost:8000/${this.port}/log`).then(resp => {
        // .get('http://' + this.ip + ':' + this.port + '/gi/log').then(resp => {
        // 开发模式下代理API
        // .get('/logs').then(resp => {
          if (resp && resp.status === 200) {
            this.table = resp.data
            this.loading = false
          }
        }).catch(() => {
          this.$message.error('获取日志失败!')
        })
    },
    search () {},
    searchOamPost () {
      let first = `${this.firstDate.getFullYear()}/${this.firstDate.getMonth() + 1}/${this.firstDate.getDate()}`
      let last = `${this.lastDate.getFullYear()}/${this.lastDate.getMonth() + 1}/${this.lastDate.getDate()}`
      let tableData = []
      // 实际API
      // this.$axios.get(`http://${this.ip}:${this.port}/api/log?firstDate=${first}&lastDate=${last}&source=${this.source}&category=${this.category}&operation=${this.operation}`).then(resp => {
      // kong网关代理API
      this.$axios.get(`${localStorage.socket}/${this.urlPath}?firstDate=${first}&lastDate=${last}&source=${this.source}&category=${this.category}&operation=${this.operation}`).then(resp => {
        // this.$axios.get(`http://${this.ip}:${this.port}/gi/log?firstDate=${first}&lastDate=${last}&source=${this.source}&category=${this.category}&operation=${this.operation}`).then(resp => {
        // 开发模式下代理API
        // this.$axios.get(`/logs?firstDate=${first}&lastDate=${last}&source=${this.source}&category=${this.category}&operation=${this.operation}`).then(resp => {
        let data = resp.data
        for (let i = 0; i < data.length; i++) {
          let obj = {}
          obj.date = data[i].date
          obj.category = data[i].category
          obj.id = data[i].id
          obj.message = data[i].message
          obj.operation = data[i].operation
          obj.source = data[i].source
          tableData[i] = obj
        }
        this.table = tableData
      })
    },
    searchPost () {
      let first = `${this.firstDate.getFullYear()}/${this.firstDate.getMonth() + 1}/${this.firstDate.getDate()}`
      let last = `${this.lastDate.getFullYear()}/${this.lastDate.getMonth() + 1}/${this.lastDate.getDate()}`
      let tableData = []
      // 实际API
      // this.$axios.get(`http://${this.ip}:${this.port}/api/log?firstDate=${first}&lastDate=${last}&source=${this.source}&category=${this.category}&operation=${this.operation}`).then(resp => {
      // kong网关代理API
      this.$axios.get(`${localStorage.socket}/${this.urlPath}?ip=${this.gwip}&firstDate=${first}&lastDate=${last}&source=${this.source}&category=${this.category}&operation=${this.operation}`).then(resp => {
        // this.$axios.get(`http://${this.ip}:${this.port}/gi/log?firstDate=${first}&lastDate=${last}&source=${this.source}&category=${this.category}&operation=${this.operation}`).then(resp => {
      // 开发模式下代理API
      // this.$axios.get(`/logs?firstDate=${first}&lastDate=${last}&source=${this.source}&category=${this.category}&operation=${this.operation}`).then(resp => {
        let data = resp.data
        for (let i = 0; i < data.length; i++) {
          let obj = {}
          obj.date = data[i].date
          obj.category = data[i].category
          obj.id = data[i].id
          obj.message = data[i].message
          obj.operation = data[i].operation
          obj.source = data[i].source
          tableData[i] = obj
        }
        this.table = tableData
      })
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
    },
    tableRowClassName ({row, rowIndex}) {
      if (row.category === 'info') {
        return 'info-row'
      } else if (row.category === 'warn') {
        return 'warn-row'
      } else if (row.category === 'error') {
        return 'error-row'
      } else {
        return 'debug-row'
      }
    },
    filterCategory (value, row) {
      return row.category === value
    },
    filterSource (value, row) {
      return row.source === value
    }
  },
  watch: {
    come: function (newValue, oldValue) {
      if (newValue === '运维日志') {
        this.loadOamLogs()
        // this.search = this.searchOamPost
      } else {
        this.loadLogs()
        // this.search = this.searchPost
      }
    }
  }
}
</script>
<style>
  .el-table .warn-row {
    background: oldlace;
  }
  .el-table .info-row {
    background: #f0f9eb;
  }
  .el-table .error-row {
    background: #f3d19e;
  }
  .el-table .debug-row {
    background: skyblue;
  }
</style>
