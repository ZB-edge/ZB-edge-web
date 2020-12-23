<template>
  <div>
    <div>
      <el-dialog
        title="请先选择网关"
        width="30%"
        :visible.sync="selectDialog">
        <el-form v-model="gwip" label-width="35%" style="text-align: left">
          <el-form-item label="选择网关">
            <el-select style="width: 240px" v-model="gwip" placeholder="请选择网关查看设备模板">
              <el-option v-for="(item, i) in gwList" :key="i" :label="item.ip" :value="item.ip">
                <span style="float: left">网关名称：{{ item.name }}</span>
                <span style="float: right;color: #551513;font-size: 13px">IP：{{ item.ip }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button type="primary" @click="loadProfiles">确定</el-button>
          <el-button @click="selectDialog = false">取消</el-button>
        </div>
      </el-dialog>
    </div>
    <el-row>
      <el-col :span="12">
        <el-breadcrumb separator="/" style="margin-top: 5px;font-size: 16px;margin-left: 20px">
          <el-breadcrumb-item :to="{ path: '/index'}"><i class="el-icon-s-home" />首页</el-breadcrumb-item>
          <el-breadcrumb-item>设备模板</el-breadcrumb-item>
          <el-breadcrumb-item>ip: {{gwip}}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
      <el-col :span="12">
        <el-button type="text" icon="el-icon-refresh" @click="loadProfiles" style="background-color: rgba(255,255,255,1.0);border-color: rgba(255,255,255,1.0);color: #000000;padding: 0px;float: right;margin-right: 20px;margin-top:5px;font-size: 16px">刷新</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="11" style="margin-left: 15px">
        <search-bar @onSearch="searchResult" ref="searchBar"></search-bar>
      </el-col>
      <el-col :span="11" style="margin-left: 5%">
        <div  style="margin-top: 20px;margin-bottom: 30px;float: right">
          <el-button type="success" icon="el-icon-guide">网关选择：</el-button>
          <el-select v-model="gwip" placeholder="请选择网关查看设备模板" @change="loadProfiles">
            <el-option v-for="(item, i) in gwList" :key="i" :label="item.ip" :value="item.ip">
              <span style="float: left">网关名称：{{ item.name }}</span>
              <span style="float: right;color: #551513;font-size: 13px">IP：{{ item.ip }}</span>
            </el-option>
          </el-select>
        </div>
      </el-col>
    </el-row>
      <!--新增按钮-->
<!--      <el-button type="success" icon="el-icon-circle-plus-outline" size="mini" round style="float: right" @click="createProfile()">新增-->
<!--      </el-button>-->
<!--      <br>-->
<!--      <profile-edit-form @onSubmit="loadProfiles" ref="profileEditForm"></profile-edit-form>-->
    <el-row>
      <el-table
        ref="multipleTable"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.3)"
        :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
        tooltip-effect="dark"
        style="width: 100%;"
        stripe
        @selection-change="handleSelectionChange">
        <!--展示设备模板功能-->
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table
              :data="props.row.deviceResources"
              style="width: 100%">
              <el-table-column
                type="index"
                width="50"
                label="序号">
              </el-table-column>
              <el-table-column
                prop="name"
                label="功能名称">
              </el-table-column>
              <el-table-column
                prop="description"
                label="功能描述">
              </el-table-column>
              <!--多级表头-->
              <el-table-column label="properties">
                <el-table-column label="value">
                  <el-table-column
                    prop="properties.value.type"
                    label="类型">
                  </el-table-column>
                  <el-table-column
                    prop="properties.value.readWrite"
                    label="读写权限">
                  </el-table-column>
                  <el-table-column
                    prop="properties.value.defaultValue"
                    label="默认值">
                  </el-table-column>
                </el-table-column>
                <el-table-column label="units">
                  <el-table-column
                    prop="properties.units.type"
                    label="类型">
                  </el-table-column>
                  <el-table-column
                    prop="properties.units.readWrite"
                    label="读写权限">
                  </el-table-column>
                  <el-table-column
                    prop="properties.units.defaultValue"
                    label="默认值">
                  </el-table-column>
                </el-table-column>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column
          type="selection">
        </el-table-column>
        <el-table-column
          prop="id"
          label="模板ID">
        </el-table-column>
        <el-table-column
          prop="name"
          label="设备类型">
        </el-table-column>
        <el-table-column
          prop="manufacturer"
          label="制造商">
        </el-table-column>
        <el-table-column
          prop="model"
          label="支持协议">
        </el-table-column>
        <el-table-column
          prop="created"
          label="生成日期">
        </el-table-column>
        <el-table-column
          prop="modified"
          label="修改日期">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
