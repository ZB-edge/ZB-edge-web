<template>
  <div style="margin-top: 20px;margin-bottom: 30px;display: flex;justify-content: left;align-items: center;">
    <el-input
      @keyup.enter.native="searchClick"
      placeholder="请输入名称进行搜索..."
      prefix-icon="el-icon-search"
      size="small"
      style="width: 200px;margin-right: 10px"
      v-model="keywords">
    </el-input>
    <el-button size="small" type="primary" icon="el-icon-search" @click="searchClick">搜索</el-button>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  data () {
    return {
      keywords: ''
    }
  },
  methods: {
    searchClick () {
      this.$emit('onSearch', this.keywords)
      this.keywords = ''
    }
  }
}
</script>

<style scoped>

</style>
