<template>
  <el-container style="margin-top: 5px;margin-right: 5px;margin-left: 5px">
    <el-main>
      <div class="dashboard-editor-container">
        <panel-group />
        <el-row :gutter="32">
          <el-col :xs="24" :sm="24" :lg="12">
            <div class="chart-wrapper">
              <scenario-line-chart />
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="12">
            <div class="chart-wrapper">
              <device-line-chart />
            </div>
          </el-col>
        </el-row>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import PanelGroup from './PanelGroup'
import ScenarioLineChart from './ScenarioLineChart'
import DeviceLineChart from './DeviceLineChart'

export default {
  name: 'AppIndex',
  components: {DeviceLineChart, ScenarioLineChart, PanelGroup}
}
</script>

<style lang="scss" scoped>
  .dashboard-editor-container {
    padding: 32px;
    background-color: #f6f6f6;
    position: relative;
    margin: -20px 0 0 -10px;
  }
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }

</style>
