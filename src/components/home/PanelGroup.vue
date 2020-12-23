<template>
  <div>
    <el-drawer
      :visible.sync="deviceDialog"
      :direction="direction"
      :withHeader="false">
      <h3>设备名称：{{ device.name }}</h3>
      <div style="text-align: left">
        <span>设备ID：{{ device.id }}</span><br />
        <span>设备描述：{{ device.description }}</span><br />
        <span>添加日期：{{ device.createdTime }}</span><br />
        <span>所属网关：{{ device.gateway }}</span><br />
        <span>设备标签：{{ device.labels }}</span><br />
        <span>设备协议：</span><br />
        <div><span v-for="(item, proto, i) in device.protocols" :key="i"><span>&nbsp;&nbsp;</span>{{ proto }}：<br />
        <ul>
          <li v-for="(value, key) in item" :key="key">{{key}}：{{value}}</li>
        </ul></span>
        </div>
        <span>设备服务：</span><br />
        <span>&nbsp;&nbsp;</span><span>服务名称： {{device.service.name}}</span><br />
        <span>&nbsp;&nbsp;</span><span>服务寻址：</span><br />
        <ul>
          <li>名称： {{device.service.addressable.name}}</li>
          <li>协议： {{device.service.addressable.protocol}}</li>
          <li>方式： {{device.service.addressable.method}}</li>
          <li>地址： {{device.service.addressable.address}}</li>
          <li>端口： {{device.service.addressable.port}}</li>
          <li>路径： {{device.service.addressable.path}}</li>
          <li>基础URL： {{device.service.addressable.baseURL}}</li>
          <li>URL： {{device.service.addressable.URL}}</li>
        </ul>
        <span>设备模板：{{device.profile.name}}</span><br />
        <span>设备操作状态：{{device.operatingState}}</span><br />
        <span>设备管理状态：{{device.adminState}}</span>
      </div>
    </el-drawer>
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <el-tooltip effect="dark" placement="bottom-start" transition>
          <div slot="content">
            新增设备详情：<br />
            <span v-for="(item, i) in deviceAddition.details" :key="i" @click="deviceDetail(item.gateway, item.id)">网关：{{ item.gateway }}<span>&nbsp;&nbsp;</span>新增<span>&nbsp;&nbsp;</span>设备：{{ item.name }}<br /></span>
          </div>
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-device">
              <i class="el-icon-s-platform" style="font-size: 40px"></i>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                今日设备数量增加：
              </div>
              <count-to :start-val="0" :end-val="deviceAddition.count" :duration="2600" class="card-panel-num" />
            </div>
          </div>
        </el-tooltip>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <el-tooltip effect="dark" placement="bottom-start" transition>
          <div slot="content">
            新增网关详情：<br />
            <span v-for="(item, i) in gatewayAddition.gatewayList" :key="i">网关名：{{ item.name}}<span>&nbsp;&nbsp;</span>IP：{{ item.ip }}<br /></span>
          </div>
          <div class="card-panel" @click="handleSetLineChartData('gateways')">
            <div class="card-panel-icon-wrapper icon-gateway">
              <i class="el-icon-s-management" style="font-size: 40px"></i>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                今日网关数量增加：
              </div>
              <count-to :start-val="0" :end-val="gatewayAddition.count" :duration="3000" class="card-panel-num" />
            </div>
          </div>
        </el-tooltip>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('replaces')">
          <div class="card-panel-icon-wrapper icon-replace">
            <i class="el-icon-s-operation" style="font-size: 40px"></i>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              需要更换的设备：
            </div>
            <count-to :start-val="0" :end-val="0" :duration="3200" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <el-tooltip effect="dark" placement="bottom-start" transition>
          <div slot="content">
            未启动微服务详情：<br />
            <span v-for="(item, i) in microDetail" :key="i">网关：{{ item.ip}}<span>&nbsp;&nbsp;</span>未启动微服务：{{ item.microSer }}<br /></span>
          </div>
          <div class="card-panel" @click="handleSetLineChartData('replaces')">
            <div class="card-panel-icon-wrapper icon-replace">
              <i class="el-icon-warning" style="font-size: 40px"></i>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                未运行微服务数：
              </div>
              <count-to :start-val="0" :end-val="offlineCount" :duration="3200" class="card-panel-num" />
            </div>
          </div>
        </el-tooltip>
      </el-col>
    </el-row>
  </div>

</template>

