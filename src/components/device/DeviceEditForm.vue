<template>
  <div>
    <el-dialog
      title="新增设备信息"
      width="40%"
      :visible.sync="editDialog"
      @close="clear">
      <el-form v-model="deviceEditForm" label-width="40%" style="text-align: left">
        <el-form-item label="选择网关" prop="gwip">
          <el-select v-model="deviceEditForm.gwip" placeholer="请选择网关IP" @change="handleGWIP">
            <el-option v-for="item in gwList" :key="item.ip" :label="item.name" :value="item.ip">
              <span style="float: left">网关名称：{{ item.name }}</span>
              <span style="float: right;color: #551513;font-size: 13px">IP：{{ item.ip }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="deviceEditForm.deviceForm.name" autocomplete="off" placeholder="请输入设备名称"></el-input>
        </el-form-item>
        <el-form-item label="设备描述" prop="description">
          <el-input v-model="deviceEditForm.deviceForm.description" autocomplete="off" placeholder="请输入设备描述"></el-input>
        </el-form-item>
<!--        <el-form-item label="操作状态" prop="operatingState">-->
<!--          <el-select v-model="deviceEditForm.deviceForm.operatingState" placeholder="请选择操作状态">-->
<!--            <el-option label="ENABLED" value="ENABLED"></el-option>-->
<!--            <el-option label="UNABLED" value="UNABLED"></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="管理状态" prop="adminState">-->
<!--          <el-select v-model="deviceEditForm.deviceForm.adminState" placeholder="请选择管理状态">-->
<!--            <el-option label="UNLOCKED" value="UNLOCKED"></el-option>-->
<!--            <el-option label="LOCKED" value="LOCKED"></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <el-form-item label="标签" prop="labels">
          <el-input v-model="deviceEditForm.labelText" autocomplete="off" placeholder="请输入标签" @change="handleLabel"></el-input>
        </el-form-item>
        <el-form-item label="协议" prop="protocols">
          <el-select v-model="deviceEditForm.protocolName" placeholder="请选择协议" @change="handleProtocol">
            <el-option v-for="(item, i) in protocolList" :key="i" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-for="(item, key) in deviceEditForm.deviceForm.protocols[deviceEditForm.protocolName]" :key="key" :label="key">
          <el-input v-model="deviceEditForm.deviceForm.protocols[deviceEditForm.protocolName][key]"></el-input>
        </el-form-item>
        <el-form-item label="设备模板" prop="profile">
          <el-select v-model="deviceEditForm.deviceForm.profile.name" placeholer="请选择设备模板" @change="handleProfile">
            <el-option v-for="(item, index) in profileList" :key="index" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备服务名称" prop="service.name">
          <el-select v-model="deviceEditForm.deviceForm.service.name" placeholder="请选择设备服务">
            <el-option v-for="(item, i) in deviceServiceList" :key="i" :label="item.name" :value="item.name"></el-option>
          </el-select>
<!--          <el-input v-model="deviceEditForm.deviceForm.service.name" autocomplete="off" placeholder="请输入设备服务名称"></el-input>-->
        </el-form-item>
        <el-form-item v-for="(item, index) in deviceEditForm.deviceForm.autoEvents"
        label="事件及频率"
        :key="index"
        :prop="'deviceEditForm.deviceForm.autoEvents.'+ index">
          <el-col :span="18">
            <el-select v-model="item.resource" placeholder="请选择事件资源">
              <el-option v-for="(item1, j) in deviceResource" :key="j" :label="item1" :value="item1"></el-option>
            </el-select>
          <br />
            <el-select v-model="item.frequency" placeholder="请选择事件频率">
              <el-option v-for="(item2, z) in deviceFrequency" :key="z" :label="item2.label" :value="item2.value"></el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" @click="addAuto" icon="el-icon-plus" circle size="small"></el-button>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" @click="deleteAuto(index)" icon="el-icon-minus" circle size="small"></el-button>
          </el-col>
        </el-form-item>
<!--        <el-form-item label="服务管理状态" prop="service">-->
<!--          <el-select v-model="deviceEditForm.deviceForm.service.adminState" placeholder="请选择服务管理状态">-->
<!--            <el-option label="UNLOCKED" value="UNLOCKED"></el-option>-->
<!--            <el-option label="LOCKED" value="LOCKED"></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
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
  name: 'DeviceEditForm',
  data () {
    return {
      profileList: [],
      protocolList: [],
      protocolItem: {},
      deviceServiceList: [],
      deviceResource: [],
      deviceFrequency: [
        {label: '1秒', value: '1s'},
        {label: '3秒', value: '3s'},
        {label: '5秒', value: '5s'},
        {label: '10秒', value: '10s'}
      ],
      deviceEditForm: {
        gwip: '',
        labelText: '',
        protocolName: '',
        deviceForm: {
          name: '',
          description: '',
          operatingState: 'ENABLED',
          adminState: 'UNLOCKED',
          labels: [],
          protocols: {},
          service: {
            name: '',
            adminState: 'UNLOCKED'
          },
          profile: {
            name: ''
          },
          autoEvents: [
            {
              resource: '',
              frequency: ''
            }
          ]
        }
      }
    }
  },
  props: {
    editDialog: {
      type: Boolean,
      required: true,
      default: false
    },
    gwList: {
      type: Array,
      required: true
    }
  },
  // mounted () {
  //   this.getGWList()
  //   this.getProtocolList()
  // },
  methods: {
    // getGWList () {
    //   // 实际API
    //   // .post('http://localhost:8089/api/gateway', {
    //   // kong网关代理API
    //   // .post('http://localhost:8000/gc', {
    //   // 开发模式下代理API
    //   this.$axios.get('/gateways').then(resp => {
    //     if (resp && resp.status === 200) {
    //       this.gwList = resp.data
    //     }
    //   })
    // },
    getProtocolList () {
      var _this = this
      this.$axios
        // 实际API
        // .get('http://localhost:8081/api/device/protocol').then(resp => {
        // kong网关代理API
        .get(localStorage.socket + '/d/protocol').then(resp => {
        // .get('http://localhost:8000/d/protocol').then(resp => {
        // 开发模式代理API
        // .get('/devices/protocol').then(resp => {
          if (resp && resp.status === 200) {
            _this.protocolList = resp.data
          }
        }).catch(() => {
          this.$message('获取协议列表失败！')
        })
    },
    handleGWIP () {
      this.getDeviceServiceList()
      this.getProfileList()
    },
    handleProtocol () {
      this.$axios
        // 实际API
        // .get('http://localhost:8081/api/device/protocol/' + this.deviceEditForm.protocolName).then(resp => {
        // kong网关代理API
        .get(localStorage.socket + '/d/protocol/' + this.deviceEditForm.protocolName).then(resp => {
        // .get('http://localhost:8000/d/protocol/' + this.deviceEditForm.protocolName).then(resp => {
        // 开发模式下代理API
        // .get('/devices/protocol/' + this.deviceEditForm.protocolName).then(resp => {
          if (resp && resp.status === 200) {
            this.deviceEditForm.deviceForm.protocols = resp.data
          }
        }).catch(() => {
          this.$message('获取协议信息失败！')
        })
    },
    handleProfile () {
      let profileName = this.deviceEditForm.deviceForm.profile.name
      console.log(profileName)
      // console.log(this.profileList[index])
      // console.log(this.profileList[index].deviceResources)
      this.$axios.get(localStorage.socket + '/p/name/json/' + profileName).then(resp => {
        if (resp && resp.status === 200) {
          for (let i in resp.data.deviceResources) {
            this.deviceResource.push(resp.data.deviceResources[i].name)
          }
        }
      }).catch(() => {
        this.$message.error('获取资源失败！')
      })
    },
    handleLabel () {
      this.deviceEditForm.deviceForm.labels.push(this.deviceEditForm.labelText)
    },
    getProfileList () {
      this.$axios
        // 实际API
        // .get('http://localhost:8091/api/profile/gateway/' + this.deviceEditForm.gwip + '/list').then(resp => {
        // kong网关代理API
        .get(localStorage.socket + '/p/gateway/' + this.deviceEditForm.gwip + '/list').then(resp => {
        // .get('http://localhost:8000/p/gateway/' + this.deviceEditForm.gwip + '/list').then(resp => {
        // 开发模式下代理API
        // .get('/profiles/gateway/' + this.deviceEditForm.gwip + '/list').then(resp => {
          if (resp && resp.status === 200) {
            this.profileList = resp.data
          }
        }).catch(() => {
          this.$message.warning('请先选择网关!')
        })
    },
    getDeviceServiceList () {
      this.$axios
        // 实际API
        // .get('http://localhost:8081/device/service/' + this.deviceEditForm.gwip).then(resp => {
        // kong网关代理API
        .get(localStorage.socket + '/d/service/' + this.deviceEditForm.gwip).then(resp => {
        // .get('http://localhost:8000/d/service/' + this.deviceEditForm.gwip).then(resp => {
        // 开发模式下代理API
        // .get('/devices/service/' + this.deviceEditForm.gwip).then(resp => {
          if (resp && resp.status === 200) {
            this.deviceServiceList = resp.data
          }
        }).catch(() => {
          this.$message('请先选择网关!')
        })
    },
    clear () {
      this.deviceResource = []
      this.deviceEditForm = {
        gwip: '',
        deviceForm: {
          name: '',
          description: '',
          operatingState: 'ENABLED',
          adminState: 'UNLOCKED',
          labels: [],
          protocols: {},
          profile: {
            name: ''
          },
          service: {
            name: '',
            adminState: 'UNLOCKED'
          },
          autoEvents: [
            {
              resource: '',
              frequency: ''
            }
          ]
        }
      }
      this.$emit('hideDialog')
    },
    addAuto () {
      this.deviceEditForm.deviceForm.autoEvents.push(
        {
          resource: '',
          frequency: ''
        }
      )
    },
    deleteAuto (index) {
      if (index !== -1) {
        this.deviceEditForm.deviceForm.autoEvents.splice(index, 1)
      }
    },
    onSubmit () {
      var _this = this
      this.$axios
        // 实际API
        // .post('http://localhost:8081/api/device/ip/' + _this.deviceEditForm.gwip, _this.deviceEditForm.deviceForm).then(resp => {
        // kong网关代理API
        .post(localStorage.socket + '/d/ip/' + _this.deviceEditForm.gwip, _this.deviceEditForm.deviceForm).then(resp => {
        // .post('http://localhost:8000/d/ip/' + _this.deviceEditForm.gwip, _this.deviceEditForm.deviceForm).then(resp => {
        // 开发模式下代理API
        // .post('/devices/ip/' + _this.deviceEditForm.gwip, _this.deviceEditForm.deviceForm).then(resp => {
          if (resp && resp.status === 200) {
            _this.editDialog = false
            _this.$emit('onSubmit')
          }
        }).catch(() => {
          _this.$message('添加设备失败！请重试！')
        })
    }
  },
  watch: {
    editDialog: function (newValue, oldValue) {
      if (newValue) {
        this.getProtocolList()
      }
    }
  }
}
</script>

<style scoped>

</style>
