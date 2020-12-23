<template>
  <div>
    <log ref="OamLog" :come="come" :urlPath="urlPath" :sourceList="sourceList"></log>
  </div>
</template>

<script>
import Log from './Log'
export default {
  name: 'OamLog',
  components: {Log},
  data () {
    return {
      come: '运维日志',
      urlPath: 'log',
      sourceList: [{value: '全部', label: '全部'},
        {value: '消息路由', label: '消息路由'},
        {value: '模板管理', label: '模板管理'},
        {value: '网关管理', label: '网关管理'},
        {value: '设备管理', label: '设备管理'},
        {value: '场景管理', label: '场景管理'},
        {value: '指令管理', label: '指令管理'},
        {value: '运维监控', label: '运维监控'},
        {value: '规则管理', label: '规则管理'},
        {value: '规则引擎', label: '规则引擎'},
        {value: '网关实例', label: '网关实例'},
        {value: '网关指令', label: '网关指令'},
        {value: '服务管理', label: '服务管理'}]
    }
  },
  mounted () {
    this.$refs.OamLog.refreshLog()
  }
}
</script>

<style scoped>

</style>
