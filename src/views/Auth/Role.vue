<template>
	<div class="display">
		<el-card class="box-card box">
			<div slot="header" class="clearfix">
				<span>卡片名称</span>
				<el-button style="float: right; padding: 10px 20px" type="primary" plain icon="el-icon-circle-plus-outline" @click="handleInsert">添加角色</el-button>
			</div>
			<el-table :data="tableData" style="width: 100%">
				<el-table-column prop="id" label="#" width="150">
				</el-table-column>
				<el-table-column prop="name" label="角色" width="150">
					<template slot-scope="scope">
						<el-tag :class="{color:scope.row.name === '超级管理员'}">{{scope.row.name}}</el-tag>
					</template>
				</el-table-column>

				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button type="primary" plain icon="el-icon-edit" @click="handleInfo(scope.row.id,scope.row.name,scope.$index)"
						 :disabled="scope.row.name === '超级管理员'"></el-button>
						<el-button type="danger" plain icon="el-icon-delete" @click="removeRole(scope.row.id,scope.$index)" :disabled="scope.row.name === '超级管理员'"></el-button>
						<el-button type="primary" plain icon="el-icon-setting" @click="handleSetting(scope.row.id,scope.$index)"></el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- 编辑模态框 -->
			<!-- <el-dialog title="编辑角色" :visible.sync="dialogFormVisible">
				<el-form ref="form" :model="form" :rules="rules" label-position="left">
					<el-form-item label="名称" :label-width="formLabelWidth" prop="name">
						<el-input v-model="form.name" autocomplete="off"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogFormVisible = false">取 消</el-button>
					<el-button type="primary" @click="submitForm('form')">确 定</el-button>
				</div>
			</el-dialog> -->
			<!-- 添加模态框 -->
			<el-dialog title="添加角色" :visible.sync="insertModalShow">
				<el-form ref="insertForm" :model="insertForm" :rules="rules" label-position="left">
					<el-form-item label="名称" :label-width="formLabelWidth" prop="name">
						<el-input v-model="insertForm.name" autocomplete="off"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="insertModalShow = false">取 消</el-button>
					<el-button type="primary" @click="submitInsertForm('insertForm')">确 定</el-button>
				</div>
			</el-dialog>
		</el-card>
		<!-- 设置模态框 -->
		<div class="layout">
			<el-card class="box-card box-right" v-show="isShow===true" v-for="(item,index) in options_1st" :key="index">
				<div slot="header" class="clearfix">
					<span class="title-color"><i class='el-icon-collection-tag'></i>{{item.name}}</span>
					<el-switch v-model="item.checked" style="float: right;" @change="toggleAll(item.id,index)"></el-switch>
				</div>
				<ul>
					<li class="listStyle" v-for="(content,idx) in item.children">{{content.name}}
						<el-switch @change="checkedSingle(content.id,idx,index)" v-model="content.checked" style="float: right;"></el-switch>
					</li>
				</ul>
			</el-card>
		</div>
	</div>
</template>

