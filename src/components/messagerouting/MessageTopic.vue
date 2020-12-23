<template>
  <div id="MessageTopic">
    <el-row>
      <el-breadcrumb separator="/" style="margin-top: 5px;font-size: 16px;margin-left: 20px">
        <el-breadcrumb-item :to="{ path: '/index'}"><i class="el-icon-s-home" />首页</el-breadcrumb-item>
        <el-breadcrumb-item>发布订阅</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-dialog
      title="消息订阅"
      width="30%"
      :visible.sync="subscribeDialog"
      @close="subscribeClear">
      <el-form v-model="subscribeForm" label-width="40%" style="text-align: left">
        <el-form-item label="微服务名称">
          <el-select v-model="subscribeForm.serviceName" placeholder="请选择微服务名称">
            <el-option
              v-for="item in serviceList"
              :key="item.index"
              :label="item.label"
              :value="item.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订阅主题">
          <el-input v-model="subscribeForm.subTopic" placeholder="请输入主题名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button type="primary" @click="subscribeSubmit">确定</el-button>
        <el-button @click="subscribeClear">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="消息发布"
      width="30%"
      :visible.sync="addsubDialog"
      @close="addsubClear">
      <el-form v-model="addsubForm" label-width="40%" style="text-align: left">
        <el-form-item label="微服务名称">
          <el-select v-model="addsubForm.serviceName" placeholder="请选择微服务名称">
            <el-option
              v-for="item in serviceList"
              :key="item.index"
              :label="item.label"
              :value="item.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主题名称">
          <el-input v-model="addsubForm.topic" placeholder="请输入主题名称"></el-input>
        </el-form-item>
        <el-form-item label="消息内容">
          <el-input v-model="addsubForm.message" placeholder="请输入消息内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button type="primary" @click="addsubSubmit">确定</el-button>
        <el-button @click="addsubClear">取消</el-button>
      </div>
    </el-dialog>
    <el-row>
      <search-bar @onSearch="searchResult" ref="searchBar" style="margin-left: 15px;"></search-bar>
      <br>
      <el-button type="success" icon="el-icon-circle-plus-outline" size="mini"  style="float: right;margin-right: 20px;margin-bottom: 5px;" @click="subscribeDialog = true">订阅
      </el-button>
      <el-button type="success" icon="el-icon-circle-plus-outline" size="mini"  style="float: right;margin-right: 20px;margin-bottom: 5px;" @click="addsubDialog = true">发布
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
        <el-table-column prop="serviceName" label="微服务名称"></el-table-column>
        <el-table-column prop="subTopic" label="订阅主题"></el-table-column>
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
import SearchBar from '../common/SearchBar'
export default {
  name: 'MessageTopic',
  components: {
    SearchBar},
  data () {
    return {
      table: [],
      pagesize: 18,
      currentPage: 1,
      createDialog: false,
      loading: true,
      subscribeDialog: false,
      addsubDialog: false,
      subscribeForm: {
        serviceName: '',
        subTopic: ''
      },
      addsubForm: {
        serviceName: '',
        topic: '',
        message: ''
      },
      serviceList: [
        {
          index: 1,
          label: '服务管理'
        }, {
          index: 2,
          label: '运维监控'
        }, {
          index: 3,
          label: '设备管理'
        }, {
          index: 4,
          label: '网关管理'
        }, {
          index: 5,
          label: '场景管理'
        }, {
          index: 6,
          label: '模板管理'
        }
      ]
    }
  },
  mounted () {
    this.loadMessageTopic()
  },
  methods: {
    loadMessageTopic () {
      this.$axios
      // 实际API
      // .get('http://localhost:8084/api/router/allSubscribe').then(resp => {
      // kong网关代理API
        .get(localStorage.socket + '/r/aS/').then(resp => {
        // 开发模式下代理API
        // .get('/mqr/allSubscribe').then(resp => {
          if (resp && resp.status === 200) {
            this.table = resp.data
            this.loading = false
          }
        }).catch(() => {
          this.$message.error('加载失败!')
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
          // .delete('http://localhost:8084/api/router/subscribe?serviceName=指令管理&subTopic=7').then(resp => {
          // kong网关代理API
          .delete(localStorage.socket + '/r/sub?serviceName=' + row.serviceName + '&subTopic=' + row.subTopic).then(resp => {
          // .delete('http://localhost:8000/mqr/name/' + row.name).then(resp => {
          // 开发模式下代理API
          // .delete('/mqr/name/' + row.name).then(resp => {
            if (resp && resp.status === 200) {
              this.loadMessageTopic()
            }
          })
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '删除操作已取消!'
        })
      })
    },
    subscribeClear () {
      this.subscribeForm = {
        serviceName: '',
        subTopic: ''
      }
      this.subscribeDialog = false
    },
    addsubClear () {
      this.addsubForm = {
        serviceName: '',
        topic: '',
        message: ''
      }
      this.addsubDialog = false
    },
    subscribeSubmit () {
      this.$axios
        // 实际API
        // .post('http://localhost:8084/api/router/subscribe?serviceName=' + this.subscribeForm.serviceName + '&subTopic=' + this.subscribeForm.subTopic).then(resp => {
        // kong网关代理API
        .post(localStorage.socket + '/r/sub?serviceName=' + this.subscribeForm.serviceName + '&subTopic=' + this.subscribeForm.subTopic).then(resp => {
          if (resp && resp.status === 200) {
            this.loadMessageTopic()
            this.subscribeDialog = false
          }
        }).catch(() => {
          this.$message.error('消息订阅失败!')
        })
    },
    addsubSubmit () {
      this.$axios
        // 实际API
        // .post('http://localhost:8084/api/router/publish?serviceName=' + this.addsubForm.serviceName + '&message=' + this.addsubForm.message + '&topic=' + this.addsubForm.topic).then(resp => {
        // kong网关代理API
        .post(localStorage.socket + '/r/p?serviceName=' + this.addsubForm.serviceName + '&message=' + this.addsubForm.message + '&topic=' + this.addsubForm.topic).then(resp => {
          if (resp && resp.status === 200) {
            this.loadMessageTopic()
            this.addsubDialog = false
          }
        }).catch(() => {
          this.$message.error('消息发布失败!')
        })
    },
    searchResult (e) {
      var _this = this
      this.$axios
        // .get('http://localhost:8084/api/router/serviceName=' + e).then(resp => {
        .get(localStorage.socket + '/r/sN?serviceName=' + e).then(resp => {
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
