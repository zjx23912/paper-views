import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import Paper from '@/components/Paper.vue'
import Patent from '@/components/Patent.vue'
import Work from '@/components/Work.vue'
import Verticals from '@/components/Verticals.vue'
import Horizontals from '@/components/Horizontals.vue'
import Members from '@/components/Members.vue'
import Reward from '@/components/Reward.vue'
import Analysis from '@/components/Analysis.vue'
import Analysis1 from '@/components/Analysis1.vue'
// import Analysis from '@/components/Analysisc.vue'


Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', redirect: '/paper' },
  {
    path: '/home',
    component: Home,
    children: [
      { path: '/paper', component: Paper },
      { path: '/patent', component: Patent },
      { path: '/work',component: Work},
      { path: '/verticals',component: Verticals},
      { path: '/horizontals',component: Horizontals},
      { path: '/Members',component: Members},
      { path: '/reward', component: Reward },
      { path: '/analysis', component: Analysis },
      { path: '/analysis1',component: Analysis1}]
  },
  {path:'/analysis1',component: Analysis1}
]

const router = new VueRouter({
  routes
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  //const tokenStr = localStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
