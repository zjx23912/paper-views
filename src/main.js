import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/fonts/iconfont.css'
import './assets/css/global.css'
//import '@/assets/css/detail.less'

import axios from 'axios'
// 引入echarts
// 直接import echarts from 'echarts'会报错
import * as echarts from 'echarts'


//配置根路径
//axios.defaults.baseURL = 'http://192.168.84.188:8888/api/'
//axios.defaults.baseURL = 'http://192.168.1.103:8888/api/'
axios.defaults.baseURL = 'http://10.12.37.63:9090/api/'

Vue.prototype.$http = axios

Vue.prototype.$echarts = echarts

Vue.config.productionTip = false


//添加请求拦截器
axios.interceptors.request.use(
  config => {
    if (window.sessionStorage.getItem('token')) {


      config.headers.token = window.sessionStorage.getItem('token');
    }
    //console.log(config)
    return config
  },
  error => {
    router.push("/login");
    return Promise.reject(error);
  }
)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
