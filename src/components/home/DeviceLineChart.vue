<template>
  <!--为echarts准备一个具备大小的容器dom-->
  <div id="deviceLine" ref="deviceLine" style="height: 350px;width: 100%"></div>
</template>
<script>
import echarts from 'echarts'
require('echarts/theme/macarons')
export default {
  name: 'DeviceLineChart',
  data () {
    return {
      option: {
        title: {
          text: '网关及设备注册信息统计',
          left: 'center',
          textStyle: {
            color: '#551513'
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          top: 30,
          data: []
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ''

        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: false
          }
        },
        series: []
      }
    }
  },
  mounted () {
    this.getAddition()
  },
  methods: {
    // getAddition () {
    //   let gatewayAddition = []
    //   let deviceAddition = []
    //   // 实际API
    //   // this.$axios.get('http://localhost:8089/api/gateway/days?days=30').then(resp => {
    //   // kong网关代理API
    //   this.$axios.get(localStorage.socket + '/gc/days?days=30').then(resp => {
    //   // this.$axios.get('http://localhost:8000/gc/days?days=30').then(resp => {
    //   // 开发模式下代理API
    //   // this.$axios.get('/gateways/days?days=30').then(resp => {
    //     if (resp && resp.status === 200) {
    //       gatewayAddition = resp.data
    //       // 实际API
    //       // this.$axios.get('http://localhost:8081/api/device/days?days=30').then(resp => {
    //       // kong网关代理API
    //       this.$axios.get(localStorage.socket + '/d/days?days=30').then(resp => {
    //       // this.$axios.get('http://localhost:8000/d/days?days=30').then(resp => {
    //       // 开发模式下代理API
    //       // this.$axios.get('/devices/days?days=30').then(resp => {
    //         if (resp && resp.status === 200) {
    //           deviceAddition = resp.data
    //           this.drawLine(gatewayAddition, deviceAddition)
    //         }
    //       })
    //     }
    //   })
    //   // // 实际API
    //   // // this.$axios.get('http://localhost:8081/api/device/days?days=30').then(resp => {
    //   // // kong网关代理API
    //   // // this.$axios.get('http://localhost:8000/d/days?days=30').then(resp => {
    //   // // 开发模式下代理API
    //   // this.$axios.get('/devices/days?days=30').then(resp => {
    //   //   if (resp && resp.status === 200) {
    //   //     deviceAddition = resp.data
    //   //     console.log('222')
    //   //     console.log(gatewayAddition)
    //   //     this.drawLine(gatewayAddition, deviceAddition)
    //   //   }
    //   // })
    // },
    getAddition () {
      let addition = []
      // 实际API
      // this.$axios.get('http://localhost:8089/api/device/ip/count').then(resp => {
      // kong网关代理API
      this.$axios.get(localStorage.socket + '/d/ip/count').then(resp => {
        // this.$axios.get('http://localhost:8000//d/ip/count').then(resp => {
        // 开发模式下代理API
        // this.$axios.get('/devices/ip/count').then(resp => {
        if (resp && resp.status === 200) {
          addition = resp.data
          this.drawLine(addition)
        }
      })
    },
    // drawLine (gatewayAddition, deviceAddition) {
    //   let date = []
    //   let deviceCount = []
    //   let gwCount = []
    //   for (let x = 29; x >= 0; x--) {
    //     date.push(deviceAddition[x]['endDate'].slice(0, 10))
    //     gwCount.push(gatewayAddition[x]['count'])
    //     deviceCount.push(deviceAddition[x]['count'])
    //   }
    //   this.option.xAxis.data = date
    //   this.option.series[0].data = deviceCount
    //   this.option.series[1].data = gwCount
    //   let chart = this.$refs.deviceLine
    //   let deviceCharts = echarts.init(chart, 'macarons')
    //   deviceCharts.setOption(this.option)
    // }
    drawLine (addition) {
      let date = []
      for (let i in addition.total) {
        date.push(i)
      }
      for (let x in addition) {
        this.option.legend.data.push(x)
        let data = []
        for (let y in addition[x]) {
          data.push(addition[x][y])
        }
        this.option.series.push({
          name: x,
          type: 'line',
          data: data
        })
      }
      this.option.xAxis.data = date
      let chart = this.$refs.deviceLine
      let deviceCharts = echarts.init(chart, 'macarons')
      deviceCharts.setOption(this.option)
    }
  }

}
</script>

<style scoped>

</style>
