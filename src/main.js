import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import './assets/font/iconfont.css'
import axios from 'axios'
import './plugins/element'
import TreeTable from 'vue-table-with-tree-grid'
import moment from 'moment'



import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import './mock/index'

axios.defaults.baseURL = 'http://www.ysqorz.top:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.authorization = window.sessionStorage.getItem('token')
  return config
})
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
Vue.prototype.$http = axios

Vue.filter('dataFormat', function (dateStr, pattern = 'YYYY-MM-DD hh:mm:ss') {
  if (dateStr) {
    return moment(dateStr).format(pattern)
  } else {
    return dateStr
  }
})




Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

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