<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avater_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <!-- login form area -->
      <el-form class="formbody" :model="loginForm" :rules="loginRules" ref="loginFormRef">
        <!-- account -->
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-zhanghao" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!-- password -->
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-mima" v-model="loginForm.password" type="password" show-password></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="commitLoginForm">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name:'Login',
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456"
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    commitLoginForm() {
      this.$refs.loginFormRef.validate(async val => {
        if(!val) return;
        const {data: res} = await this.$http.post('login', this.loginForm)
        if(res.meta.status === 200) {
          this.$message.success('登录成功')
          window.sessionStorage.setItem('token',res.data.token)
          this.$router.push('/home')
        } else {
          this.$message.error('登录失败')
        }
      })
    },

  }
}
</script>

<style lang="less" scoped>
  .login_container {
    height: 100%;
    background-color: #2b4b6b;
  }

  .login_box {
    position: absolute;
    width: 450px;
    height: 300px;
    top: 50%;
    left: 50%;
    border-radius: 5px;
    background-color: #fff;
    transform: translate(-50%,-50%);

    .avater_box {
      position: absolute;
      left: 50%;
      width: 100px;
      height: 100px;
      border: 2px solid #f5f5f5;
      padding: 6px;
      background-color: #fff;
      overflow: hidden;
      transform: translate(-50%,-50%);
      border-radius: 50%;
      box-shadow: 0 0 5px #767676;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }

    .formbody {
      position: absolute;
      height: 210px;
      left: 50%;
      bottom: 0;
      width: 85%;
      transform: translate(-50%,0)

      
    }

    .btns {
      display: flex;
      justify-content: space-evenly;
    }
  }
</style>