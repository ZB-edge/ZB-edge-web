<template>
  <el-dialog
    title="查看该场景下的设备状况"
    :visible.sync="dialogFormVisible"
    width="30%"
    @close="clear">
        <el-table
          :data="statusData"
          tooltip-effect="dark"
          border
          style="width: 100%">
          <el-table-column label="名称" prop="name"></el-table-column>
          <el-table-column label="设备" prop="device"></el-table-column>
          <el-table-column label="起始" prop="origin"></el-table-column>
          <el-table-column label="值" prop="value"></el-table-column>
        </el-table>
    <div slot="footer" class="dialog-footer" style="text-align: center">
      <el-button @click="dialogFormVisible = false">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'ScenarioDeviceState',
  data () {
    return {
      dialogFormVisible: false,
      statusData: []
    }
  },
  // mounted () {
  //   this.loadStatus()
  // },
  methods: {
    // loadStatus () {
    //   this.$axios.get('/scenarios/scenario/status/' + this.name).then(resp => {
    //     if (resp && resp.status === 200) {
    //       this.deviceData = resp.data
    //       this.loading = false
    //     }
    //   }).catch(() => {
    //     this.$message('获取状态信息失败！')
    //   })
    // },
    clear () {
      this.dialogFormVisible = false
    }
  }
}
</script>

<style scoped>

</style>
