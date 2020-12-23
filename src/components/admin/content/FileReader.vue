<template>
    <label class="file-reader">
      导入YML文件
      <input type="file"  @change="loadTextFormFile" />
    </label>
</template>

<script>
export default {
  name: 'FileReader',
  methods: {
    loadTextFormFile (e) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = e => this.$emit('load', e.target.result)
      reader.readAsText(file)
    }
  }
}
</script>

<style scoped>
  .file-reader {
    background-color: #ff4d51;
    border-color: #ff4d51;
    color: white;
    border-radius: 5px;
    padding: 8px 12px;
    cursor: pointer;
  }
  input {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    opacity: 0;
  }

</style>