<script>
import CountTo from 'vue-count-to'
export default {
  name: 'PanelGroup',
  components: {CountTo},
  data () {
    return {
      deviceAddition: {
        count: 0,
        details: [
          {
            name: '',
            gateway: '',
            id: ''
          }
        ]
      },
      device: {
        operatingState: '',
        service: {
          name: '',
          operatingState: '',
          addressable: {
            name: '',
            protocol: '',
            method: '',
            address: '',
            port: 0,
            path: '',
            baseURL: '',
            url: ''
          }
        },
        profile: {
          name: ''
        },
        name: '',
        adminState: '',
        description: '',
        createdTime: '',
        id: '',
        protocols: {
          modbus: {
            Address: '',
            BaudRate: '',
            DataBits: '',
            Parity: '',
            StopBits: '',
            UnitID: ''
          }
        },
        gateway: '',
        labels: []
      },
      deviceDialog: false,
      direction: 'rtl',
      gatewayAddition: {
        count: 0,
        gatewayList: [
          {
            name: '',
            ip: ''
          }
        ]
      },
      microService: [],
      microDetail: [],
      offlineCount: 0
    }
  },
  mounted () {
    this.getDeviceCount()
    this.getGatewayCount()
    this.getGatewayState()
  },
  methods: {
    getDeviceCount () {
      // 实际API
      // this.$axios.get('http://localhost:8081/api/device/days?days=1').then(resp => {
      // kong网关代理API
      this.$axios.get(localStorage.socket + '/d/days?days=1').then(resp => {
      // this.$axios.get('http://localhost:8000/d/days?days=1').then(resp => {
      // 开发模式下代理API
      // this.$axios.get('/devices/days?days=1').then(resp => {
        if (resp && resp.status === 200) {
          this.deviceAddition = resp.data[0]
        }
      }).catch(() => {
        this.$message.error('获取设备新增信息失败！')
      })
    },
    getGatewayCount () {
      // 实际API
      // this.$axios.get('http://localhost:8089/api/gateway/days?days=1').then(resp => {
      // kong网关代理API
      this.$axios.get(localStorage.socket + '/gc/days?days=1').then(resp => {
      // this.$axios.get('http://localhost:8000/gc/days?days=1').then(resp => {
      // 开发模式下代理API
      // this.$axios.get('/gateways/days?days=1').then(resp => {
        if (resp && resp.status === 200) {
          this.gatewayAddition = resp.data[0]
        }
      }).catch(() => {
        this.$message.error('获取网关新增信息失败！')
      })
    },
    getGatewayState () {
      // 实际API
      // this.$axios.get('http://localhost:8089/api/gateway/state').then(resp => {
      // kong网关代理API
      this.$axios.get(localStorage.socket + '/gc/state').then(resp => {
      // this.$axios.get('http://localhost:8000/gc/state').then(resp => {
      // 开发模式下代理API
      // this.$axios.get('/gateways/state').then(resp => {
        if (resp && resp.status === 200) {
          this.microService = resp.data
          for (let i in resp.data) {
            let obj = {ip: resp.data[i]['ip'], microSer: []}
            for (let key in resp.data[i]['state']) {
              if (!resp.data[i]['state'][key]) {
                obj.microSer.push(key)
                this.offlineCount += 1
              }
            }
            if (obj.microSer.length !== 0) {
              this.microDetail.push(obj)
            }
          }
        }
      })
    },
    deviceDetail (ip, id) {
      // 实际API
      // this.$axios.get('http://localhost:8081/api/device/ip/' + ip + '/id/' + id).then(resp => {
      // kong网关代理API
      this.$axios.get(localStorage.socket + '/d/ip/' + ip + '/id/' + id).then(resp => {
      // this.$axios.get('http://localhost:8000/d/ip/' + ip + '/id/' + id).then(resp => {
      // 开发模式下代理API
      // this.$axios.get('/devices/ip/' + ip + '/id/' + id).then(resp => {
        if (resp && resp.status === 200) {
          this.device = resp.data
        }
      }).catch(() => {
        this.$message.error('查看设备详情失败！')
      })
      this.deviceDialog = true
    },
    handleSetLineChartData (type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style lang="scss">
.panel-group {
  margin-top: 18px;
  .card-panel-col {
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-device {
        background: #40c9c6;
      }
      .icon-gateway {
        background: #36a3f7;
      }
      .icon-replace {
        background: #f4516c;
      }
    }
    .icon-device {
      color: #40c9c6;
    }
    .icon-gateway {
      color: #36a3f7;
    }
    .icon-replace {
      color: #f4516c;
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, .45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
.el-drawer.rtl {

  overflow: scroll
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }
  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;
    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
