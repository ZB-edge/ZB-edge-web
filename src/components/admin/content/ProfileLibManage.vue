<template>
    <div>
      <el-row style="margin: 18px 0px 0px 18px ">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>管理中心</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
          <el-breadcrumb-item>设备模板管理</el-breadcrumb-item>
        </el-breadcrumb>
      </el-row>
      <el-row>
        <div style="text-align: left">
          <el-button type="success" icon="el-icon-circle-plus-outline" style="float: left;margin: 18px 0 0 10px;" @click="createDialog = true">添加模板
          </el-button>
          <profile-edit-form :dialogFormVisible="createDialog" @hideDialog="createDialog = false" @onSubmit="loadProfileLib"></profile-edit-form>
          <br />
        </div>
      </el-row>
      <el-row>
          <!--        <el-dialog-->
<!--          title="模板分发至网关"-->
<!--          width="30%"-->
<!--          :visible.sync="dialogVisible">-->
<!--          <el-form v-model="profileForm" label-width="120px" style="text-align: left">-->
<!--            <el-form-item label="模板名称">-->
<!--              <el-input style="width: 240px" v-model="profileForm.name" :disabled="true"></el-input>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="选择网关">-->
<!--              <el-select style="width: 240px" v-model="profileForm.gwip" multiple collapse-tags placeholder="请选择模板下发网关">-->
<!--                <el-option v-for="(item, i) in gwList" :key="i" :label="item.ip" :value="item.ip">-->
<!--                  <span style="float: left">网关名称：{{ item.name }}</span>-->
<!--                  <span style="float: right;color: #551513;font-size: 13px">IP：{{ item.ip }}</span>-->
<!--                </el-option>-->
<!--              </el-select>-->
<!--            </el-form-item>-->
<!--          </el-form>-->
<!--          <div slot="footer" class="dialog-footer" style="text-align: center">-->
<!--            <el-button @click="dialogVisible = false">取消</el-button>-->
<!--            <el-button type="primary" @click="onSubmit">确定</el-button>-->
<!--          </div>-->
<!--        </el-dialog>-->
        <el-card style="margin: 18px 2%;width: 95%">
          <el-table
            ref="multipleTable"
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.3)"
            :data="table.slice((currentPage-1)*pagesize,currentPage*pagesize)"
            tooltip-effect="dark"
            style="width: 100%;"
            stripe
            @selection-change="handleSelectionChange">
            <!--展示设备模板功能-->
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-table
                  :data="props.row.yml.deviceResources"
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
              prop="name"
              width="250px"
              label="模板名称">
            </el-table-column>
            <el-table-column
              label="制造商">
              <template slot-scope="scope">
                <span>{{ scope.row.yml.manufacturer }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="支持协议">
              <template slot-scope="scope">
                <span>{{ scope.row.yml.model }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="描述"
              width="300px">
              <template slot-scope="scope">
                <span>{{ scope.row.yml.description }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="250px"
              min-width="120px">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="success"
                  @click="handleExport(scope.$index, scope.row)">导出模板</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row)">废除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin: 20px 0 20px 0;float: left">
            <el-button @click="toggleSelection">取消选择</el-button>
            <el-button @click="multipleDelete">批量删除</el-button>
          </div>
        </el-card>
      </el-row>
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
import ProfileEditForm from './ProfileEditForm'
export default {
  name: 'ProfileLibManage',
  components: {ProfileEditForm},
  data () {
    return {
      createDialog: false,
      dialogVisible: false,
      profileForm: {
        name: '',
        gwip: []
      },
      gwList: [],
      currentPage: 1,
      pagesize: 18,
      table: [
        {
          name: '',
          yml: {
            name: '',
            manufacturer: '',
            model: '',
            labels: [],
            description: '',
            deviceResources: []
          }
        }
      ],
      multipleSelection: [],
      loading: true
    }
  },
  mounted () {
    this.loadProfileLib()
  },
  methods: {
    loadProfileLib () {
      // 实际API
      // this.$axios.get('http://localhost:8091/api/profile').then(resp => {
      // kong网关代理API
      this.$axios.get(localStorage.socket + '/p').then(resp => {
      // this.$axios.get('http://localhost:8000/p').then(resp => {
      // 开发模式代理API
      // this.$axios.get('/profiles').then(resp => {
        if (resp && resp.status === 200) {
          this.table = resp.data
          this.loading = false
        }
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    toggleSelection () {
      this.$refs.multipleTable.clearSelection()
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
    },
    // handleOutGiving (index, tablerow) {
    //   // 实际API
    //   // this.$axios.get('http://localhost:8089/api/gateway').then(resp => {
    //   // kong网关代理API
    //   // this.$axios.get('http://localhost:8000/gc').then(resp => {
    //   // 开发模式代理API
    //   this.$axios.get('/gateways').then(resp => {
    //     if (resp && resp.status === 200) {
    //       this.gwList = resp.data
    //       this.profileForm.name = tablerow.name
    //       this.dialogVisible = true
    //     }
    //   }).catch(() => {
    //     this.$message.error('获取网关信息失败！')
    //     this.dialogVisible = false
    //   })
    // },
    handleExport (index, tablerow) {
      var filecontent
      this.$axios
        // 实际API
        // .get('http://localhost:8091/api/profile/name/' + tablerow.name).then(resp => {
        // kong网关代理API
        .get(localStorage.socket + '/p/name/yml/' + tablerow.name).then(resp => {
        // .get('http://localhost:8000/p/name/' + tablerow.name).then(resp => {
        // 开发模式下代理API
        // .get('/profiles/name/' + tablerow.name).then(resp => {
          if (resp && resp.status === 200) {
            filecontent = resp.data
            if ('download' in document.createElement('a')) {
              this.download(filecontent, tablerow.name + '.yaml')
            } else {
              window.alert('浏览器不支持！')
            }
          }
        }).catch(() => {
          this.$message.error('模板导出失败！')
        })
    },
    download (content, filename) {
      let link = document.createElement('a')
      link.download = filename
      link.style.display = 'none'
      // 字符内容转变成blob地址
      let blob = new Blob([content])
      link.href = URL.createObjectURL(blob)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    handleDelete (tablerow) {
      let _this = this
      this.$axios
      // 实际API
      // .delete('http://localhost:8091/api/profile/name/' + tablerow.name).then(resp => {
      // kong网关代理API
        .delete(localStorage.socket + '/p/name/' + tablerow.name).then(resp => {
          // .delete('http://localhost:8000/p/name/' + tablerow.name).then(resp => {
        // 开发模式代理API
        // .delete('/profiles/name/' + tablerow.name).then(resp => {
          if (resp && resp.status === 200) {
            _this.loadProfileLib()
            this.$message.success('已删除设备模板:' + tablerow.name)
          }
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '设备模板：' + tablerow.name + '删除失败'
          })
        })
    },
    multipleDelete () {
      let deleteSelection = []
      deleteSelection = this.multipleSelection
      if (deleteSelection === []) {
        this.$message.warning('请勾选用户')
      } else {
        for (let i = 0; i < deleteSelection.length; i++) {
          this.handleDelete(deleteSelection[i])
        }
      }
    },
    onSubmit () {
      let ip = this.profileForm.gwip
      let profileName = this.profileForm.name
      for (let x in this.profileForm.gwip) {
        // 实际API
        // this.$axios.post('http://localhost:8091/api/profile/gateway/' + this.profileForm.gwip[x] + '/' + this.profileForm.name
        // kong网关代理API
        this.$axios.post(localStorage.socket + '/p/gateway/' + this.profileForm.gwip[x] + '/' + this.profileForm.name
        // this.$axios.post('http://localhost:8000/p/gateway/' + this.profileForm.gwip[x] + '/' + this.profileForm.name
        // 开发模式下代理API
        // this.$axios.post('/profiles/gateway/' + this.profileForm.gwip[x] + '/' + this.profileForm.name
        ).then(resp => {
          if (resp && resp.status === 200) {
            this.$message.success(profileName + '模板下发至' + ip[x] + '网关成功！')
          }
        }).catch(() => {
          this.$message.error(profileName + '模板下发至' + ip[x] + '失败！')
        })
      }
      this.dialogVisible = false
      this.profileForm = {
        name: '',
        gwip: []
      }
    }
  }
}
</script>

<style scoped>

</style>
