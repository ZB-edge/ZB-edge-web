<template>
    <div>
      <el-dialog
        ref="chartDialog_root"
        title="日志统计数据图"
        :visible="dialogVisible"
        @close="hideData()">
        <el-carousel indicator-position="outside">
          <el-carousel-item>
            <div id="chart1" ref="piechart1" style="margin: auto;width: 600px;height:300px;"></div>
          </el-carousel-item>
          <el-carousel-item>
            <div id="chart2" ref="piechart2" style="margin: auto;width: 600px;height:300px;"></div>
          </el-carousel-item>
        </el-carousel>
      </el-dialog>
    </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'LogEchart',
  props: {
    dialogVisible: {
      type: Boolean,
      required: true,
      default: false
    },
    logs: {
      type: Array,
      required: true,
      default () {
        return {
          logs: [
            {source: '', category: ''}
          ]
        }
      }
    }
  },
  data () {
    return {
      infoNum: 0,
      debugNum: 0,
      warnNum: 0,
      errorNum: 0,
      wangguanguanliNum: 0,
      shebeiguanliNum: 0,
      wangguanshiliNum: 0,
      zhilingguanliNum: 0,
      changjingguanliNum: 0,
      xiaoxiluyouNum: 0,
      shebeimubanNum: 0,
      option1: {
        series: [
          {
            name: '日志类型统计饼图',
            type: 'pie',
            radius: '55%',
            data: [],
            roseType: 'angle',
            itemStyle: {
              normal: {
                shadowBlur: 200,
                shadowColor: 'rgba(0,0,0,0,0.5)'
              }
            }
          }
        ]
      },
      option2: {
        series: [
          {
            name: '日志来源统计饼图',
            type: 'pie',
            radius: '55%',
            data: [],
            roseType: 'angle',
            itemStyle: {
              normal: {
                shadowBlur: 200,
                shadowColor: 'rgba(0,0,0,0,0.5)'
              }
            }
          }
        ]
      }
    }
  },
  methods: {
    drawPie () {
      let chart1 = this.$refs.piechart1
      let chart2 = this.$refs.piechart2
      let mychart1 = echarts.init(chart1)
      let mychart2 = echarts.init(chart2)

      for (let i in this.logs) {
        let object1 = {}
        object1 = this.logs[i]
        if (object1['category'] === 'error') {
          this.errorNum += 1
        } else if (object1['category'] === 'warn') {
          this.warnNum += 1
        } else if (object1['category'] === 'debug') {
          this.debugNum += 1
        } else {
          this.infoNum += 1
        }
      }
      for (let x in this.logs) {
        let object2 = {}
        object2 = this.logs[x]
        if (object2['source'] === '网关管理') {
          this.wangguanguanliNum += 1
        } else if (object2['source'] === '设备管理') {
          this.shebeiguanliNum += 1
        } else if (object2['source'] === '网关实例') {
          this.wangguanshiliNum += 1
        } else if (object2['source'] === '指令') {
          this.zhilingguanliNum += 1
        } else if (object2['source'] === '场景') {
          this.changjingguanliNum += 1
        } else if (object2['source'] === '消息路由') {
          this.xiaoxiluyouNum += 1
        } else {
          this.shebeimubanNum += 1
        }
      }
      this.option1.series[0].data = [
        {value: this.infoNum, name: '信息日志/' + this.infoNum + '条'},
        {value: this.debugNum, name: '调试日志/' + this.debugNum + '条'},
        {value: this.warnNum, name: '警告日志/' + this.warnNum + '条'},
        {value: this.errorNum, name: '错误日志/' + this.errorNum + '条'}
      ]
      this.option2.series[0].data = [
        {value: this.wangguanguanliNum, name: '网关管理服务日志/' + this.wangguanguanliNum + '条'},
        {value: this.shebeiguanliNum, name: '设备管理服务日志/' + this.shebeiguanliNum + '条'},
        {value: this.wangguanshiliNum, name: '网关实例服务日志/' + this.wangguanshiliNum + '条'},
        {value: this.zhilingguanliNum, name: '指令管理服务日志/' + this.zhilingguanliNum + '条'},
        {value: this.changjingguanliNum, name: '场景管理服务日志/' + this.changjingguanliNum + '条'},
        {value: this.xiaoxiluyouNum, name: '消息路由服务日志/' + this.xiaoxiluyouNum + '条'},
        {value: this.shebeimubanNum, name: '设备模板服务日志/' + this.shebeimubanNum + '条'}
      ]
      mychart1.setOption(this.option1)
      mychart2.setOption(this.option2)
    },
    hideData () {
      this.$emit('hideDialog')
    }
  },
  watch: {
    dialogVisible: function (newValue, oldValue) {
      if (newValue) {
        this.$nextTick(() => {
          this.drawPie()
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
