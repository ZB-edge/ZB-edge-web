<template>
  <div>
    <el-row>
      <el-breadcrumb separator="/" style="margin-top: 5px;font-size: 16px;margin-left: 20px">
        <el-breadcrumb-item :to="{ path: '/index'}"><i class="el-icon-s-home" />首页</el-breadcrumb-item>
        <el-breadcrumb-item>服务管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row>
      <br>
      <!--新增按钮-->
<!--      <el-button type="success" icon="el-icon-circle-plus-outline" size="mini"  style="float: right;margin-right: 20px;margin-bottom: 5px;" @click="uploadDialog = true">新增-->
<!--      </el-button>-->
<!--      <div>-->
<!--        <el-dialog-->
<!--          title="添加服务"-->
<!--          :visible.sync="uploadDialog"-->
<!--          width="30%"-->
<!--          @close="clear">-->
<!--          <el-form v-model="gwForm" label-width="120px" style="text-align: left">-->
<!--            <el-form-item label="网关名称" prop="name">-->
<!--              <el-input v-model="gwForm.name" autocomplete="off" placeholder="请输入网关名称"></el-input>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="网关IP地址" prop="ip">-->
<!--              <el-input v-model="gwForm.ip" autocomplete="off" placeholder="请输入网关IP地址"></el-input>-->
<!--            </el-form-item>-->
<!--          </el-form>-->
<!--          <div slot="footer" class="dialog-footer">-->
<!--            <el-button @click="createDialog = false">取消</el-button>-->
<!--            <el-button type="primary" @click.once="createOnSubmit">确定</el-button>-->
<!--          </div>-->
<!--        </el-dialog>-->
<!--      </div>-->
<!--      <div>-->
<!--        <el-dialog-->
<!--          title="添加服务"-->
<!--          :visible.sync="uploadDialog"-->
<!--          @close="hideUpload">-->
<!--          <el-upload-->
<!--            ref="upload"-->
<!--            class="upload-demo"-->
<!--            drag-->
<!--            action="http://localhost:8000/sev"-->
<!--            multiple-->
<!--            :file-list="fileList"-->
<!--            :auto-upload="false">-->
<!--              <i class="el-icon-upload"></i>-->
<!--              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>-->
<!--              <div slot="tip" class="el-upload__tip">单个文件大小限制100M以内，总文件大小限制1000M</div>-->
<!--&lt;!&ndash;              <el-button style="position: absolute; bottom: 0px;"  size="small" type="success" @click="submitUpload">上传到服务器</el-button>>&ndash;&gt;-->
<!--          </el-upload>-->
<!--          <el-button size="small" type="success" @click="submitUpload" style="margin-top: 10px">上传到服务器</el-button>-->
<!--        </el-dialog>-->
<!--      </div>-->
      <div>
        <el-dialog
          title="模板分发至网关"
          width="30%"
          :visible.sync="dialogVisible"
          @close="clear">
          <el-form v-model="serviceForm" label-width="120px" style="text-align: left">
            <el-form-item label="服务名称">
              <el-input style="width: 240px" v-model="serviceForm.name" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="选择网关">
              <el-select style="width: 240px" v-model="serviceForm.gwip" multiple collapse-tags placeholder="请选择服务下发网关">
                <el-option v-for="(item, i) in gwList" :key="i" :value="item.ip">
                  <span style="float: left">网关名称：{{ item.name }}</span>
                  <span style="float: right;color: #551513;font-size: 13px">IP：{{ item.ip }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="onSubmit">确定</el-button>
            <el-button @click="clear">取消</el-button>
          </div>
        </el-dialog>
      </div>
    </el-row>
    <el-row>
      <el-table
        ref="multipleTable"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.3)"
        :data="table.slice((currentPage-1)*pagesize,currentPage*pagesize)"
        tooltip-effect="dark"
        stripe
        style="width: 100%;">
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
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              @click="handleOutGiving(scope.$index, scope.row)">服务下发</el-button>
          </template>
        </el-table-column>
      </el-table>
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
      fileList: [],
      currentPage: 1,
      pagesize: 12,
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
    // submitUpload () {
    //   this.$refs.upload.submit()
    //   this.hideUpload()
    // },
    // hideUpload () {
    //   this.fileList = []
    //   this.uploadDialog = false
    //   this.loadService()
    // },
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
    handleOutGiving (index, row) {
      // 实际API
      // this.$axios.get('http://localhost:8089/api/gateway').then(resp => {
      // kong网关代理API
      this.$axios.get(localStorage.socket + '/gc').then(resp => {
      // this.$axios.get('http://localhost:8000/gc').then(resp => {
      // 开发模式下代理API
      // this.$axios.get('/gateways').then(resp => {
        if (resp && resp.status === 200) {
          this.gwList = resp.data
          this.serviceForm.name = row.name
          this.dialogVisible = true
        }
      }).catch(() => {
        this.$message.error('获取网关信息失败！')
        this.dialogVisible = false
      })
    },
    onSubmit () {
      let serviceName = this.serviceForm.name
      let ip = this.serviceForm.gwip
      for (let x in this.serviceForm.gwip) {
        // 实际API
        // this.$axios.post('http://localhost:8085/api/service/ip/' + this.serviceForm.gwip[x] + '/name/' + this.serviceForm.name).then(resp => {
        // kong网关代理API
        this.$axios.post(localStorage.socket + '/sev/ip/' + this.serviceForm.gwip[x] + '/name/' + this.serviceForm.name).then(resp => {
        // this.$axios.post('http://localhost:8000/sev/ip/' + this.serviceForm.gwip[x] + '/name/' + this.serviceForm.name).then(resp => {
        // 开发模式下代理API
        // this.$axios.post('/services/ip/' + this.serviceForm.gwip[x] + '/name/' + this.serviceForm.name).then(resp => {
          if (resp && resp.status === 200) {
            this.$message({
              showClose: true,
              type: 'success',
              message: serviceName + '服务下发至网关' + ip[x] + '成功！'})
          }
        }).catch(() => {
          this.$message({
            showClose: true,
            type: 'error',
            message: serviceName + '服务下发至网关' + ip[x] + '失败！'})
        })
      }
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>

</style>
