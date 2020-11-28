import Vue from 'vue'
import App from './App'
//引入vuex
import store from './store'
// socket.io
import UniSocket from './common/uniapp.socket.io.js'

const socket = UniSocket('http://192.168.1.4:8081')
// 
socket.on('connect', () => {
	// console.log('连接');
	socket.emit('set_info', {msg: uni.getStorageSync('token')})
})
// 用户消息
socket.on('REVIEW', () => {
	store.commit('addUserMsg', 1)
})
socket.on('LIKE', () => {
	store.commit('addUserMsg', 1)
})
// 公告
socket.on('NOTICE', () => {
	store.commit('addNoticeMsg', 1)
})
// 系统消息
socket.on('SYSTEM', () => {
	store.commit('addSystemMsg', 1)
})
Vue.prototype.$socket = socket

Vue.prototype.$store = store
Vue.config.productionTip = false

App.mpType = 'app'

// 引入全局uView
import uView from 'uview-ui'
Vue.use(uView);
Vue.prototype.$photoHeader = 'http://192.168.1.4:8080/'
Vue.prototype.$baseUrl = 'http://192.168.1.4:8080/api'

// 时间差过滤器
Vue.filter('intervalTime', function (startTime) {
  const endTime = new Date().getTime()
  const date = endTime - startTime

  // 计算相差天数
  const day = Math.floor(date / (24 * 3600 * 1000))
  // 计算相差小时
  const date2 = date % (24 * 3600 * 1000)
  const hour = Math.floor(date2 / (3600 * 1000))
  // 计算相差分钟
  const date3 = date2 % (3600 * 1000)
  const minutes = Math.floor(date3 / (60 * 1000))
  let result = ''
  if (day) {
    result = day + '天之前' 
  } else if (hour) {
    result = hour + '小时之前'
  } else if (minutes) {
    result = minutes + '分钟之前'
  } else {
    result = '刚刚'
  }
  return result
})

// 挂载过滤器=>格式化时间yyyy-mm-dd
Vue.filter('formatDate', function (date) {
  const n = new Date(date)
  return n.getFullYear() + '-' + (n.getMonth() + 1)
})

const app = new Vue({
    ...App,
	store
})

// http拦截器，将此部分放在new Vue()和app.$mount()之间，才能App.vue中正常使用
import httpInterceptor from '@/common/http.interceptor.js'
Vue.use(httpInterceptor, app)

// http接口API抽离，免于写url或者一些固定的参数
import httpApi from '@/common/http.api.js'
Vue.use(httpApi, app)

app.$mount()
