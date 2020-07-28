<template>
	<div class="navbar">
		<div class="navbar-logo">
			<img src="../assets/img/navbar/logo.png" height="60px">
			<i class="el-icon-s-fold" style="cursor: pointer;" @click="emits"></i>
		</div>
		<div class="navbar-select">
			<el-avatar size='small' :src="ruleForm.avatar"></el-avatar>
			<el-dropdown>
				<span class="el-dropdown-link">
					{{ruleForm.username}}
					<i class="el-icon-arrow-down el-icon--right"></i>
				</span>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item>消息</el-dropdown-item>
					<el-dropdown-item>设置</el-dropdown-item>
					<el-dropdown-item>退出</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</div>
	</div>
</template>

<script>
	import { User } from '@/api/index';

	export default {
		data() {
			return {
				isShow: false,
				ruleForm: {
					username: '',
					fullname: '',
					sex: '',
					tel: '',
					role: '',
					avatar: '',
				},
			};
		},
		created() {
			this.loadList();
		},
		methods: {
			//获取信息
			async loadList() {
				let id = sessionStorage.uid;
				let { status, data } = await User.info({ id });
				if (status) {
					this.ruleForm = data;
				}
			},
			emits() {
				this.isShow = !this.isShow;
				this.$emit('change', this.isShow);
			},
		}
	}
</script>

<style>
	.navbar {
		background-color: #31404E;
		height: 60px;
		color: white;
		line-height: 60px;
		padding-left: 20px;
		display: flex;
		justify-content: space-between;
		padding-right: 20px;
	}

	.navbar-logo {
		height: 60px;
		box-sizing: border-box;
	}

	.el-icon-s-fold {
		position: absolute;
		top: 21px;
	}

	.el-dropdown-link {
		cursor: pointer;
		color: #fff;
		padding: 0 10px;
	}

	.el-icon-arrow-down {
		font-size: 12px;
	}

	.navbar-select {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
