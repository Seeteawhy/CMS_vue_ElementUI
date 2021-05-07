<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert
        title="警告：只允许为第三级分类设置参数"
        type="warning"
        :closable="false"
        show-icon=""
      ></el-alert>

      <!-- 选择商品分类 -->
      <el-row class="cate-choice">
        <el-col>
          <span>选择商品分类: </span>
          <el-cascader
            v-model="selectedCate"
            :options="catelist"
            :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name',
              children: 'children',
            }"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tab 区域 -->
      <el-tabs v-model="tabActiveName" @tab-click="handleTabClick">
        <!-- 动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button :disabled="isdisabled" size="mini" type="primary" @click="addParamsVisible = true">添加参数</el-button>
          <!-- 数据表格 -->
          <el-table :data="manyTableData" style="width: 100%" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag closable v-for="(item,idx) in scope.row.attr_vals" :key="idx" @close="deleteTags(idx, scope.row)">{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button @click="showParams(scope.row.attr_id)" icon="el-icon-edit" size="mini" type="primary">编辑</el-button>
                <el-button @click="deleteParams(scope.row.attr_id)" icon="el-icon-delete" size="mini" type="danger">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button :disabled="isdisabled" size="mini" type="primary" @click="addParamsVisible = true">添加属性</el-button>
          <!-- 数据表格 -->
          <el-table :data="onlyTableData" style="width: 100%" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag closable v-for="(item,idx) in scope.row.attr_vals" :key="idx" @close="deleteTags(idx, scope.row)">{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button @click="showParams(scope.row.attr_id)" icon="el-icon-edit" size="mini" type="primary">编辑</el-button>
                <el-button @click="deleteParams(scope.row.attr_id)" icon="el-icon-delete" size="mini" type="danger">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加属性和参数的对话框 -->
    <el-dialog
      :title="'添加' + showTitle"
      :visible.sync="addParamsVisible"
      width="50%"
      @close="addParamsClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="showTitle" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParamsRequest">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改属性和参数的对话框 -->
    <el-dialog
      :title="'修改' + showTitle"
      :visible.sync="editParamsVisible"
      width="50%"
      @close="editParamsClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="showTitle" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParamsRequest">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "Params",
  data() {
    return {
      catelist: [],
      selectedCate: [],
      tabActiveName: "many",
      manyTableData: [],
      onlyTableData: [],
      addParamsVisible: false,
      addForm: {},
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      editParamsVisible: false,
      editForm: {},
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },


    };
  },
  computed: {
    isdisabled() {
      return this.selectedCate.length === 3 ? false : true;
    },
    cateId() {
      return this.selectedCate.length === 3 ? this.selectedCate[2] : null;
    },
    showTitle() {
      return this.tabActiveName === "many" ? '动态参数': '静态属性'
    }
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get(`categories`);
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败");
      }
      this.catelist = res.data;
      //console.log(this.catelist);
      return this.$message.success("获取商品分类成功");
    },
    //选择好了分类
    handleChange() {
      this.getParamsData();
    },
    //处理被激活的tab
    handleTabClick() {
      console.log(this.tabActiveName);
      this.getParamsData();
    },
    //获取动态&静态参数数据
    async getParamsData() {
      if (this.selectedCate.length !== 3) {
        this.selectedCate = [];
        this.manyTableData = []
        this.onlyTableData = []
        return;
      }
      //是三级分类，进行数据请求
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.tabActiveName },
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取失败");
      }
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        //让每行数据都带上动态编辑标签的inputValue，以防同时编辑
        item.inputValue = ''
        item.inputVisible = false
      });
      console.log(res.data);
      if (this.tabActiveName === "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },
    addParamsClosed() {
      this.$refs.addFormRef.resetFields()
    },
    async addParamsRequest() {
      this.$refs.addFormRef.validate(async vaild => {
        if (!vaild) return
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`, 
          { attr_name: this.addForm.attr_name, attr_sel: this.tabActiveName},
        );
        if (res.meta.status !== 201) {
          return this.$message.error("添加失败");
        }
        this.getParamsData()
        this.addParamsVisible = false
        return this.$message.success("添加成功");
      })
    },
    editParamsClosed() {
      this.$refs.editFormRef.resetFields()
    },
    async showParams(attr_id) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id}`, 
        { params: {
          attr_sel: this.tabActiveName
        }},
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取失败");
      }
      this.editForm = res.data
      this.editParamsVisible = true
    },
    async editParamsRequest() {
      this.$refs.editFormRef.validate(async vaild => {
        if (!vaild) return
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`, 
          { attr_name: this.editForm.attr_name, attr_sel: this.tabActiveName},
        );
        if (res.meta.status !== 200) {
          return this.$message.error("修改失败");
        }
        this.getParamsData()
        this.editParamsVisible = false
        return this.$message.success("修改成功");
      })
    },

    async deleteParams(attr_id) {
      const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(e => e)
      if(confirmResult === 'cancel') return this.$message('取消删除')
      if(confirmResult === 'confirm') {
        const {data: res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
        if(res.meta.status !== 200) {
          return this.$message.error('删除失败')
        }
        this.$message.success('删除成功')
        this.getParamsData()
      }
    },
    async handleInputConfirm(row) {
      if(row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue)
      row.inputValue = ''
      row.inputVisible = false
      //发送添加标签的网络请求
      this.saveAttrvals(row)
    },
    showInput(item) {
      item.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    async saveAttrvals(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`, 
        { attr_name: row.attr_name, 
          attr_sel: row.attr_sel, 
          attr_vals: row.attr_vals.join(' ')},
      );
      if (res.meta.status !== 200) {
        return this.$message.error("编辑标签失败");
      }
      return this.$message.success("编辑标签成功");
    },
    deleteTags(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrvals(row)
    }
  },
};
</script>

<style lang="less" scoped>
.cate-choice {
  margin-top: 15px;
  font-size: 18px;
}

.el-tag {
  margin-right: 10px;
}
.input-new-tag  {
  width: 140px;
}
</style>