<!--            <el-button-->
<!--              size="mini"-->
<!--              type="success"-->
<!--              @click="handleExport(scope.$index, scope.row)">导出模板</el-button>-->
<!--            <el-button-->
<!--              size="mini"-->
<!--              type="success"-->
<!--              @click="handleStatus(scope.$index, scope.row)">启用/禁用</el-button>-->
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">废除</el-button>
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
// import ProfileEditForm from './ProfileEditForm'
export default {
  name: 'DeviceProfile',
  components: {SearchBar},
  data () {
    return {
      currentPage: 1,
      pagesize: 18,
      gwList: [],
      gwip: '',
      selectDialog: false,
      tableData: [],
      multipleSelection: [],
      loading: true
    }
  },
  mounted: function () {
    this.selectGw()
    // this.loadProfiles()
  },
  methods: {
    selectGw () {
      // 实际API
      // this.$axios.get('http://localhost:8089/api/gateway').then(resp => {
      // kong网关代理API
      this.$axios.get(localStorage.socket + '/gc').then(resp => {
      // this.$axios.get('http://localhost:8000/gc').then(resp => {
      // 开发模式代理API
      // this.$axios.get('/gateways').then(resp => {
        if (resp && resp.status === 200) {
          this.gwList = resp.data
          this.selectDialog = true
        }
      }).catch(() => {
        this.$message('获取网关信息失败！')
      })
    },
    loadProfiles () {
      this.selectDialog = false
      var _this = this
      this.$axios
        // 实际API
        // .get('http://localhost:8091/api/profile/gateway/' + this.gwip).then(resp => {
        // kong网关代理API
        .get(localStorage.socket + '/p/gateway/' + this.gwip).then(resp => {
        // .get('http://localhost:8000/p/gateway/' + this.gwip).then(resp => {
        // 开发模式下代理API
        // .get('/profiles/gateway/' + this.gwip).then(resp => {
          if (resp && resp.status === 200) {
            _this.tableData = resp.data
            _this.loading = false
          }
        }).catch(() => {
          this.$message.error('获取该网关设备模板失败！')
        })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
    },
    // createProfile () {
    //   this.$refs.profileEditForm.dialogFormVisible = true
    // },
    // handleExport (index, tablerow) {
    //   var filecontent
    //   this.$axios
    //     // .get('http://localhost:8000/p/yml/' + tablerow.id).then(resp => {
    //     .get('/profiles/name/' + tablerow.name).then(resp => {
    //       if (resp && resp.status === 200) {
    //         filecontent = resp.data
    //         if ('download' in document.createElement('a')) {
    //           this.download(filecontent, tablerow.name + '.yaml')
    //         } else {
    //           window.alert('浏览器不支持！')
    //         }
    //       }
    //     }).catch(() => {
    //       this.$message('模板导出失败！')
    //     })
    // },
    // download (content, filename) {
    //   let link = document.createElement('a')
    //   link.download = filename
    //   link.style.display = 'none'
    //   // 字符内容转变成blob地址
    //   let blob = new Blob([content])
    //   link.href = URL.createObjectURL(blob)
    //   document.body.appendChild(link)
    //   link.click()
    //   document.body.removeChild(link)
    // },
    handleDelete (index, tablerow) {
      this.$confirm('此操作将永久删除该模板，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'waring'
      }).then(() => {
        this.$axios
          // 实际API
          // .delete('http://localhost:8091/api/profile/gateway/' + this.gwip + '/' + tablerow.name).then(resp => {
          // kong网关代理API
          .delete(localStorage.socket + '/p/gateway/' + this.gwip + '/' + tablerow.name).then(resp => {
          // .delete('http://localhost:8000/p/gateway/' + this.gwip + '/' + tablerow.name).then(resp => {
          // 开发模式代理API
          // .delete('/profiles/gateway/' + this.gwip + '/' + tablerow.name).then(resp => {
            if (resp && resp.status === 200) {
              this.$message.success('已在网关：' + this.ip + '删除设备模板：' + tablerow.name)
              this.loadProfiles()
            }
          })
      }).catch(() => {
        this.message({
          type: 'error',
          message: '已取消删除'
        })
      })
    },
    searchResult (e) {
      var _this = this
      this.$axios
        // 实际API
        // .get('http://localhost:8091/api/profile/search?keywords=' + e, {
        // kong网关代理API
        .get(localStorage.socket + '/p/search?keywords=' + e, {
        // .get('http://localhost:8000/p/search?keywords=' + e, {
        // 开发模式下代理API
        // .get('/profiles/search?keywords=' + e, {
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
