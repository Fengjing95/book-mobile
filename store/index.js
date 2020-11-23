import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
		userMsg: 0,
		noticeNum: 0,
		systemNum: 0,
		token: uni.getStorageSync('token')
	},
    mutations: {
		addUserMsg(state, num) {
			state.userMsg += num
		},
		addNoticeMsg(state, num) {
			state.noticeNum += num
		},
		addSystemMsg(state, num) {
			state.systemNum += num
		},
		freshToken(state) {
			state.token = uni.getStorageSync('token')
		}
	},
    actions: {},
	getters: {
		getUserMsg(state) {
			return state.userMsg
		},
		getNoticeMsg(state) {
			return state.noticeNum
		},
		getSystemMsg(state) {
			return state.systemNum
		},
		getAllMsg(state) {
			return state.userMsg + state.noticeNum + state.systemNum
		},
		getToken(state) {
			return state.token
		}
	}
})
export default store