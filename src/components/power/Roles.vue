<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    
    <el-card>
      <el-button type="primary" @click="addRoleVisible = true">添加角色</el-button>
      <el-table
        :data="rolesList"
        style="width: 100%"
        border
        stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :gutter="20" :class="['bderbtm', i1 === 0 ? 'bdertop': '','vcenter']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="deleteRightsById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row v-for="(item2, i2) in item1.children" :key="item2.id" :class="[i2 !== 0 ? 'bdertop': '', 'vcenter']">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="deleteRightsById(scope.row, item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag v-for="(item3, i3) in item2.children" :key="item3.id" :class="[i3 !== 0 ? 'bdertop': '']" type="warning" closable
                      @close="deleteRightsById(scope.row, item3.id)">
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>

        <!-- 角色表格 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" ></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" ></el-table-column>
        <el-table-column prop="level" label="操作" width="290px" >
          <template slot-scope="scope" >
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="editRolePrepare(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="confirmDelete(scope.row)">删除</el-button>
            <el-button type="warning" size="mini" icon="el-icon-setting" @click="setRights(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 增加角色对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="addRoleVisible"
      width="50%">
      <el-form :model="addRoleForm" :rules="addRoleRules" ref="addRoleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleRequest">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="editRoleVisible"
      width="50%">
      <el-form :model="editRoleForm" :rules="editRoleRules" ref="editRoleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleRequest">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="setRightsVisible"
      width="50%">
      <el-tree 
        :data="rightsList" 
        :props="treeProps" 
        show-checkbox 
        default-expand-all 
        node-key="id" 
        :default-checked-keys="setRightsArray"
        ref="rightsTreeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightsVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRightsRequest">确 定</el-button>
      </span>
    </el-dialog>

  </div>

  
</template>

<script>
export default {
  name:'Roles',
  data() {
    return {
      rolesList:[],
      setRightsVisible: false,
      addRoleVisible: false,
      editRoleVisible: false,
      rightsList: [],
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      setRightsArray: [],
      roleId: null,
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      editRoleForm: {},
      addRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
        ],
      },
      editRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
        ],
      },
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const {data: res} = await this.$http.get('roles')
      if(res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.rolesList = res.data
      //console.log(this.rolesList);
    },
    async deleteRightsById(role, rightid) {
      const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(e => e)
      if(confirmResult === 'cancel') return this.$message.info('取消删除')
      if(confirmResult === 'confirm') {
        const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightid}`)
        if(res.meta.status !== 200) {
          return this.$message.error('删除失败')
        }
        role.children = res.data
        this.$message.success('删除权限成功')
      }
    },
    async setRights(node) {
      this.roleId = node.id
      const {data: res} = await this.$http.get('rights/tree')
      if(res.meta.status !== 200) return this.$message.error('获取权限树列表失败')
      this.rightsList = res.data
      this.setRightsArray = []
      this.recursionSetRights(node, this.setRightsArray)
      this.setRightsVisible = true
    },
    //递归获取分配权限中已有id
    recursionSetRights(node, array) {
      if(!node.children) {
        return array.push(node.id)
      }
      node.children.forEach(item => {
        this.recursionSetRights(item, array)
      })
    },
    async setRightsRequest() {
      const ridsArray = [...this.$refs.rightsTreeRef.getCheckedKeys(), ...this.$refs.rightsTreeRef.getHalfCheckedKeys()]
      let rids = ridsArray.join(',')
      const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`, {rids: rids})
      if(res.meta.status !== 200) return this.$message.error('分配权限失败')
      this.$message.success('分配权限成功')
      this.getRolesList()
      this.setRightsVisible = false
    },
    async addRoleRequest() {
      const {data: res} = await this.$http.post(`roles`, {roleName: this.addRoleForm.roleName, roleDesc: this.addRoleForm.roleDesc})
      if(res.meta.status !== 201) return this.$message.error('增加角色失败')
      this.$message.success('增加角色成功')
      this.getRolesList()
      this.addRoleVisible = false
    },
    //编辑角色：读取当前角色现有属性，渲染到对话框
    async editRolePrepare(role) {
      const {data: res} = await this.$http.get(`roles/${role.id}`)
      if(res.meta.status !== 200) return this.$message.error('读取角色失败')
      this.editRoleForm = res.data
      this.$message.success('读取角色成功')
      this.editRoleVisible = true
    },
    //提交编辑角色请求
    async editRoleRequest() {
      const {data: res} = await this.$http.put(`roles/${this.editRoleForm.roleId}`,{roleName: this.editRoleForm.roleName, roleDesc: this.editRoleForm.roleDesc})
      if(res.meta.status !== 200) return this.$message.error('编辑角色失败')
      this.getRolesList()
      this.$message.success('编辑角色成功')
      this.editRoleVisible = false
    },
        /* 确认是否真的删除 */
    async confirmDelete(role) {
      const deleteChoice = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(e => e)
      if(deleteChoice === 'cancel') return this.$message('取消删除操作')
      if(deleteChoice === 'confirm') {
        const {data: res} = await this.$http.delete('roles/'+ role.id)
        if(res.meta.status !== 200) return this.$message.error('删除失败')
        this.getRolesList()
        return this.$message.success('删除成功')
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .el-tag {
    margin: 7px;
  }

  .bdertop {
    border-top: 1px solid #eee;
  }

  .bderbtm {
    border-bottom: 1px solid #eee;
  }

  .vcenter {
    display: flex;
    align-items: center;
  }
</style>