<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-table
        class="tree-table"
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        border>
        <!-- 第二列有效无效插槽 -->
        <template slot="isok" slot-scope="scope">
          <i v-if="scope.row.cat_deleted === false" class="el-icon-success" style="color: lightgreen"></i>
          <i v-else class="el-icon-error" style="color: red"></i>
        </template>
        <!-- 第三列级数插槽 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" size="mini" type="success">二级</el-tag>
          <el-tag v-else size="mini" type="warning">三级</el-tag>
        </template>
        <!-- 第四列操作插槽 -->
        <template slot="opt" slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="editCatePrepare(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteCate(scope.row)">删除</el-button>
        </template>
      </tree-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="getCateParams.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="getCateParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed">
      <!-- 添加分类表单 -->
      <el-form :model="addCateForm" :rules="addCateRules" label-width="100px" class="demo-ruleForm" ref="addCateDialogRef">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="{ expandTrigger: 'hover', value: 'cat_id', label: 'cat_name', children:'children', checkStrictly: true}"
            @change="parentCateChange"
            clearable>
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateRequest">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改分类对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="editCateDialogVisible"
      width="50%"
      @close="editCateDialogClosed">
      <el-form :model="editCateForm" :rules="editCateRules" label-width="100px" class="demo-ruleForm" ref="editCateDialogRef">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateRequest">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'Cate',
  data() {
    return {
      //get请求参数
      getCateParams: {
        type: 3,
        pagenum: 1,
        pagesize:5
      },
      //所有商品分类数据
      catelist: [],
      //总数据条数
      total: 0,
      columns:[
        { label: '分类名称 ', prop: 'cat_name'},
        { label: '是否有效 ', type: 'template', template: 'isok'},
        { label: '排序 ', type: 'template', template: 'order'},
        { label: '操作 ', type: 'template', template: 'opt'},
      ],
      addCateDialogVisible: false,
      editCateDialogVisible: false,
      //添加分类表单
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addCateRules: {
        cat_name:[
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ]
      },
      parentCateList: [],
      selectedKeys: [],
      //编辑分类表单名字
      editCateForm: {
        cat_name: '',
      },
      editCateRules: {
        cat_name:[
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ]
      },
      editId: null,
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const {data: res} = await this.$http.get(`categories`, {params: this.getCateParams})
      if(res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.catelist = res.data.result
      this.total = res.data.total
      return this.$message.success('获取商品分类成功')
    },
    //页码大小改变
    handleSizeChange(n) {
      this.getCateParams.pagesize = n
      this.getCateList()
    },
    //页数改变
    handleCurrentChange(e) {
      this.getCateParams.pagenum = e
      this.getCateList()
    },
    //点击添加分类按钮，请求父级分类数据  
    async addCateDialog() {
      this.addCateDialogVisible = true
      const {data: res} = await this.$http.get(`categories`, {params: {type: 2} })
      if(res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败')
      }
      this.parentCateList = res.data
      console.log(this.parentCateList);
      this.$message.success('获取父级分类数据成功')
    },
    parentCateChange() {
      console.log(this.selectedKeys)
      //选了1／2项，父id为数组最后一项的val，层级为数组长度
      if(this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
      console.log(this.addCateForm);
    },
    //添加分类请求
    async addCateRequest() {
      const {data: res} = await this.$http.post(`categories`, this.addCateForm )
      if(res.meta.status !== 201) {
        return this.$message.error('创建分类失败')
      }
      this.$message.success('创建分类成功')
      this.getCateList()
      this.addCateDialogVisible = false
    },
    //退出添加分类时，重置表单
    addCateDialogClosed() {
      this.$refs.addCateDialogRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    //找到该行的元素，以及他的分类名称
    editCatePrepare(cate) {
      console.log(cate);
      this.editId = cate.cat_id
      this.editCateDialogVisible = true
    },
    //edit
    editCateDialogClosed() {
      this.editCateDialogVisible = false
    },
    async editCateRequest() {
      this.editCateDialogVisible = true
      const {data: res} = await this.$http.put(`categories/${this.editId}`, {cat_name: this.editCateForm.cat_name} )
      if(res.meta.status !== 200) {
        return this.$message.error('编辑分类失败')
      }
      this.$message.success('编辑分类成功')
      this.editCateForm.cat_name = ''
      this.getCateList()
      this.editCateDialogVisible = false
    },
    //delete
    async deleteCate(cate) {
      const confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(e => e)
      console.log(confirmResult);
      if(confirmResult === 'cancel') return this.$message('取消删除')
      if(confirmResult === 'confirm') {
        const {data: res} = await this.$http.delete(`categories/${cate.cat_id}`)
        if(res.meta.status !== 200) {
          return this.$message.error('删除分类失败')
        }
        this.$message.success('删除分类成功')
        this.getCateList()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.tree-table {
  margin-top: 15px;
}
</style>