<template>
	<el-container>
		<!-- 顶部菜单 -->
		<el-header>
			<NavBar @change='handleMenu($event)'></NavBar>
		</el-header>
		<el-container>
			<!-- 侧边栏菜单 -->
			<el-aside style='width: 200px;'>
				<LeftMenu :isCollapse='isShow'></LeftMenu>
			</el-aside>
			<!-- 主题内容 -->
			<el-main>
				<router-view></router-view> <!-- 路由配置到的组件渲染到这个地方-->
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
	import NavBar from '@/components/NavBar.vue'
	import LeftMenu from '@/components/LeftMenu.vue'

	export default { /* 以组件的形式 供外部使用 */
		data(){
			return {
				isShow:false
			}
		},
		components: { //创建组件
			NavBar,
			LeftMenu
		},
		methods: {
			handleMenu(val) {
				this.isShow = val;
			},
		}
	}
</script>

<style>

</style>