<script>
	import { Role } from '@/api/index';

	export default {
		data() {
			return {
				isShow: false, //右边框框
				role_id: '', //角色id
				options_1st: [],

				formLabelWidth: '120px',
				dialogFormVisible: false, //编辑框
				insertModalShow: false, //添加角色框
				tableData: [],
				form: { //编辑的信息
					id: '',
					name: '',
				},
				insertForm: { //添加的信息
					name: '',
				},
				roleMenu: {
					menu_id: '',
					role_id: '',
				},
				rules: { //添加的信息校验
					name: [
						{ required: true, message: '请输入名称', trigger: 'blur' },
						{ min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
					],
				}
			}
		},
		created() {
			this.loadList();
		},
		watch: {
			'$route'(to, from) {
				let { id } = to.params;
				this.loadList(id);
			}
		},
		methods: {
			// 全选
			async toggleAll(menu_id, i) {
				if (this.options_1st[i].checked == false) {
					this.roleMenu.role_id = this.role_id;
					this.roleMenu.menu_id = menu_id;
					let { status, data } = await Role.removemenu(this.roleMenu);
					for (var j = 0; j < this.options_1st[i].children.length; j++) {
						this.options_1st[i].children[j].checked = false;
						var id = this.options_1st[i].children[j].id;
						this.roleMenu.menu_id = id;
						let { status, data } = await Role.removemenu(this.roleMenu);
					}
				} else {
					this.roleMenu.role_id = this.role_id;
					this.roleMenu.menu_id = menu_id;
					let { status, data } = await Role.addmenu(this.roleMenu);
					for (var j = 0; j < this.options_1st[i].children.length; j++) {
						this.options_1st[i].children[j].checked = true;
						var id = this.options_1st[i].children[j].id;
						this.roleMenu.menu_id = id;
						let { status, data } = await Role.addmenu(this.roleMenu);
					}
				}
			},

			async checkedSingle(menu_id,idx,i) {
				if (this.options_1st[idx].children[i].checked == false) {
					this.roleMenu.role_id = this.role_id;
					this.roleMenu.menu_id = menu_id;
					let { status, data } = await Role.removemenu(this.roleMenu);
					var num = 0
					for (var j = 0; j < this.options_1st[idx].children.length; j++) {
						if (this.options_1st[idx].children[j].checked == true) {
							num++;
						}
					}
					if (num >= 1) {
						this.options_1st[idx].checked = true;
						var ID = this.options_1st[idx].id;
						this.roleMenu.menu_id = ID;
						let { status, data } = await Role.addmenu(this.roleMenu);
					} else {
						this.options_1st[idx].checked = false;
						var ID = this.options_1st[idx].id;
						this.roleMenu.menu_id = ID;
						let { status, data } = await Role.removemenu(this.roleMenu);
					}
				} else {
					this.roleMenu.role_id = this.role_id;
					this.roleMenu.menu_id = menu_id;
					let { status, data } = await Role.addmenu(this.roleMenu);
					var num = 0;
					for (var j = 0; j < this.options_1st[idx].children.length; j++) {
						if (this.options_1st[idx].children[j].checked === true) {
							num++;
						}
					}
					if (num >= 1) {
						this.options_1st[idx].checked = true;
						var ID = this.options_1st[idx].id;
						this.roleMenu.menu_id = ID;
						let { status, data } = await Role.addmenu(this.roleMenu);
					} else {
						this.options_1st[idx].checked = false;
						var ID = this.options_1st[idx].id;
						this.roleMenu.menu_id = ID;
						let { status, data } = await Role.removemenu(this.roleMenu);
					}
				}
			},
			// 根据角色配置获取菜单信息
			async handleSetting(id, index) {
				this.isShow = true;
				this.role_id = id;
				let { status, data } = await Role.config({ id: id });
				if (status) {
					this.options_1st = data;
				}
			},
			//获取角色信息
			async loadList() { /* 加载列表数据 */
				let { status, data } = await Role.list();
				if (status) {
					this.tableData = data;
				}
			},
			//添加角色信息
			handleInsert() {
				this.insertModalShow = true;
			},
			submitInsertForm(formName) {
				this.$refs[formName].validate(async (valid) => {
					if (valid) {
						let { status, msg } = await Role.insert(this.insertForm);
						if (status) {
							this.$message.success('添加成功!');
							this.insertModalShow = false;
							//更新DOM====================
							this.loadList();
						}
					} else {
						this.$message.info('添加失败!');
						return false;
					}
				});
			},
			//删除角色信息
			removeRole(id, index) {
				this.$confirm('此操作将永久删除该角色, 是否继续?', {
					type: 'warning'
				}).then(async () => {
					let { status, data } = await Role.remove({ id });
					if (status) {
						//更新DOM
						this.tableData.splice(index, 1);
						this.$message.success('删除成功!');
					}
				}).catch(() => {
					this.$message.info('取消删除');
				});
			},
			//获取信息
			handleInfo(id, name, index) {
				this.$prompt('修改信息', '修改', {
					inputPattern: /\S/,
					inputErrorMessage: '请输入字符',
					inputValue: name
				}).then(async ({ value }) => {
					let { status } = await Role.edit(id, value);
					if (status) {
						this.$message.success('修改成功！');
						//更新页面
						this.tableData[index].name = value;
					}
				}).catch(() => {
					this.$message.info('修改失败!');
				});
			},
			//编辑角色信息
			// submitForm(formName) {
			// 	this.$refs[formName].validate(async (valid) => {
			// 		if (valid) {
			// 			let { status, msg } = await Role.edit(this.form);
			// 			if (status) {
			// 				this.$message.success('修改成功!');
			// 				this.dialogFormVisible = false;
			// 				//更新DOM======================================================================
			// 			}
			// 		} else {
			// 			this.$message.info('修改失败!');
			// 			return false;
			// 		}
			// 	});
			// },
		}
	}
</script>

<style scoped>
	.display {
		display: flex;
		justify-content: space-between;
		flex: 1;
	}

	/* 模态框 */
	.box {
		width: 530px;
	}

	.box-right {
		width: 740px;
		margin: 0 0 10px 0;
	}

	.title-color {
		color: #409eff;
		font-size: 14px;
	}

	.layout {
		display: flex;
		flex-direction: column;
	}

	.listStyle {
		padding: 5px 0;
		list-style: none;
		font-size: 14px;
	}

	/* 超级管理员变色 */
	.box .color {
		background-color: #FEF0F0;
		color: #F66C81;
	}
</style>
