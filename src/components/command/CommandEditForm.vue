<template>
  <div >
    <el-dialog
      title="增加指令"
      width="30%"
      :visible.sync="createDialog"
      @close="clear" >
      <el-form v-model="commandForm" label-width="35%" style="text-align: left;">
        <el-form-item label="名称" >
          <el-input v-model="commandForm.commandEdit.name" autocomplete="off" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="commandForm.commandEdit.description" autocomplete="off" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="指令类型">
          <el-select v-model="commandForm.commandEdit.commandType" placeholder="">
            <el-option label="put" value="put"></el-option>
            <el-option label="get" value="get"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="等级">
          <el-select v-model="commandForm.commandEdit.level" placeholder="">
            <el-option label="command" value=1></el-option>
            <el-option label="scenario" value=2></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="jsonObject" placeholder="">
          <el-input type="textarea" v-model="jsonString" style="width: 200px" autocomplete="off" placeholder="请输入json格式命令信息"></el-input>
        </el-form-item>
        <el-form-item label="指令选择" prop="list">
          <el-select v-model="commandForm.command" placeholder="" @change="handleCommand">
            <el-option v-for="(item, i) in commandList" :key="i" :label="item.commandName" :value="i">
              <span style="float: left">指令：{{ item.commandName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">设备：{{ item.deviceName }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button type="primary" @click="onSubmit">确定</el-button>
        <el-button @click="clear">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'CommandEditForm',
  data () {
    return {
      commandList: [],
      commandForm: {
        command: '',
        list: {},
        commandEdit: {
          commandType: '',
          commandName: '',
          level: '',
          name: '',
          description: '',
          jsonObject: {},
          deviceId: '',
          deviceName: '',
          commandId: ''
        }
      },
      jsonString: ''
    }
  },
  props: {
    createDialog: {
      type: Boolean,
      required: true,
      default: false
    },
    gname: {
      type: String,
      required: true
    }
  },
  methods: {
    getCommandList () {
      this.$axios
        // 实际API
        // .get('http://localhost:8094/api/commandconfig/list' + this.gname).then(resp => {
        // kong网关代理API
        .get(localStorage.socket + '/cc/l/' + this.gname).then(resp => {
        // .get('http://localhost:8000/cc/l/' + this.gname).then(resp => {
        // 开发模式代理API
        // .get('/commandconfig/list'+this.gname).then(resp => {
        // .get('/cc/l'+ this.gwname).then(resp => {
          if (resp && resp.status === 200) {
            this.commandList = resp.data
          }
        }).catch(() => {
          this.$message.error('获取设备指令失败！')
        })
    },
    handleCommand () {
      this.commandForm.list = this.commandList[this.commandForm.command]
    },
    clear () {
      this.commandForm = {
        list: {},
        commandEdit: {
          commandType: '',
          commandName: '',
          level: '',
          name: '',
          description: '',
          jsonObject: {},
          deviceId: '',
          deviceName: '',
          commandId: ''
        }
      }
      this.$emit('hideDialog')
    },
    onSubmit () {
      var _this = this
      this.commandForm.commandEdit.jsonObject = JSON.parse(this.jsonString)
      this.commandForm.commandEdit.commandId = this.commandForm.list.commandId
      this.commandForm.commandEdit.commandName = this.commandForm.list.commandName
      this.commandForm.commandEdit.deviceId = this.commandForm.list.deviceId
      this.commandForm.commandEdit.deviceName = this.commandForm.list.deviceName
      this.$axios
        // 实际API
        // .post('http://localhost:8094/api/commmandconfig'+this.gname, _this.commandForm.commandEdit).then(resp => {
        // kong网关道理API
        .post(localStorage.socket + '/cc/' + this.gname, _this.commandForm.commandEdit).then(resp => {
        // .post('http://localhost:8000/c', _this.commandForm.commandEdit).then(resp => {
        // 开发模式下代理API
        // .post('/commands', _this.commandForm.commandEdit).then(resp => {
          if (resp && resp.status === 200) {
            _this.$emit('onSubmit')
            _this.clear()
          }
        }).catch(() => {
          this.$message.error('添加指令失败！')
        })
    }
  },
  watch: {
    createDialog: function (newValue, oldValue) {
      if (newValue) {
        this.getCommandList()
      }
    }
  }
}
</script>

<style scoped>

</style>
