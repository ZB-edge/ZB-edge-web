<template>
    <div>
      <div>
        <el-dialog
          title="请先选择网关"
          width="30%"
          :visible.sync="selectDialog">
          <el-form v-model="gwname" label-width="40%" style="text-align: left">
            <el-form-item label="选择网关">
              <el-select style="width: 240px" v-model="gwname" placeholder="请选择网关查看设备">
                <el-option v-for="(item, i) in gwList" :key="i" :label="item.name" :value="item.name">
                  <span style="float: left">网关名称：{{ item.name }}</span>
                  <span style="float: right;color: #551513;font-size: 13px">IP：{{ item.ip }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer" style="text-align: center;">
            <el-button type="primary" @click="loadService">确定</el-button>
            <el-button @click="selectDialog = false">取消</el-button>
          </div>
        </el-dialog>
      </div>
      <el-row>
        <el-breadcrumb separator="/" style="margin-top: 5px;font-size: 16px;margin-left: 20px">
          <el-breadcrumb-item :to="{ path: '/index'}"><i class="el-icon-s-home" />首页</el-breadcrumb-item>
          <el-breadcrumb-item>网关服务</el-breadcrumb-item>
        </el-breadcrumb>
      </el-row>
      <el-row>
        <br>
        <!--新增按钮-->
        <el-button type="success" icon="el-icon-circle-plus-outline" size="mini"  style="float: right;margin-right: 20px;margin-bottom: 5px;" @click="uploadDialog = true">新增
        </el-button>
        <div>
<!--          实际API-->
<!--          action="http://localhost:8090/api/instance/service"-->
<!--          kong网关代理API为：-->
<!--          action="http://localhost:8000/gi/service"-->
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
            <el-button size="small" type="success" @click="submitUpload" style="margin-top: 10px">上传到网关</el-button>
          </el-dialog>
        </div>
        <div>
          <el-dialog
            title="关闭微服务"
            width="30%"
            :visible.sync="dialogVisible"
            @close="clearServiceStop">
            <el-form v-model="servicePort" label-width="35%" style="text-align: left">
              <el-form-item label="服务名称">
                <el-select v-model="servicePort" multiple collapse-tags placeholder="请选择需关闭的微服务">
                  <el-option v-for="(item, i) in servicePortList" :key="i" :label="item.name" :value="i">
                    <span style="float: left">微服务：{{ item.name }}</span>
                    <span style="float: right;color: #551513;font-size: 13px">端口：{{ item.port }}</span>
                  </el-option>
                </el-select>
<!--                <el-input style="width: 240px" v-model="servicePort" placeholder="请输入服务运行端口号"></el-input>-->
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align: center">
              <el-button @click="clearServiceStop">取消</el-button>
              <el-button type="primary" @click="handleServiceStop">关闭服务</el-button>
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
                @click="handleServiceStart(scope.$index, scope.row)">开启服务</el-button>
              <el-button
                size="mini"
                type="success"
                @click="dialogVisible = true">关闭服务</el-button>
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
  name: 'GatewayService',
  data () {
    return {
      uploadApi: localStorage.socket + '/gc/s',
      fileList: [],
      currentPage: 1,
      pagesize: 12,
      table: [],
      gwList: [],
      gwname: '',
      selectDialog: false,
      uploadDialog: false,
      dialogVisible: false,
      servicePort: [],
      servicePortList: [
        {name: 'Device', port: 8081},
        {name: 'Command', port: 8082},
        {name: 'Rule', port: 8083},
        {name: 'MQ Router', port: 8084},
        {name: 'Serv Mgmt', port: 8085},
        {name: 'OAM', port: 8086},
        // {name: 'Monitor', port: 8087},
        // {name: 'Notice', port: 8088},
        {name: 'GW Config', port: 8089},
        {name: 'GW Inst', port: 8090},
        {name: 'Profile', port: 8091},
        {name: 'Scenario', port: 8092},
        {name: 'CMD Config', port: 8094},
        {name: 'Rule Config', port: 8099}
      ],
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
    submitUpload () {
      this.$refs.upload.submit()
      this.hideUpload()
    },
    hideUpload () {
      this.fileList = []
      this.uploadDialog = false
      this.loadService()
    },
    loadService () {
      this.selectDialog = false
      // 实际API
      // this.$axios.get('http://localhost:8089/api/gateway/service/'+ this.gwname).then(resp => {
      // kong网关代理API
      this.$axios.get(localStorage.socket + '/gc/s/' + this.gwname).then(resp => {
      // this.$axios.get('http://localhost:8000/gc/s/').then(resp => {
      // 开发模式下代理API
      // this.$axios.get('http://localhost:8089/api/gateway/service').then(resp => {
      // this.$axios.get('/gateway/service/'+this.gwname).then(resp => {
        if (resp && resp.status === 200) {
          this.table = resp.data.fileDescriptorLists
          this.loading = false
        }
      }).catch(() => {
        this.$message.error('获取服务列表失败！')
      })
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
    },
    clearServiceStop () {
      this.dialogVisible = false
      this.servicePort = []
    },
    handleServiceStop () {
      let stopName = this.servicePortList
      let stopPort = this.servicePort
      for (let x in this.servicePort) {
        // 实际API
        // this.$axios.delete('http://localhost:8089/api/gateway/service/'+ this.gwname+ '?port=' + this.servicePortList[this.servicePort[x]].port).then(resp => {
        // kong网关代理API
        // this.$axios.delete('http://localhost:8000/gc/s/'+this.gwname+'?port=' + this.servicePortList[this.servicePort[x]].port).then(resp => {
        this.$axios.delete(localStorage.socket + '/gc/s/' + this.gwname + '?port=' + this.servicePortList[this.servicePort[x]].port).then(resp => {
        // 开发模式下代理API
        // this.$axios.delete('http://localhost:8089/api/gateway/service/'+ this.gwname+ '?port=' + this.servicePortList[this.servicePort[x]].port).then(resp => {
        // this.$axios.delete('/gc/s/' + this.gwname + '?port=' + this.servicePortList[this.servicePort[x]].port).then(resp => {
          if (resp && resp.status === 200) {
            this.$message.warning('已向' + stopName[stopPort[x]].name + '服务发送关闭指令，请在终端确认！')
          }
        }).catch(() => {
          this.$message.error(stopName[stopPort[x]].name + '服务关闭失败！')
        })
      }
      this.clearServiceStop()
    },
    handleServiceStart (index, row) {
      // 实际API
      // this.$axios.put('http://localhost:8089/api/gateway/service/' + this.gwname + '?jarName=' + row.name).then(resp => {
      // kong网关代理API
      // this.$axios.put('http://localhost:8000/gc/s/'+ this.gwname+'?jarName=' + row.name).then(resp => {
      this.$axios.put(localStorage.socket + '/gc/s/' + this.gwname + '?jarName=' + row.name).then(resp => {
      // 开发模式下代理API
      // this.$axios.put('http://localhost:8089/api/gateway/service/'+ this.gwname + '?jarName=' + row.name).then(resp => {
      // this.$axios.put('/gc/s/' + this.gwname + '?jarName=' + row.name).then(resp => {
        if (resp.status === 200) {
          this.$message.success('服务已成功启动')
          this.loadService()
        }
      }).catch(() => {
        this.$message.error('服务启动失败！')
      })
    }
  }
}
</script>

<style scoped>

</style>
