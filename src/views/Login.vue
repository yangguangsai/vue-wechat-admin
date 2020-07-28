<template>
	<div class="bg">
		<el-card class="login-card">
			<div slot="header" class="clearfix">
				<span>欢迎登录</span>
			</div>
			<el-form ref="form" :rules="rules" :model="form" label-width="60px">
				<el-form-item label="登录" prop="username">
					<el-input v-model="form.username" prefix-icon="el-icon-user" placeholder="请输入账户名"></el-input>
				</el-form-item>

				<el-form-item label="密码" prop="password">
					<el-input v-model="form.password" prefix-icon="el-icon-key" placeholder="请输入密码" show-password></el-input>
				</el-form-item>

				<el-form-item>
					<el-button type="primary" @click="submitForm('form')">登录</el-button>
				</el-form-item>

				<div class="active-box">
					<router-link to="/register">注册账户</router-link>
					<router-link to="/register">忘记密码?</router-link>
				</div>
			</el-form>
		</el-card>
	</div>
</template>

<script>
	import { User } from '@/api/index'
	
	export default {
		data() {
			return {
				form: {
					username: '',
					password: '',
				},
				rules: {
					username: [
						{ required: true, message: '请输入账户名称', trigger: 'blur' },
						{ min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
					],
					password: [
						{ required: true, type: 'string', message: '请输入密码', trigger: 'blur' },
						{ pattern: /^\d{3,}$/, message: '密码长度最少 3 个数字', trigger: 'blur' } /* pattern用来验证正则表达书 */
					]
				}
			}
		},
		methods: {
			submitForm(formName) {
				this.$refs[formName].validate(async (valid) => {
					if (!valid) {
						return false;
					}
					let { status, msg, data } = await User.login({ ...this.form });
					if (status) {
						//储存Token,uid,role
						sessionStorage.token = data.token;
						sessionStorage.uid = data.id;
						sessionStorage.role = data.role;
						//成功
						this.$message.success('登陆成功!');
						//=========================
						let { redirect } = this.$route.query;
						if (redirect) {
							this.$router.replace(redirect);
						} else {
							//跳转路由的接口(默认跳转)
							this.$router.replace('/goods/list');
						}
						//==================
						// //跳转路由的接口(默认跳转)
						// this.$router.replace('/goods/list');
					} else {
						//失败
						this.$message.info('用户名或密码输入错误，请重新登录');
					}
				});
			},
		}
	}
</script>

<style scoped>
	/* scoped的意思是 防止其他页面的 重名的css相互影响  scoped是独立为一个新的代码块 */
	.bg {
		height: 100vh;
		background: url(../assets/img/login-bg.jpg) top center no-repeat;
		background-size: cover;
		position: relative;
	}

	.login-card {
		width: 350px;
		position: absolute;
		right: 80px;
		top: 50%;
		transform: translateY(-50%);
	}

	.active-box {
		font-size: 13px;
		color: #ccc;
		display: flex;
		justify-content: space-between;
	}
</style>
