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
      <!-- 搜索框 和 添加商品区域 -->
      <el-row :gutter="20">
        <el-col :span="8" >
          <el-input clearable @clear="getGoodsList" placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select">
            <el-button 
              slot="append" 
              icon="el-icon-search" 
              @click="getGoodsList"
              ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAdd">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 商品表格区域 -->
      <el-table :data="goodslist" style="width: 100%" border stripe>
        <el-table-column type="expand"></el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格" width="90px"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="85px"></el-table-column>
        <el-table-column prop="upd_time" label="创建时间" width="120px">
          <template slot-scope="scope">
            {{scope.row.upd_time | dataFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit" size="mini" type="primary">编辑</el-button>
            <el-button icon="el-icon-delete" size="mini" type="danger" @click="deleteById(scope.row.goods_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background>
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'List',
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      goodslist: [],
      total: null,
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    //根据分页获取商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get(`goods`,
        { params: this.queryInfo});
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品失败");
      }
      this.goodslist = res.data.goods;
      this.total = res.data.total
      console.log(this.goodslist);
      return this.$message.success("获取商品成功");
    },
    //分页相关触发
    handleSizeChange(size) {
      this.queryInfo.pagesize = size
      this.getGoodsList()
    },
    handleCurrentChange(page) {
      this.queryInfo.pagenum = page
      this.getGoodsList()
    },
    //删除商品
    async deleteById(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(e => e)
      if(confirmResult === 'cancel') return this.$message('取消删除')
      if(confirmResult === 'confirm') {
        const {data: res} = await this.$http.delete(`goods/${id}`)
        if(res.meta.status !== 200) {
          return this.$message.error('删除失败')
        }
        this.$message.success('删除成功')
        this.getGoodsList()
      }
    },
    //跳转到添加商品页
    goAdd() {
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style lang="less" scoped>

</style>