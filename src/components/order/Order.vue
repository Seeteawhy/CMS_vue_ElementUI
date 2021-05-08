<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 表格内容 -->
      <el-table
        :data="orderList"
        style="width: 100%"
        border
        stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="100px"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款" width="100px">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.pay_status === '0'" >未付款</el-tag>
            <el-tag type="succe" v-else >已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="100px"></el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="200px">
          <template slot-scope="scope">
            {{scope.row.create_time | dataFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template >
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="areaDialogVisible = true"></el-button>
            <el-button type="success" icon="el-icon-location" size="mini" @click="showLogisticDialog"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    
    <!-- 省市选择对话框 -->
    <el-dialog
      title="地区："
      :visible.sync="areaDialogVisible"
      width="50%"
      @close="areaDialogClosed">
      <el-form :model="areaForm" :rules="areaRules" ref="areaRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="省市区" prop="area1">
        <el-cascader
          v-model="areaValue"
          :options="regionDataPlus"
          @change="areaHandleChange"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="area2">
          <el-input v-model="areaForm.area2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="areaDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="areaDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 物理信息对话框 -->
    <el-dialog
      title="物流信息："
      :visible.sync="logisticDialogVisible"
      width="50%"
      @close="logisticDialogClosed">
      <el-timeline >
        <el-timeline-item
          v-for="(activity, index) in logisticData"
          :key="index"
          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import {regionDataPlus} from 'element-china-area-data'
import logisticInfo from '../../assets/fakeData'
export default {
  name: 'Order',
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      orderList: [],
      total: 0,
      areaDialogVisible: false,
      regionDataPlus,
      areaForm: {
        area1: '',
        area2: '',
      },
      areaRules: {
        area1:[
          { required: true, message: '请选择地区', trigger: 'blur' },
        ],
        area2:[
          { required: true, message: '请输入地址', trigger: 'blur' },
        ],
      },
      areaValue: '',
      logisticDialogVisible: false,
      logisticData: logisticInfo.data
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      const {data: res} = await this.$http.get(`orders`, {params: this.queryInfo })
      if(res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.orderList = res.data.goods
      this.total = res.data.total
      console.log(this.orderList);
    },
    //page
    handleSizeChange(size) {
      this.queryInfo.pagesize = size
      this.getOrderList()
    },
    handleCurrentChange(page) {
      this.queryInfo.pagenum = page
      this.getOrderList()
    },
    //area cascader
    areaHandleChange() {
      console.log(this.areaValue);
    },
    //area dialog
    areaDialogClosed() {
      this.$refs.areaRef.resetFields()
    },
    //logistic progress 
    logisticDialogClosed() {},
    showLogisticDialog() {
      //const {data: res} = await this.$http.get(`/kuaidi/1106975712662`)
      //if(res.meta.status !== 200) {
      //  return this.$message.error('获取物流信息失败')
      //}
      //this.logisticInfo = res.data
      console.log(this.logisticData);
      this.logisticDialogVisible = true
    }
  }
}
</script>

<style lang="less" scoped>

</style>