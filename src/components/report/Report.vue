<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- card view -->
    <el-card>
      <div id="myChart" :style="{ width: '800px', height: '400px' }"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from "echarts";
import _ from 'lodash'
export default {
  name: "Report",
  data() {
    return {
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },
    };
  },
  async mounted() {
    const { data: res } = await this.$http.get(`reports/type/1`);
    if (res.meta.status !== 200) {
      return this.$message.error("获取数据失败");
    }
    let myChart = echarts.init(document.getElementById("myChart"));
    let result = _.merge(this.options, res.data)
    myChart.setOption(result);
  },
};
</script>

<style lang="less" scoped>
</style>  