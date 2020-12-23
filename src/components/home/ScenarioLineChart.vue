<template>
  <!--为echarts准备一个具备大小的容器dom-->
  <div id="lineChart" style="height: 350px;width: 100%"></div>
</template>
<script>
import echarts from 'echarts'
require('echarts/theme/macarons')
export default {
  name: 'ScenarioLineChart',
  data () {
    return {
      charts: '',
      scenarioAddition: [],
      xdata: [],
      ydata: [],
      option: {
        title: {
          text: '近30天场景服务接入信息统计',
          left: 'center',
          textStyle: {
            color: '#551513'
          }
        },
        tooltip: {},
        legend: {
          top: 30,
          data: ['场景服务接入数量']
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
          splitLine: {
            show: false
          },
          type: 'value',
          max: 10
        },

        series: [{
          name: '场景服务接入数量',
          type: 'bar',
          data: ''
        }]
      }
    }
  },
  mounted () {
    this.loadScenarioAddition()
  },
  methods: {
    loadScenarioAddition () {
      // 实际API
      // this.$axios.get('http://localhost:8092/api/scenario/days?days=30').then(resp => {
      // kong网关代理API
      this.$axios.get(localStorage.socket + '/s/days?days=30').then(resp => {
      // this.$axios.get('http://localhost:8000/s/days?days=30').then(resp => {
      // 开发模式下代理API
      // this.$axios.get('/scenarios/days?days=30').then(resp => {
        if (resp && resp.status === 200) {
          this.scenarioAddition = resp.data
          this.drawLine(this.scenarioAddition)
        }
      })
    },
    drawLine (data) {
      for (var x = 29; x >= 0; x--) {
        this.xdata.push(data[x]['endDate'].slice(0, 10))
        this.ydata.push(data[x]['count'])
      }
      this.option.xAxis.data = this.xdata
      this.option.series[0].data = this.ydata
      this.charts = echarts.init(document.getElementById('lineChart'), 'macarons')
      this.charts.setOption(this.option)
    }
  }
}
</script>

<style scoped>

</style>
