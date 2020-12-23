<template>
  <div id="app">
    <el-row>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/index'}"><i class="el-icon-s-home" />首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/logIndex' }">日志管理</el-breadcrumb-item>
        <el-breadcrumb-item>设备日志</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row>
      <!--表格数据及操作-->
      <el-table :data="table.slice((currentPage-1)*pagesize,currentPage*pagesize)" style="width: 100%"
                :row-class-name="tableRowClassName"
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.3)"
                ref="multipleTable" tooltip-effect="dark">
        <el-table-column prop="date" label="时间" sortable>
        </el-table-column>
        <el-table-column prop="source" label="日志来源">
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
        <el-table-column prop="gatewayName" label="网关名称">
        </el-table-column>
        <el-table-column prop="gatewayIP" label="网关IP">
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
export default {
  name: 'DeviceException',
  data () {
    return {
      table: [],
      pagesize: 10,
      currentPage: 1,
      loading: false
    }
  },
  mounted () {
    this.loadDeviceException()
  },
  methods: {
    loadDeviceException () {
      var _this = this
      this.$axios
        .get('http://localhost:8000/gc/log/source/' + '设备管理').then(resp => {
        // .get('/gc/log/source/' + '设备管理').then(resp => {
          if (resp && resp.status === 200) {
            _this.table = resp.data
            _this.loading = false
          }
        }).catch(() => {
          this.$message('获取设备管理日志失败！')
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
    shenji () {
      console.log('开始审计')
      // this.get()
    }
  }
}
</script>
