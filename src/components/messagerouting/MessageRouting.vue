<template>
  <div id="MessageRouting">
    <el-row>
      <el-breadcrumb separator="/" style="margin-top: 5px;font-size: 16px;margin-left: 20px">
        <el-breadcrumb-item :to="{ path: '/index'}"><i class="el-icon-s-home" />首页</el-breadcrumb-item>
        <el-breadcrumb-item>消息路由</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row>
      <search-bar @onSearch="searchResult" ref="searchBar" style="margin-left: 15px;"></search-bar>
      <br>
      <!--新增按钮-->
      <el-button type="success" icon="el-icon-circle-plus-outline" size="mini"  style="float: right;margin-bottom: 5px;margin-right: 20px;" @click="createDialog = true">新增
      </el-button>
      <br>
      <message-routing-edit-form :createDialog="createDialog" @onSubmit="loadMessageRouting" @hideDialog="createDialog = false" ref="messageRoutingEditForm"></message-routing-edit-form>
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
        <el-table-column prop="name" label="消息路由名称"></el-table-column>
        <el-table-column prop="incomingQueue" label="消息来源"></el-table-column>
        <el-table-column prop="outgoingQueue" label="消息去向"></el-table-column>
        <el-table-column prop="created" label="创建时间"></el-table-column>
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
import MessageRoutingEditForm from './MessageRoutingEditForm'
import SearchBar from '../common/SearchBar'
export default {
  name: 'MessageRouting',
  components: {SearchBar, MessageRoutingEditForm},
  data () {
    return {
      table: [],
      pagesize: 18,
      currentPage: 1,
      createDialog: false,
      loading: true
    }
  },
  mounted () {
    this.loadMessageRouting()
  },
  methods: {
    loadMessageRouting () {
      this.$axios
        // 实际API
        // .get('http://localhost:8084/api/router').then(resp => {
        // kong网关代理API
        .get(localStorage.socket + '/mqr').then(resp => {
        // .get('http://localhost:8000/mqr').then(resp => {
        // 开发模式下代理API
        // .get('/mqr').then(resp => {
          if (resp && resp.status === 200) {
            this.table = resp.data
            this.loading = false
          }
        }).catch(() => {
          this.$message.error('加载消息路由失败!')
        })
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
    },
    handleDelete (index, row) {
      this.$confirm('此操作将永久删除该路由，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'waring'
      }).then(() => {
        this.$axios
          // 实际API
          // .delete('http://localhost:8084/api/router/name/' + row.name).then(resp => {
          // kong网关代理API
          .delete(localStorage.socket + '/mqr/name/' + row.name).then(resp => {
          // .delete('http://localhost:8000/mqr/name/' + row.name).then(resp => {
          // 开发模式下代理API
          // .delete('/mqr/name/' + row.name).then(resp => {
            if (resp && resp.status === 200) {
              this.loadMessageRouting()
            }
          })
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '删除操作已取消!'
        })
      })
    },
    searchResult (e) {
      var _this = this
      this.$axios
        .get(localStorage.socket + '/mqr/search?keywords=' + e).then(resp => {
        // .get('/mqr/search?keywords=' + e).then(resp => {
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
