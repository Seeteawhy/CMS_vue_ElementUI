import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import './assets/font/iconfont.css'
import axios from 'axios'
import './plugins/element'



axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios





Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')


/* import { Form,FormItem,Button,Icon,Input, Message,Container,Header,Aside,Main,Menu,Submenu,MenuItem,MenuItemGroup} from 'element-ui';
Vue.prototype.$message = Message
Vue.use(Input)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Button)
Vue.use(Icon)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup) */