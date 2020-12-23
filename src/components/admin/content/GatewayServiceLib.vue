<template>
  <div>
    <el-row style="margin: 18px 0px 0px 18px ">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>管理中心</el-breadcrumb-item>
        <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        <el-breadcrumb-item>网关服务管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row>
      <div style="text-align: left">
        <el-button type="success" icon="el-icon-circle-plus-outline" style="float: left;margin: 18px 0 0 10px;" @click="uploadDialog = true">添加网关服务
        </el-button>
        <br />
      </div>
    </el-row>
    <div>
      <el-dialog
        title="添加服务"
        :visible.sync="uploadDialog"
        @close="hideUpload">
        <el-upload
          ref="upload"
          class="upload-demo"
          drag
          :action="uploadApi"
          multiple
          :file-list="fileList"
          :auto-upload="false">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div slot="tip" class="el-upload__tip">单个文件大小限制100M以内，总文件大小限制1000M</div>
<!--              <el-button style="position: absolute; bottom: 0px;"  size="small" type="success" @click="submitUpload">上传到服务器</el-button>>-->
        </el-upload>
        <el-button size="small" type="success" @click="submitUpload" style="margin-top: 10px">上传到服务器</el-button>
      </el-dialog>
    </div>
    <el-row>
      <el-card style="margin: 18px 2%;width: 95%">
        <el-table
          ref="multipleTable"
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.3)"
          :data="table.slice((currentPage-1)*pagesize,currentPage*pagesize)"
          tooltip-effect="dark"
          stripe
          @selection-change="handleSelectionChange"
          style="width: 100%;">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            type="index"
            width="250px"
            label="序号">
          </el-table-column>
          <el-table-column
            prop="name"
            label="服务名称">
          </el-table-column>
          <el-table-column
            prop="extension"
            label="服务包类型">
          </el-table-column>
          <!--        <el-table-column-->
          <!--          label="操作">-->
          <!--          <template slot-scope="scope">-->
          <!--            <el-button-->
          <!--              size="mini"-->
          <!--              type="success"-->
          <!--              @click="handleDelete(scope.row)">废除</el-button>-->
          <!--          </template>-->
          <!--        </el-table-column>-->
        </el-table>
        <div style="margin: 20px 0 20px 0;float: left">
          <el-button @click="toggleSelection">取消选择</el-button>
          <!--        <el-button @click="multipleDelete">批量删除</el-button>-->
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
export default {
  name: 'ServiceManage',
  data () {
    return {
      uploadApi: localStorage.socket + '/sev',
      fileList: [],
      currentPage: 1,
      pagesize: 18,
      table: [],
      uploadDialog: false,
      dialogVisible: false,
      serviceForm: {
        name: '',
        gwip: []
      },
      gwList: [],
      loading: true
    }
  },
  mounted () {
    this.loadService()
  },
  methods: {
    submitUpload () {
      this.$refs.upload.submit()
      this.hideUpload()
    },
    hideUpload () {
      this.fileList = []
      this.uploadDialog = false
      this.loadService()
    },
    clear () {
      this.dialogVisible = false
      this.serviceForm = {
        name: '',
        gwip: []
      }
    },
    loadService () {
      // 实际API
      // this.$axios.get('http://localhost:8085/api/service/list').then(resp => {
      // kong网关代理API
      this.$axios.get(localStorage.socket + '/sev/list').then(resp => {
      // this.$axios.get('http://localhost:8000/sev/list').then(resp => {
      // 开发模式下代理API
      // this.$axios.get('/services/list').then(resp => {
        if (resp && resp.status === 200) {
          this.table = resp.data
          this.loading = false
        }
      }).catch(() => {
        this.$message.error('获取服务列表失败！')
      })
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    toggleSelection () {
      this.$refs.multipleTable.clearSelection()
    }
    // handleOutGiving (index, row) {
    //   // 实际API
    //   // this.$axios.get('http://localhost:8089/api/gateway').then(resp => {
    //   // kong网关代理API
    //   // this.$axios.get('http://localhost:8000/gc').then(resp => {
    //   // 开发模式下代理API
    //   this.$axios.get('/gateways').then(resp => {
    //     if (resp && resp.status === 200) {
    //       this.gwList = resp.data
    //       this.serviceForm.name = row.name
    //       this.dialogVisible = true
    //     }
    //   }).catch(() => {
    //     this.$message.error('获取网关信息失败！')
    //     this.dialogVisible = false
    //   })
    // },
    // onSubmit () {
    //   let serviceName = this.serviceForm.name
    //   let ip = this.serviceForm.gwip
    //   for (let x in this.serviceForm.gwip) {
    //     // 实际API
    //     // this.$axios.post('http://localhost:8085/api/service/ip/' + this.serviceForm.gwip[x] + '/name/' + this.serviceForm.name).then(resp => {
    //     // kong网关代理API
    //     // this.$axios.get('http://localhost:8000/sev/ip/' + this.serviceForm.gwip[x] + '/name/' + this.serviceForm.name).then(resp => {
    //     // 开发模式下代理API
    //     this.$axios.post('/services/ip/' + this.serviceForm.gwip[x] + '/name/' + this.serviceForm.name).then(resp => {
    //       if (resp && resp.status === 200) {
    //         this.$message({
    //           showClose: true,
    //           type: 'success',
    //           message: serviceName + '服务下发至网关' + ip[x] + '成功！'})
    //       }
    //     }).catch(() => {
    //       this.$message({
    //         showClose: true,
    //         type: 'error',
    //         message: serviceName + '服务下发至网关' + ip[x] + '失败！'})
    //     })
    //   }
    //   this.dialogVisible = false
    // }
  }
}
</script>

<style scoped>

</style>
