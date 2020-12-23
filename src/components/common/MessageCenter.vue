<template>
  <div>
    <el-row>
      <el-breadcrumb separator="/" style="margin-top: 5px;font-size: 16px;margin-left: 20px">
      <el-breadcrumb-item :to="{ path: '/index'}"><i class="el-icon-s-home" />首页</el-breadcrumb-item>
      <el-breadcrumb-item>信息中心</el-breadcrumb-item>
    </el-breadcrumb>
    </el-row>
    <el-card style="margin-top: 20px">
      <el-row>
        <el-table
          ref="multipleTable"
          :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
          tooltip-effect="dark"
          stripe
          style="width: 100%;"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            type="index"
            label="序号"
            width="200%"
            align="center">
          </el-table-column>
          <el-table-column
            header-algin="center"
            algin="center"
            label="消息内容">
            <template slot-scope="scope">
              {{ scope.row.message }}
            </template>
          </el-table-column>
          <el-table-column
            width="120px"
            label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="success" @click="deleteMessage(scope.$index)">已读</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin: 20px 0 20px 0;float: left">
          <el-button @click="toggleSelection">取消选择</el-button>
          <el-button @click="multipleDelete">一键清除</el-button>
        </div>
      </el-row>
      <el-row>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pagesize"
          :total="tableData.length">
        </el-pagination>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'MessageCenter',
  data () {
    return {
      currentPage: 1,
      pagesize: 4,
      tableData: [],
      bashurl: 'http://192.168.1.106:8086',
      multipleSelection: []
    }
  },
  created () {
    this.loadMessage()
  },
  methods: {
    loadMessage () {
      this.tableData = this.$store.state.messageCenter
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    toggleSelection () {
      this.$refs.multipleTable.clearSelection()
    },
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
    },
    deleteMessage (index) {
      this.$store.commit('deleteMessage', index, 1)
      this.loadMessage()
    },
    multipleDelete () {
      this.$store.commit('deleteMessage', 0, false)
      this.loadMessage()
    }
  }
}
</script>

<style scoped>

</style>
