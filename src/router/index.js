import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import ('../components/Login.vue')
const Home = () => import ('../components/Home.vue')
const Welcome = () => import ('../components/Welcome.vue')
const Users = () => import ('../components/users/Users.vue')

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
