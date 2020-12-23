<template>
    <el-upload
      ref="upload"
      :action="uploadApi"
      with-credentials
      :before-remove="beforeRemove"
      :on-success="handleSuccess"
      multiple
      :limit="1"
      :on-exceed="handleExceed"
      :file-list="fileList">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload_tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
<!--  实际API-->
<!--  action="http://localhost:8093/api/system/logo"-->
<!--  开发代理API-->
<!--  action="/users/system/logo"-->
<!--  kong网关代理-->
<!--  action="http://localhost:8000/u/system/logo"-->
</template>

<script>
export default {
  name: 'ImgUpload',
  data () {
    return {
      uploadApi: localStorage.socket + '/u/system/logo',
      fileList: []
    }
  },
  methods: {
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择1个文件，本次选择了${files.length}个文件，共选择了${files.length + fileList.length}个文件`)
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除${file.name}？`)
    },
    handleSuccess (reaponse) {
      let url = reaponse
      console.log(url)
      this.$emit('onUpload', url)
      this.$message.warning('上传成功')
    },
    clear () {
      this.$refs.upload.clearFiles()
    }
  }
}
</script>

<style scoped>

</style>
