import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import { User } from '@/api/index';

export default new Vuex.Store({
	state: {
		isCollapse: false, //侧边栏菜单
		profile: {}, //账户资料
	},
	mutations: { /* 在这个地方做state的修改 */
		changeType(state) {
			state.isCollapse = !state.isCollapse;
		},
		setProfile(state, data) {
			state.profile = data;
		},
	},
	actions: {
		//加载账户资料
		async loadProfile(context) {
			let id = sessionStorage.uid;
			let { status, data } = await User.info({ id });
			if (status) {
				context.commit('setProfile', data);
			}
		},
		//编辑账户资料
		async updateProfile(context, user) {
			let { status } = await User.edit(user);
			if (status) {
				context.commit('setProfile', user);
			}
		}
	},
	modules: {}
})
