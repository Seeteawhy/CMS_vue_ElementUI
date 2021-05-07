import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import ('../components/Login.vue')
const Home = () => import ('../components/Home.vue')
const Welcome = () => import ('../components/Welcome.vue')
const Users = () => import ('../components/users/Users.vue')
const Rights = () => import ('../components/power/Rights.vue')
const Roles = () => import ('../components/power/Roles.vue')
const Cate = () => import ('../components/goods/Cate.vue')
const Params = () => import ('../components/goods/Params.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login',
    
  },
  {
    path: '/login',
    component:Login
  },
  {
    path: '/home',
    redirect: '/welcome',
    component: Home,
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },

    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if(to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
