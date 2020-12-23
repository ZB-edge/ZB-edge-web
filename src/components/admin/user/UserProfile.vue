<template>
  <div>
    <el-dialog
      title="修改用户信息"
      :visible.sync="dialogFormVisible">
      <el-form v-model="selectedUser" style="text-align: left;" ref="dataForm">
        <el-form-item label="用户名" label-width="120px" prop="username">
          <label>{{ selectedUser.username }}</label>
        </el-form-item>
        <el-form-item label="真实姓名" label-width="120px" prop="name">
          <el-input v-model="selectedUser.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" label-width="120px" prop="phone">
          <el-input v-model="selectedUser.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="120px" prop="email">
          <el-input v-model="selectedUser.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="120px" prop="password">
          <el-button type="warning" @click="resetPassword(selectedUser.username)">重置密码</el-button>
        </el-form-item>
        <el-form-item label="角色分配" label-width="120px" prop="roles">
          <el-checkbox-group v-model="selectedRolesIds">
            <el-checkbox v-for="(role, i) in roles" :key="i" :label="role.id">{{ role.nameZh }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit(selectedUser)">确 定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-row style="margin: 18px 0px 0px 18px ">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>管理中心</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户信息</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <bulk-registration @onSubmit="listUsers()"></bulk-registration>
    <el-card style="margin: 18px 2%;width: 95%">
      <el-table
        ref="multipleTable"
        :data="users"
        stripe
        :default-sort = "{prop: 'id', order: 'ascending'}"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :max-height="800">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="id"
          label="id"
          sortable
          width="200">
        </el-table-column>
        <el-table-column
          prop="username"
          label="用户名"
          fit>
        </el-table-column>
        <el-table-column
          prop="name"
          label="真实姓名"
          fit>
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号"
          fit>
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          show-overflow-tooltip
          fit>
        </el-table-column>
        <el-table-column
          label="状态"
          sortable
          width="100">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enabled"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="(value) => commitStatusChange(value, scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="250">
          <template slot-scope="scope">
            <el-button
              @click="editUser(scope.row)"
              type="success"
              size="small">
              编辑
            </el-button>
            <el-button
              @click="deleteUser(scope.row)"
              type="success"
              size="small">
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin: 20px 0 20px 0;float: left">
        <el-button @click="toggleSelection">取消选择</el-button>
        <el-button @click="multipleDelete">批量删除</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import BulkRegistration from './BulkRegistration'
export default {
  name: 'UserProfile',
  components: {BulkRegistration},
  data () {
    return {
      users: [],
      roles: [],
      dialogFormVisible: false,
      selectedUser: [],
      selectedRolesIds: [],
      multipleSelection: []
    }
  },
  mounted () {
    this.listUsers()
    this.listRoles()
  },
  methods: {
    listUsers () {
      var _this = this
      // 实际API
      // this.$axios.get('http://localhost:8093/api/admin/user').then(resp => {
      // kong网关代理API
      this.$axios.get(localStorage.socket + '/u/user').then(resp => {
      // this.$axios.get('http://localhost:8000/u/user').then(resp => {
      // 开发代理API
      // this.$axios.get('/admins/user').then(resp => {
        if (resp && resp.data.code === 200) {
          _this.users = resp.data.result
        }
      })
    },
    listRoles () {
      var _this = this
      // 实际API
      // this.$axios.get('http://localhost:8093/api/admin/role').then(resp => {
      // kong网关代理API
      this.$axios.get(localStorage.socket + '/u/role').then(resp => {
      // this.$axios.get('http://localhost:8000/u/role').then(resp => {
      // 开发代理API
      // this.$axios.get('/admins/role').then(resp => {
        if (resp && resp.data.code === 200) {
          _this.roles = resp.data.result
        }
      })
    },
    commitStatusChange (value, user) {
      if (user.username !== 'admin') {
        // 实际API
        // this.$axios.put('http://localhost:8093/api/admin/user/status', {
        // kong网关代理API
        this.$axios.put(localStorage.socket + '/u/user/status', {
        // this.$axios.put('http://localhost:8000/u/user/status', {
        // 开发代理API
        // this.$axios.put('/admins/user/status', {
          enabled: value,
          username: user.username
        }).then(resp => {
          if (resp && resp.data.code === 200) {
            if (value) {
              this.$message.success('用户 [' + user.username + '] 已启用')
            } else {
              this.$message.success('用户 [' + user.username + '] 已禁用')
            }
          }
        })
      } else {
        user.enable = true
        this.$alert('不能禁用管理员账户')
      }
    },
    onSubmit (user) {
      let _this = this
      // 根据视图绑定的角色 id 向后端传送角色信息
      let roles = []
      for (let i = 0; i < _this.selectedRolesIds.length; i++) {
        for (let j = 0; j < _this.roles.length; j++) {
          if (_this.selectedRolesIds[i] === _this.roles[j].id) {
            roles.push(_this.roles[j])
          }
        }
      }
      // 实际API
      // this.$axios.put('http://localhost:8093/api/admin/user', {
      // kong网关代理API
      this.$axios.put(localStorage.socket + '/u/user', {
      // this.$axios.put('http://localhost:8000/u/user', {
      // 开发代理API
      // this.$axios.put('/admins/user', {
        username: user.username,
        name: user.name,
        phone: user.phone,
        email: user.email,
        roles: roles
      }).then(resp => {
        if (resp && resp.data.code === 200) {
          this.$message.success('用户信息修改成功')
          this.dialogFormVisible = false
          // 修改角色后重新请求用户信息，实现视图更新
          this.listUsers()
        } else {
          this.$alert(resp.data.message)
        }
      })
    },
    deleteUser (user) {
      if (user.username === 'admin') {
        this.$message.warning('不能删除管理员账户')
      } else {
        // 实际API
        // this.$axios.delete('http://localhost:8093/api/admin/user/id/' + user.id).then(resp => {
        // kong网关代理API
        this.$axios.delete(localStorage.socket + '/u/user/id/' + user.id).then(resp => {
        // this.$axios.delete('http://localhost:8000/u/user/id/' + user.id).then(resp => {
        // 开发代理API
        // this.$axios.delete('/admins/user/id/' + user.id).then(resp => {
          if (resp && resp.data.code === 200) {
            this.listUsers()
            this.$message.success('已删除用户：' + user.username)
          }
        }).catch(() => {
          this.$message.error('用户删除失败')
        })
      }
    },
    multipleDelete () {
      let deleteSelection = []
      deleteSelection = this.multipleSelection
      if (deleteSelection === []) {
        this.$message.warning('请勾选用户')
      } else {
        for (let i = 0; i < deleteSelection.length; i++) {
          this.deleteUser(deleteSelection[i])
        }
      }
    },
    editUser (user) {
      if (user.username === 'admin') {
        this.$alert('不允许编辑管理员用户')
      } else {
        this.dialogFormVisible = true
        this.selectedUser = user
        let roleIds = []
        for (let i = 0; i < user.roles.length; i++) {
          roleIds.push(user.roles[i].id)
        }
        this.selectedRolesIds = roleIds
      }
    },
    resetPassword (username) {
      // 实际API
      // this.$axios.put('http://localhost:8093/api/admin/user/password', {
      // kong网关代理API
      this.$axios.put(localStorage.socket + '/u/user/password', {
      // this.$axios.put('http://localhost:8000/u/user/password', {
      // 开发代理API
      // this.$axios.put('/admins/user/password', {
        username: username
      }).then(resp => {
        if (resp && resp.data.code === 200) {
          this.$alert('密码已重置为１２３')
        }
      })
    },
    toggleSelection () {
      this.$refs.multipleTable.clearSelection()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    }

  }
}
</script>

<style scoped>

</style>
