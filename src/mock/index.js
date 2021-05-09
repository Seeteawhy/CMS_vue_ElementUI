import Mock from "mockjs"

Mock.mock('http://www.ysqorz.top:8888/api/private/v1/home/getData', 'get', {
  status: 200,
  message: '获取主页数据成功',
  data: [
    {
      name: "电脑办公",
      todayBuy: 234521,
      monthBuy: 4562411,
      totalBuy: 94586096,
    },
    {
      name: "个护清洁",
      todayBuy: 223131,
      monthBuy: 3231233,
      totalBuy: 121121094,
    },
    {
      name: "食品生鲜",
      todayBuy: 193131,
      monthBuy: 4231231,
      totalBuy: 211421098,
    },
    {
      name: "手机数码",
      todayBuy: 331312,
      monthBuy: 9231231,
      totalBuy: 612341154,
    },
    {
      name: "服饰箱包",
      todayBuy: 283131,
      monthBuy: 7283123,
      totalBuy: 123421144,
    },
  ]
})