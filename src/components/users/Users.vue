<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input placeholder="请输入内容" v-model="requestUser.query" clearable>
          <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
    </el-card>
    <!-- user table -->
    <el-table
      :data="userInfo"
      style="width: 100%"
      border
      stripe>
      <el-table-column
        type="index"
        label="#">
      </el-table-column>
      <el-table-column
        prop="username"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话">
      </el-table-column>
      <el-table-column
        prop="role_name"
        label="角色">
      </el-table-column>
      <el-table-column
        label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            @change="userStateChange(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="180">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="editUserGet(scope.row.id)"></el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="confirmDelete(scope.row.id)"></el-button>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
            <el-button size="mini" type="warning" icon="el-icon-setting"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>

    </el-table>

    <!-- pages -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="requestUser.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="requestUser.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!-- add user dialog -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="60%"
      @close="addUserClose">
    <el-form :model="addUserForm" :rules="addUserRules" ref="addUserRef" label-width="100px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="addUserForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="addUserForm.password"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="addUserForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="addUserForm.mobile"></el-input>
      </el-form-item>
    </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户信息对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editUserVisible"
      width="50%"
      @close="editUserClose">
      <el-form ref="editUserRef" :model="editUserForm" :rules="editUserRules" label-width="80px">
        <el-form-item label="用户名称">
          <el-input v-model="editUserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserRequest">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Users',
  data() {
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
      if (regEmail.test(value)) {
        return callback();
      } 
      callback(new Error('请输入正确的邮箱地址'));
    }
    var checkMobile = (rule, value, callback) => {
      const regMobile =  /^1[34578]\d{9}$/
      if (regMobile.test(value)) {
        return callback();
      } 
      return callback(new Error('请输入正确的手机号'));
    }
    return {
      requestUser: {
        'query': '',
        'pagenum': 1,
        'pagesize': 5
      },
      userInfo: [],
      total: 0,
      dialogVisible: false,
      editUserVisible: false,
      addUserForm: {
        'username': '',
        'password': '',
        'email': '',
        'mobile': '',
      },
      editUserForm: {
        'username': '',
        'email': '',
        'mobile': '',
      },
      addUserRules: {
        username: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { required: true, validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { required: true, validator: checkMobile, trigger: 'blur' },
        ],
      },
      editUserRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { required: true, validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { required: true, validator: checkMobile, trigger: 'blur' },
        ],
      },

    }
  },
  created() {
    this.getUserData()
  },
  methods: {
    async getUserData() {
      const {data : res} = await this.$http.get('users', {params: this.requestUser})
      if(res.meta.status !== 200) this.$message.error('获取用户数据失败！')
      this.userInfo = res.data.users
      this.total = res.data.total
      console.log(res);
    },
    handleSizeChange(pageqnt) {
      this.requestUser.pagesize = pageqnt
      this.getUserData()
    },
    handleCurrentChange(n) {
      this.requestUser.pagenum = n
      this.getUserData()
    },
    async userStateChange(e) {
      const {data: res} = await this.$http.put(`users/${e.id}/state/${e.mg_state}`)
      if(res.meta.status !== 200) {
        this.$message.error('修改用户状态失败')
        e.mg_state = !e.mg_state
      }
      if(res.meta.status === 200) {
        this.$message.success('修改用户状态成功')
      }
    },
    searchUser() {
      this.getUserData()
    },
    addUserClose() {
      this.$refs.addUserRef.resetFields()
    },
    editUserClose() {
      this.$refs.editUserRef.resetFields()
    },
    /* 提交添加用户表单请求 */
    addUser() {
      this.$refs.addUserRef.validate(async (vaild) => {
        if(!vaild) {
          this.$message.error('请正确输入')
        }
        //发起添加用户的网络请求
        const {data: res} = await this.$http.post('users',this.addUserForm)
        if(res.meta.status !== 201) return this.$message.error('添加用户失败')
        this.$message.success('添加用户成功')
        this.dialogVisible = false
        this.getUserData()
      })
    },
    async editUserGet(id) {
      this.editUserVisible = true
      const {data: res} = await this.$http.get(`users/${id}`)
      if(res.meta.status !== 200) {
        return this.$message.error('failed to get current userinfo')
      }
      this.editUserForm.email = res.data.email
      this.editUserForm.mobile = res.data.mobile
      this.editUserForm.username = res.data.username
      this.editUserForm.id = id
    },
    editUserRequest() {
      this.$refs.editUserRef.validate(async (vaild) => {
        if(!vaild) {
          return this.$message.error('信息格式有误，修改信息失败')
        }
        const {data: res} = await this.$http.put(`users/${this.editUserForm.id}`,{
          'id': this.editUserForm.id,
          'email': this.editUserForm.email,
          'mobile': this.editUserForm.mobile,
        })
        if(res.meta.status !== 200) return this.$message.error('修改信息失败')
        this.getUserData()
        this.editUserVisible = false
        this.$message.success('修改信息成功')
      })
    },
    /* 确认是否真的删除 */
    async confirmDelete(id) {
      const deleteChoice = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(e => e)
      if(deleteChoice === 'cancel') return this.$message('取消删除操作')
      if(deleteChoice === 'confirm') {
        const {data: res} = await this.$http.delete('users/'+ id)
        if(res.meta.status !== 200) return this.$message.error('删除失败')
        this.getUserData()
        return this.$message.success('删除成功')
      }
    }
  },

}
</script>

<style lang="less" scoped>

</style>