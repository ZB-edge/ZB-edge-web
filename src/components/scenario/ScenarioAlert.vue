<template>
  <div id="main" style="height: 350px;width: 100%">
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'ScenarioAlert',
  data () {
    return {
      charts: '',
      scenarioName: '',
      alertDate: [],
      alertNum: [],
      option: {
        // title: {
        //   text: '场景服务告警信息统计',
        //   left: 'bottom',
        //   top: 20,
        //   textStyle: {
        //     color: '#ccc',
        //     fontStyle: 'italic'
        //   }
        // },
        tooltip: {
          trigger: 'axis',
          formatter: function (a) {
            let list = []
            let listItem = ''
            for (var i = 0; i < a.length; i++) {
              list.push(
                '<i style="display: inline-block;width: 10px;height: 10px;}"></i><span style="display:inline-block;">' +
                  a[i].data.time + `有${a[i].data.value}条告警信息：` + '<br>' +
                a[i].data.msg
              )
            }
            listItem = list.join('<br>')
            return '<div class="showBox">' + listItem + '</div>'
          }
        },
        legend: {
          data: ['告警信息数量']
        },
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: ''
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '告警信息数量',
            type: 'line',
            stack: '增量',
            symbolSize: 10,
            data: ''
          }
        ]
      }
    }
  },
  mounted () {
    this.loadAlert()
  },
  methods: {
    loadAlert () {
      // kong网关代理API
      this.$axios.get(localStorage.socket + '/s/notice?days=10').then(resp => {
      // this.$axios.get('http://localhost:8000/s/notice?days=10').then(resp => {
      // 实际地址
      // this.$axios.get('http://localhost:8092/api/scenario/notice?days=10').then(resp => {
      // 开发模式下代理API
      // this.$axios.get('/scenarios/notice?days=10').then(resp => {
        if (resp && resp.status === 200) {
          this.deal(resp.data)
        }
      })
    },
    deal (data) {
      var alert = []
      for (var x = 0; x < data.length; x++) {
        if (data[x]['source'] === this.scenarioName || this.scenarioName === '') {
          alert.push(data[x].created.slice(0, 10))
        }
      }
      alert = alert.sort()
      var alertobj = {}
      for (var i = 0; i < alert.length; i++) {
        var item = alert[i]
        alertobj[item] = (alertobj[item] + 1) || 1
      }
      for (var key in alertobj) {
        this.alertDate.push(key)
        this.alertNum.push(alertobj[key])
      }
      var newData = []
      for (var index = 0; index < this.alertNum.length; index++) {
        var newObj = {}
        newObj['value'] = this.alertNum[index]
        newObj['time'] = this.alertDate[index]
        var msg = ''
        for (var k = 0; k < data.length; k++) {
          if (data[k].created.slice(0, 10) === this.alertDate[index]) {
            msg += data[k].source + '：' + data[k].message + '<br>'
          }
        }
        newObj['msg'] = `${msg}`
        newData.push(newObj)
      }
      this.option.xAxis.data = this.alertDate
      // this.option.series[0].data = this.alertNum
      this.option.series[0].data = newData
      this.charts = echarts.init(document.getElementById('main'))
      this.charts.setOption(this.option)
    }
  }
}
</script>

<style scoped>

</style>
