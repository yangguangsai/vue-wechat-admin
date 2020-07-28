import Vue from 'vue'
import VueRouter from 'vue-router'

//引入message来提示用户
import { Message } from 'element-ui';


Vue.use(VueRouter)
//这些东西是为了防止重复点击某一左侧边栏菜单的时候出现错误(错误原因是vue-router版本太新)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err)
}

import Layout from '@/components/Layout.vue';


const routes = [
	//登录
	{
		path: '/login',
		name: 'Login',
		alias: '/',
		component: () => import('@/views/Login.vue'),
		meta: { requiresAuth: false }
	},
	//注册
	{
		path: '/register',
		name: 'Register',
		component: () => import('@/views/Register.vue'),
		meta: { requiresAuth: false }
	},
	//商品
	{
		path: '/goods/',
		name: 'Goods',
		component: Layout,
		meta: { requiresAuth: true },
		children: [{
				path: 'list',
				name: 'GoodsList',
				component: () => import('@/views/Goods/List.vue')
			},
			{
				path: 'category',
				name: 'GoodsCategory',
				component: () => import('@/views/Goods/Category.vue'),
				props: true,
			},
			{
				path: 'release',
				name: 'GoodsRelease',
				component: () => import('@/views/Goods/Release.vue'),
			},
			{
				path: 'edit/:id',
				name: 'GoodsEdit',
				component: () => import('@/views/Goods/Edit.vue'),
				props:true,
			},
		]
	},
	//订单
	{
		path: '/order/',
		name: 'Order',
		component: Layout,
		meta: { requiresAuth: true },
		children: [{
			path: 'list',
			name: 'OrderList',
			component: () => import('@/views/Order/List.vue')
		}, ]
	},
	//账户设置
	{
		path: '/user/',
		name: 'User',
		component: Layout,
		meta: { requiresAuth: true },
		children: [
			//用户管理
			{
				path: 'list',
				name: 'UserList',
				component: () => import('@/views/User/List.vue')
			},
			{
				path: 'info',
				name: 'UserInfo',
				component: () => import('@/views/User/Info.vue')
			},
		]
	},
	//权限设置
	{
		path: '/auth/',
		name: 'Auth',
		component: Layout,
		meta: { requiresAuth: true },
		children: [
			//用户管理
			{
				path: 'role',
				name: 'AuthRole',
				component: () => import('@/views/Auth/Role.vue')
			},
			{
				path: 'menu',
				name: 'AuthMenu',
				component: () => import('@/views/Auth/Menu.vue')
			},
		]
	},
]

const router = new VueRouter({
	routes
})
//======================

//全局守卫
router.beforeEach((to, from, next) => {
	//根据meta元信息校验该地址是否需要授权
	let isrequiresAuth = to.matched.some((path) => path.meta.requiresAuth);
	//不需要登录授权，直接放行
	if(!isrequiresAuth) {
		next();
		return;
	}
	//校验Token (登录、注册不进行校验，直接放行（直接检测路由的name）)
	if (to.name == "Login" || to.name == "Register") {
		next();
		return;
	}
	let token = sessionStorage.token;
	//有Token，立即放行
	if (token) {
		next();
		return;
	}
	//无Token 强制跳转登录
	Message.error('无效的Token，请重新登录!');
	setTimeout(() => {
		next(`/login?redirect=${to.path}`);
	}, 2000);
});

//======================
export default router
