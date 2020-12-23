<template>
  <div id="FaceDataShow">
    <el-row>
      <el-breadcrumb separator="/" style="margin-top: 5px;font-size: 16px;margin-left: 20px">
        <el-breadcrumb-item :to="{ path: '/index'}"><i class="el-icon-s-home" />首页</el-breadcrumb-item>
        <el-breadcrumb-item>面部识别</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row>
      <search-bar @onSearch="searchResult" ref="searchBar" style="margin-left: 15px"></search-bar>
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
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="time" label="识别时间"></el-table-column>
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
  name: 'FaceDataShow',
  components: {
    SearchBar},
  data () {
    return {
      table: [],
      pagesize: 15,
      currentPage: 1,
      createDialog: false,
      loading: true
    }
  },
  mounted () {
    this.loadFace()
  },
  methods: {
    loadFace () {
      this.$axios
        // 实际API
        // .get('http://192.168.1.106:8086/api/recent').then(resp => {
        // kong网关代理API
        .get(localStorage.socket + '/o/recent').then(resp => {
        // 开发模式下代理API
        // .get('/mqr/allSubscribe').then(resp => {
          if (resp && resp.status === 200) {
            this.table = resp.data
            this.loading = false
          }
        }).catch(() => {
          this.$message.error('加载面部信息失败!')
        })
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
    },
    searchResult (e) {
      var _this = this
      this.$axios
        // .get('http://192.168.1.106:8086/api/log?name=' + e).then(resp => {
        .get(localStorage.socket + '/o/log?name=' + e).then(resp => {
          if (resp && resp.status === 200) {
            _this.table = resp.data
          }
        }).catch(() => {
          this.$message.error('搜索失败!')
        })
    }
  }
}
</script>
