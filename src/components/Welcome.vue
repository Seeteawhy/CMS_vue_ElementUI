<template>
  <el-row class="home" :gutter="20">
    <!--span默认一共是24，这里占8 下面占16，所以这两个分隔栏所占的宽度 是1:2-->
    <el-col :span="8" style="margin-top: 5px">
      <!--shadow属性设置卡片阴影出现的时机-->
      <el-card shadow="hover">
        <div class="user">
          <img :src="userImg" />
          <div class="userinfo">
            <p class="name">欢迎,Admin</p>
            <p class="access">超级管理员</p>
          </div>
        </div>
        <div class="login-info">
          <p>上次登录时间：<span>2021-5-09</span></p>
          <p>上次登录地点：<span>上海</span></p>
        </div>
      </el-card>
      <el-card style="height: 360px; margin-top: 20px">
        <el-table :data="tableData">
          <el-table-column
            show-overflow-tooltip
            v-for="(val, key) in tableLabel"
            :key="key"
            :prop="key"
            :label="val"
          ></el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <el-col :span="16" style="margin-top: 5px">
      <div class="num">
        <el-card
          shadow="hover"
          v-for="item in countData"
          :key="item.name"
          :body-style="{ display: 'flex', padding: 0 }"
        >
          <i
            class="icon"
            :class="`el-icon-${item.icon}`"
            :style="{ background: item.color }"
          ></i>
          <div class="detail">
            <p class="num">￥ {{ item.value }}</p>
            <p class="txt">{{ item.name }}</p>
          </div>
        </el-card>
      </div>
      <el-card shadow="hover" style="height: 533px" class="chart-container">
        <div id="main" :style="{ width: '700px', height: '530px' }" v-if="tableData" ></div>
      </el-card>
      <!-- <div class="graph">
        <el-card shadow="hover" style="height: 260px"> </el-card>
        <el-card shadow="hover" style="height: 260px"> </el-card>
      </div> -->
    </el-col>
  </el-row>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "Welcome",
  data() {
    return {
      userImg: require("../assets/image/avat.jpeg"),
      countData: [
        {
          name: "今日支付订单金额",
          value: 9527,
          icon: "success",
          color: "#2ec7c9",
        },
        {
          name: "今日收藏订单金额",
          value: 2125,
          icon: "star-on",
          color: "#ffb980",
        },
        {
          name: "今日未支付订单金额",
          value: 43960,
          icon: "s-goods",
          color: "#5ab1ef",
        },
        {
          name: "本月支付订单金额",
          value: 114151,
          icon: "success",
          color: "#2ec7c9",
        },
        {
          name: "本月收藏订单金额",
          value: 3154,
          icon: "star-on",
          color: "#ffb980",
        },
        {
          name: "本月未支付订单金额",
          value: 77777,
          icon: "s-goods",
          color: "#5ab1ef",
        },
      ],
      tableData: [],
      tableLabel: {
        name: "销售分类",
        todayBuy: "今日购买",
        monthBuy: "本月购买",
        totalBuy: "总购买",
      },
    };
  },
  methods: {
/*     async getTableData() {
      const { data: res } = await this.$http.get("/home/getData");
      this.tableData = res.data;
      console.log(this.tableData,'await');
    }, */
  },
  created() {
    /* this.getTableData(); */
  },
  async mounted() {
    const { data: res } = await this.$http.get("/home/getData");
    this.tableData = res.data;

    console.log(this.tableData,'mounted');
    var chartDom = document.getElementById("main");
    var myChart = echarts.init(chartDom);
    var option;

    option = {
      legend: {
        top: "35%",
        right: "right",
      },
      tooltip: {
        trigger: "item",
      },
      title: {
        text: "今日销售分类占比",
      },
      series: [
        {
          name: "面积模式",
          type: "pie",
          labelLine: {
            show: false,
          },
          label: {
            show: false,
            position: "right",
          },
          radius: [50, 250],
          center: ["50%", "50%"],
          roseType: "area",
          itemStyle: {
            borderRadius: 8,
          },
          data: [
            { value: this.tableData[0].todayBuy, name: this.tableData[0].name },
            { value: this.tableData[1].todayBuy, name: this.tableData[1].name },
            { value: this.tableData[2].todayBuy, name: this.tableData[2].name },
            { value: this.tableData[3].todayBuy, name: this.tableData[3].name },
            { value: this.tableData[4].todayBuy, name: this.tableData[4].name },
          ],
        },
      ],
    };

    option && myChart.setOption(option);
  },
};
</script>

<style lang="less" scoped>
.home {
  .user {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #ccc;
    img {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      margin-right: 40px;
    }
    &info {
      .name {
        font-size: 32px;
        margin-bottom: 10px;
      }
      .access {
        color: #999999;
      }
    }
  }
  .login-info {
    p {
      line-height: 28px;
      font-size: 14px;
      color: #999999;
      span {
        color: #666666;
        margin-left: 60px;
      }
    }
  }
  .num {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: 0;
    .el-card {
      width: 32%;
      margin-bottom: 20px;
    }
    .icon {
      font-size: 30px;
      width: 80px;
      height: 80px;
      text-align: center;
      line-height: 80px;
      color: #fff;
    }
    .detail {
      margin-left: 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 80px;
      box-sizing: border-box;
      .num {
        margin-top: 6px;
        font-size: 30px;
      }
      .txt {
        margin-top: 0;
        font-size: 14px;
        text-align: center;
        color: #999999;
      }
    }
  }
  .graph {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    .el-card {
      width: 48%;
    }
  }
}

.chart-container {
  position: flex;
  justify-content: center;
  align-items: center;
}
</style>
