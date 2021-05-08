<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 提示消息 -->
      <el-alert title="添加商品信息" type="info" show-icon :closable="false" center=""></el-alert>

      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- 表单包一个tab -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
        <el-tabs tab-position="left"  v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabClicked">
          <!-- 第一步 基本信息 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="{ expandTrigger: 'hover', label: 'cat_name', value: 'cat_id', children: 'children' }"
                @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- 第二步 渲染动态属性标签 -->
          <el-tab-pane label="商品参数" name="1">
            <el-form-item v-for="(item) in manyTableData" :label="item.attr_name" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 第三步 渲染静态参数input -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id" >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 第四步 上传图片区域 -->
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="uploadHeader"
              :on-success="UploadSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <!-- 第五步 富文本编辑器 -->
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce">
            </quill-editor>
            <el-button @click="add" type="primary" class="addBtn">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'Add',
  data() {
    return {
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          {  required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' },
        ],
      },
      catelist: [],
      manyTableData: [],
      onlyTableData: [],
      uploadURL: 'http://www.ysqorz.top:8888/api/private/v1/upload',
      uploadHeader: {
        authorization: window.sessionStorage.getItem('token')
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const {data: res} = await this.$http.get(`categories`)
      if(res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.catelist = res.data
    },
    handleChange() {
      if(this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    beforeTabLeave(activeName, oldActiveName) {
      if(oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.warning('请选择三级分类')
        return false
      }
    },
    async tabClicked(e) {
      if(e.name === '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.addForm.goods_cat[2]}/attributes`,
          {
            params: { sel: 'many' },
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取失败");
        }
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        })
        this.manyTableData = res.data
        console.log(this.manyTableData);
      }else if (e.name === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.addForm.goods_cat[2]}/attributes`,
          {
            params: { sel: 'only' },
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取失败");
        }
/*         res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        }) */
        this.onlyTableData = res.data
        console.log(this.onlyTableData);
      }
    },
    handlePreview(file) {
      console.log(file);
    },
    handleRemove(file) {
      const filePath = file.response.data.tmp_path
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      this.addForm.pics.splice(i, 1)
    },
    UploadSuccess(response) {
      const picInfo = { pic: response.data.tmp_path}
      this.addForm.pics.push(picInfo)
    },
    add() {
      this.$refs.addFormRef.validate( async (valid) => {
        if(!valid) {
          return this.$message.error('请填写必填的表单项')
        }
      //整理addForm 1.把goods_cat变成逗号分割的字符串 2.将many和only遍历进attrs数组attr_id attr_value
      //用lodash 深拷贝addform
      const form = _.cloneDeep(this.addForm)
      form.goods_cat = form.goods_cat.join(',')
      this.manyTableData.forEach(item => {
        const newattr = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals.join(' ')
        }
        form.attrs.push(newattr)
      })
      this.onlyTableData.forEach(item => {
        const newattr = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals
        }
        form.attrs.push(newattr)
      })
      console.log(form);
      const {data: res} = await this.$http.post(`goods`, form)
      if(res.meta.status !== 201) {
        return this.$message.error('创建商品失败')
      }
      console.log(res);
      this.$message.success('创建商品成功')
      this.$router.push('/goods')
      })
    }
  },
}
</script>

<style lang="less" scoped>
.el-step .is-horizontal .el-step__line {
  top: 14px !important
}

.el-checkbox {
  margin: 0 5px 0 0 !important
}
.addBtn {
  margin-top: 10px;
}

</style>