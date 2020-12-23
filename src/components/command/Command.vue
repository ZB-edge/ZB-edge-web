<template>
    <div>
      <div>
        <el-dialog
          title="请先选择网关"
          width="30%"
          :visible.sync="selectDialog">
          <el-form v-model="gname" label-width="40%" style="text-align: left">
            <el-form-item label="选择网关">
              <el-select style="width: 240px" v-model="gname" placeholder="请选择网关查看设备">
                <el-option v-for="(item, i) in gwList" :key="i" :label="item.name" :value="item.name">
                  <span style="float: left">网关名称：{{ item.name }}</span>
                  <span style="float: right;color: #551513;font-size: 13px">IP：{{ item.ip }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer" style="text-align: center;">
            <el-button type="primary" @click="loadCommands">确定</el-button>
            <el-button @click="selectDialog = false">取消</el-button>
          </div>
        </el-dialog>
      </div>
      <el-row>
        <el-breadcrumb separator="/" style="margin-top: 5px;font-size: 16px;margin-left: 20px">
          <el-breadcrumb-item :to="{ path: '/index'}"><i class="el-icon-s-home" />首页</el-breadcrumb-item>
          <el-breadcrumb-item>指令管理</el-breadcrumb-item>
        </el-breadcrumb>
      </el-row>
      <el-row>
        <search-bar @onSearch="searchResult" ref="searchBar" style="margin-left: 15px"></search-bar>
        <br>
        <!--新增按钮-->
        <el-button type="success" icon="el-icon-circle-plus-outline" size="mini"  style="float: right;margin-bottom: 5px;margin-right: 20px" @click="createDialog = true">新增
        </el-button>
        <br>
        <command-edit-form ref="CommandEditForm" :gname="gname" :createDialog="createDialog" @hideDialog="createDialog = false" @onSubmit="loadCommands()"></command-edit-form>
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
            type="index"
            width="50"
            label="序号">
          </el-table-column>
          <el-table-column label="名称" prop="name"></el-table-column>
          <el-table-column label="指令ID" prop="commandId"></el-table-column>
          <el-table-column label="指令名称" prop="commandName"></el-table-column>
          <el-table-column label="指令类型" prop="commandType"></el-table-column>
          <el-table-column label="设备ID" prop="deviceId"></el-table-column>
          <el-table-column label="设备名称" prop="deviceName"></el-table-column>
          <el-table-column label="指令等级" prop="level"></el-table-column>
          <el-table-column label="命令详情" prop="jsonObject"></el-table-column>
          <el-table-column label="描述" prop="description"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
<!--              <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
import CommandEditForm from './CommandEditForm'
export default {
  name: 'Command',
  components: {SearchBar, CommandEditForm},
  data () {
    return {
      currentPage: 1,
      pagesize: 8,
      tableData: [],
      gwList: [],
      gname: '',
      selectDialog: false,
      createDialog: false,
      loading: true
    }
  },
  mounted () {
    this.selectGw()
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
    loadCommands () {
      this.$axios
        // 实际API
        // .get('http://localhost:8094/api/commandconfig/' + this.cnpmcngname).then(resp => {
        // kong网关代理API
        .get(localStorage.socket + '/cc/' + this.gname).then(resp => {
        // .get('http://localhost:8000/cc/'this.gname).then(resp => {
        // 开发模式下代理API
        // .get('/commands').then(resp => {
          if (resp && resp.status === 200) {
            let table = resp.data
            for (let x in table) {
              table[x].jsonObject = JSON.stringify(table[x].jsonObject)
            }
            this.tableData = table
            this.loading = false
            this.selectDialog = false
          }
        }).catch(() => {
          this.$message.error('获取指令信息失败！')
        })
    },
    handleDelete (index, row) {
      var _this = this
      this.$confirm('此操作将永久删除该模板，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'waring'
      }).then(() => {
        this.$axios
          // kong网关代理API
          .delete(localStorage.socket + '/cc/' + this.gname + '?commandname=' + row.name).then(resp => {
          // .delete('http://localhost:8000/cc/'+ this.gwname +'?commandname=' + row.name).then(resp => {
          // 实际API
          // .delete('http"//localhost:8094/api/commandconfig/'+this.gwname+'?commandname=' + row.name).then(resp => {
          // 开发模式下代理API
          // .delete('/commands?name=' + row.name).then(resp => {
            if (resp && resp.status === 200) {
              _this.loadCommands()
            }
          })
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '删除操作已取消!'
        })
      })
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
    },
    searchResult (e) {
      let _this = this
      this.$axios
        .get(localStorage.socket + '/c/search?keywords=' + e, {
        // .get('/commands/search?keywords=' + e, {
        }).then(resp => {
          if (resp && resp.status === 200) {
            _this.tableData = resp.data
          }
        }).catch(() => {
          this.$message.error('搜索失败！')
        })
    }
  }
}
</script>

<style scoped>

</style>
