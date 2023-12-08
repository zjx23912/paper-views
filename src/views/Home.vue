<template>
  <el-container class="home-container">
    <el-header>
      <div class="homelogo">
        <img src="../assets/imgs/homeLogo.png" alt="">
      </div>
      <div class="admin">
        <div class="admintext">
          <div class="adminword">
            <el-button @click="logout">{{ showUsername }}</el-button>
          </div>
          <div class="adminphoto">
            <img src="../assets/imgs/jiantou.png" alt="">
          </div>
        </div>
        <div>
          <img src="../assets/imgs/admin.png" alt="">
        </div>
      </div>
    </el-header>
    <el-container>
      <el-aside width="256px">
        <!-- 侧边栏菜单区域 -->
        <el-menu background-color="#084aa0" text-color="#fff" active-text-color="#409EFF" router
          :default-active="activePath">
          <!-- saveNavState切换活跃状态 -->

          <!-- 二级菜单 -->
          <el-menu-item :index="'/paper'" @click="saveNavState('/paper')">
            <template slot="title">
              <i :class="'iconfont icon-a-huaban1fuben'"></i>
              <span>论文管理</span>
            </template>
          </el-menu-item>

          <!-- 二级菜单 -->
          <el-menu-item :index="'/patent'" @click="saveNavState('/patent')">
            <template slot="title">
              <i :class="'iconfont icon-a-huaban1fuben2'"></i>
              <span>专利管理</span>
            </template>
          </el-menu-item>

          <!-- 二级菜单 -->
          <el-menu-item :index="'/work'" @click="saveNavState('/work')">
            <template slot="title">
              <i :class="'iconfont icon-a-huaban1fuben5'"></i>
              <span>著作成果信息统计</span>
            </template>
          </el-menu-item>
          <!-- </el-submenu> -->

          <!-- 二级菜单 -->
          <el-menu-item :index="'/verticals'" @click="saveNavState('/verticals')">
            <template slot="title">
              <i :class="'iconfont icon-a-huaban1fuben5'"></i>
              <span>纵向项目信息统计</span>
            </template>
          </el-menu-item>

          <!-- 二级菜单 -->
          <el-menu-item :index="'/horizontals'" @click="saveNavState('/horizontals')">
            <template slot="title">
              <i :class="'iconfont icon-a-huaban1fuben5'"></i>
              <span>横向项目信息统计</span>
            </template>
          </el-menu-item>

          <!-- 二级菜单 -->
          <el-menu-item :index="'/members'" @click="saveNavState('/members')">
            <template slot="title">
              <i :class="'iconfont icon-a-huaban1fuben5'"></i>
              <span>参研人员</span>
            </template>
          </el-menu-item>

          <!-- 二级菜单 -->
          <el-menu-item :index="'/reward'" @click="saveNavState('/reward')">
            <template slot="title">
              <i :class="'iconfont icon-a-huaban1fuben3'"></i>
              <span>奖励申报管理</span>
            </template>
          </el-menu-item>
          <!-- </el-submenu> -->

          <!-- 二级菜单 -->
          <el-menu background-color="#084aa0"
                   text-color="#fff"
                   active-text-color="#409EFF" router>
            <el-submenu index="/analysis">
              <template slot="title">
                <i :class="'iconfont icon-a-huaban1fuben5'"></i>
                <span>成果统计</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/analysis" @click="saveNavState('/analysis')">成果概览</el-menu-item>
                <el-menu-item index="/analysis1" @click="saveNavState('/analysis1')">查询页面</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-menu>
      </el-aside>
      <!-- 主体部分 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import router from '@/router'
import Cookies from 'js-cookie'

export default {
  data() {
    return {
      // 被激活的链接地址
      activePath: ""
    };
  },
  created() {
    this.activePath = window.sessionStorage.getItem("activePath");
  },

  computed: {
    showUsername() {
      return Cookies.get('name')
    }
  },

  methods: {

    logout() {
      //window.sessionStorage.clear()
      //localStorage.removeItem("token");

      //清除token
      var storage = window.sessionStorage;
      storage.clear();

      //清除Cookies
      Cookies.remove("name")
      //this.$refs["loginForm"].resetFields();
      this.$router.push("/login");
    },
    // // 点击按钮，切换菜单的折叠与展开
    // toggleCollapse() {
    //   this.isCollapse = !this.isCollapse;
    // },
    // 保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;

    },

  },
  components: { router }
}
</script>

<style lang="less" scoped>
// 清除浮动
.clearfix:before,
.clearfix:after {
  content: "";
  display: table;
}

.clearfix:after {
  clear: both;
}

.clearfix {
  *zoom: 1;
}


.home-container {
  height: 100%;
}

.el-header {
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
}

.homelogo {
  background-color: #1154ab;
  width: 256px;
  height: 100%;
  display: flex;
  align-items: center;
}

.admin {
  display: flex;
  justify-content: flex-end;
}

.admintext {
  padding-right: 20px;
  display: flex;
  justify-content: flex-end;
}

// .adminword {
//   padding-right: 0px;
//   margin-right: 0px;
// }

.adminphoto {
  padding-top: 15px;
}

.el-aside {
  background-color: #084aa0;

  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: #0d4cec;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}

.el-button {
  border: none;
  margin-top: 8px;
  font-size: large;
}
</style>