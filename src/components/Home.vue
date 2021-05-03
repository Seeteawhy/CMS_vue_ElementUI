<template>
  <el-container class="home-container">
    <el-header>
      <div class="header-left">
        <img src="../assets/image/avat.jpeg" alt="">
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse? '64px' : '200px'">
        <div class="toggleAside" @click="collapseMenu">|||</div>
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#bdc3c7"
          text-color="#000"
          active-text-color="#ffffff"
          unique-opened
          :collapse-transition="false"
          :collapse="isCollapse"
          router
          :default-active="activeIndex">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item 
              :index="'/' + subItem.path" 
              v-for="subItem in item.children" 
              :key="subItem.id"
              @click="saveActiveIndex('/' + subItem.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name:'Home',
/*   components: {
    name:'Welcome'
  }, */
  data() {
    return {
      menuList: {},
      iconObj: {
        '125': 'el-icon-user-solid',
        '103': 'el-icon-s-tools',
        '101': 'el-icon-s-goods',
        '102': 'el-icon-s-claim',
        '145': 'el-icon-s-data',
      },
      isCollapse: false,
      activeIndex:''
    }
  },
  created() {
    this.getMenuList()
    this.activeIndex = window.sessionStorage.getItem('activeIndex')
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    /* 获取菜单数据 */
    async getMenuList() {
      const {data: res} = await this.$http.get('menus')
      if(res.meta.status !== 200) return this.$message.error('获取菜单失败')
      this.menuList = res.data
    },
    collapseMenu() {
      this.isCollapse = !this.isCollapse
    },
    saveActiveIndex(str) {
      window.sessionStorage.setItem('activeIndex', str)
      this.activeIndex = str
    }
  }
}
</script>

<style lang="less" scoped>
  .home-container {
    height: 100%;
  }

  .el-header {
    display: flex;

    justify-content: space-between;
    align-items: center;
    background-color: #7f8c8d;

    .header-left {
      display: flex;
      justify-content: left;
      align-items: center;
      img {
        height: 55px;
        width: 55px;
        border-radius: 50%;
      }
      span {
        padding-left: 10px;
        font-size: 20px;
      }
    }
  }

  .el-aside {
    background-color:#bdc3c7;
    transition: all 0.5s;
    .toggleAside {
      width: 100%;
      height: 20px;
      text-align: center;
      letter-spacing: 0.2em;
      color: #fff;
      background-color: #909399;
      overflow: hidden;
    }
    .el-menu {
      border-right: none;
    }
  }

  .el-main {
    background-color: #ecf0f1;
  }
</style>>
