<template>
  <div id="building">
    <el-container>
      <div class="logo">
        <img src="../assets/imgs/henan.png" alt="">
      </div>
      <div class="main">
        <!-- 标题 -->
        <div class="login_title">
          <p>论文专利登记与奖励申报系统</p>
        </div>
        <!-- 登录框 -->
        <div class="login_main">
          <!-- 登录表单区域 -->
          <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
            <!-- 用户名 -->
            <el-form-item prop="loginName">
              <el-input v-model='loginForm.loginName' prefix-icon="el-icon-user-solid"></el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item prop="password">
              <el-input v-model='loginForm.password' prefix-icon="el-icon-lock" type="password"></el-input>
            </el-form-item>
            <!-- 按钮区域 -->
            <el-form-item class="btns">
              <el-button type="info" @click="resetLoginFrom">重置</el-button>
              <el-button type="primary" @click="login">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <!-- 所有者标识   -->
      <div class="bottomowner">
        <img src="@/assets/imgs/owner.png" alt="">
      </div>
    </el-container>
  </div>
</template>

<script>
import Cookies from 'js-cookie'

export default {
  data() {
    return {
      //登录表单验证数据
      loginForm: {
        loginName: '',
        password: ''
      },
      //表单验证规则
      loginFormRules: {
        username: [
          { required: true, massage: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3到10个字符之间', trigger: 'blur' }
        ],

        password: [
          { required: true, massage: '请输入密码', trigger: 'blur' },
          { min: 5, max: 15, message: '长度在6到15个字符之间', trigger: 'blur' }
        ]
      }

    }
  },
  methods: {
    //重置函数
    resetLoginFrom() {
      this.$refs.loginFormRef.resetFields()
    },
    //登录
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        //从接口校验用户
        const { data: ref } = await this.$http.post('login', this.loginForm).catch((err) => { })
        console.log(ref)
        //判断是否对接成功
        if (ref.code !== 200) {
          return this.$message.error('登录失败！')
        }

        this.$message.success('登录成功！')
        //记录当前用户的token
        window.sessionStorage.setItem('token', ref.data.token)
        //记录用户名
        Cookies.set('name', this.loginForm.loginName)
        //console.log(token)
        //跳转,push抛异常
        this.$router.push('/home').catch((err) => { })
      })
    }
  }

}
</script>

<style lang="less" scoped>
@import '@/assets/css/login.less';

#building {
  background: url("../assets/imgs/background.png");
  width: 100%;
  height: 100%;
  position: relative;
  background-size: 100% 100%;
  background-size: cover;
}

.login_main {
  margin-top: 34px;
  height: 272px;
  width: 500px;
  border-radius: 8px;
  background-color: #ffffff;
  background-image: url(../assets/imgs/input.png);
}
</style>