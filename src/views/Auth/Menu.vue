<template>
	<el-card class="box-card">
		<div slot="header" class="clearfix">
			<span>菜单权限</span>
		</div>
		<el-alert class="alert" title="Tips" :closable="false" type="warning" description="设置后台管理系统的左侧菜单，目前至多支持两层菜单，三层以上菜单将不会显示。"
		 show-icon></el-alert>
		<!-- 树形组件 -->
		<el-tree ref="tree" :load="loadNode" node-key="id" :default-expanded-keys="[1]" lazy :props="defaultProps">
			<span class="custom-tree-node" slot-scope="{ node, data }">
				<span>{{ node.label }}</span>
				<span>
					<el-popover placement="left-start" width="100" trigger="hover" :popper-class='data.icon'>
						<el-button type="text" slot="reference" :icon="data.icon" :disabled="node.level==1" size="mini" @click.stop="showIcon(node,data)">
							图标
						</el-button>
					</el-popover>

					<el-button type="text" icon="el-icon-edit" :disabled="node.level==1" size="mini" @click.stop="() => openEditModal(node,data)">
						编辑
					</el-button>
					<el-button type="text" icon="el-icon-plus" size="mini" @click.stop="() => openInsertModal(node,data)">
						添加
					</el-button>
					<el-button type="text" icon="el-icon-delete" :disabled="node.level==1" size="mini" node-key="id" @click.stop="() => remove(node, data)">
						删除
					</el-button>
					<span class="style">
						显示序号：
						<el-tag style="width: 45px;">{{data.order}}</el-tag>
					</span>
				</span>
			</span>
		</el-tree>
		<!-- 模态框 -->
		<el-dialog title="选择图标" :visible.sync="dialogFormVisible">
			<ul class="icon">
				<li class="floor" v-for="(item,index) in iconForm" @click='isChecked(index,item)' :key="item.id" :class="{checked: item.checked == true}">
					<div style="width:100%;height:100%">
						<i :class="item.name"></i>
						<p>{{item.name}}</p>
					</div>
				</li>
			</ul>
			<el-pagination background @current-change="handleCurrentChange" :current-page="currentPage1" :page-size="1" layout="->,prev, pager, next"
			 :total="10">
			</el-pagination>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="handleIcon">添 加</el-button>
			</div>
		</el-dialog>
		<!-- 添加弹窗 -->
		<el-dialog title="添加节点" :visible.sync="insertModalShow">
			<el-form :model="insertForm" label-position="left" :rules="rules" ref="insertForm">
				<el-form-item label="菜单名称" label-width="100px" prop="name">
					<el-input v-model="insertForm.name" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="链接地址" label-width="100px">
					<el-input v-model="insertForm.path" autocomplete="off" placeholder="制定此菜单的链接地址,选填"></el-input>
				</el-form-item>
				<el-form-item label="显示顺序" label-width="100px" prop="order">
					<el-input v-model="insertForm.order" autocomplete="off" placeholder="显示顺序按照数字从小到大,如2001"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="insertModalShow = false">取 消</el-button>
				<el-button type="primary" @click="handleInsertNode('insertForm')">添 加</el-button>
			</div>
		</el-dialog>
		<!-- 编辑弹窗 -->
		<el-dialog title="编辑节点" :visible.sync="editModalShow">
			<el-form :model="editForm" label-position="left" :rules="rules" ref="editForm">
				<el-form-item label="菜单名称" label-width="100px" prop="name">
					<el-input v-model="editForm.name" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="链接地址" label-width="100px">
					<el-input v-model="editForm.path" autocomplete="off" placeholder="制定此菜单的链接地址,选填"></el-input>
				</el-form-item>
				<el-form-item label="显示顺序" label-width="100px" prop="order">
					<el-input v-model="editForm.order" autocomplete="off" placeholder="显示顺序按照数字从小到大,如2001"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editModalShow = false">取 消</el-button>
				<el-button type="primary" @click="handleUploadNode('editForm')">保 存</el-button>
			</div>
		</el-dialog>
	</el-card>
</template>

<script>
	import { Menu } from '@/api/index';

	export default {
		data() {
			return {
				pagesize: 30,
				pageindex: 1,
				currentPage1: 1,
				iconForm: [], //存放图片的数组
				defaultProps: {
					label: 'name'
				},
				insertForm: {
					name: '',
					pId: '',
					path: '',
					order: '',
				},
				editForm: {
					id: '',
					name: '',
					path: '',
				},
				iconAddForm: {
					id: '',
					icon: ''
				},

				nodeData: {}, //节点数据
				node: {}, //节点
				insertModalShow: false,
				editModalShow: false,

				dialogFormVisible: false, //模态框

				//表单验证
				rules: {
					name: [
						{ required: true, message: '请输入活动名称', trigger: 'blur' },
						{ min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
					],
					order: [
						{ required: true, message: '请输入显示顺序', trigger: 'blur' },
						{ min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
					],
				}
			}
		},
		methods: {
			// 按钮
			async handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
				this.pageindex = val;
				let size = this.pagesize;
				let { status, icons } = await Menu.iconList({ pageSize: size, pageIndex: val });
				if (status) {
					this.iconForm = icons
					this.iconForm.forEach((item) => {
						item.name = 'el-icon-' + item.name
						item.checked = false
					})
				}
			},
			// 添加图片
			async handleIcon() {
				// console.log(data)
				for (var i = 0; i < this.iconForm.length; i++) {
					if (this.iconForm[i].checked == true) {
						this.iconAddForm.icon = this.iconForm[i].id
					}
				}
				let { status, msg } = await Menu.icon(this.iconAddForm);
				if (status) {
					this.data.icon = this.item.name
					this.$message.success(msg);
					this.dialogFormVisible = false;
				}
			},
			//点击事件
			isChecked(i, item) {
				this.item = item
				this.$forceUpdate(this.iconForm[i].checked = true)
				for (var j = 0; j < this.iconForm.length; j++) {
					if (i != j) {
						this.iconForm[j].checked = false
					}
				}
			},
			//获取图标
			async showIcon(node, data) {
				this.iconAddForm.id = data.id;
				this.data = data;
				this.dialogFormVisible = true;
				let { status, icons } = await Menu.iconList({ pageSize: 30, pageIndex: 1 })
				if (status) {
					this.iconForm = icons;
					this.iconForm.forEach((item) => {
						item.name = 'el-icon-' + item.name;
						item.checked = false;
					})
				}
			},
			async handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
				this.pageindex = val;
				let size = this.pagesize;
				let { status, icons } = await Menu.iconList({ pageSize: size, pageIndex: val });
				if (status) {
					this.iconForm = icons
					this.iconForm.forEach((item) => {
						item.name = 'el-icon-' + item.name
						item.checked = false
					})
				}
			},
			async loadNode(node, resolve) {
				// node:节点对象
				// resolve: 返回节点数据的方法
				if (node.level === 0) {
					let { status, data } = await Menu.list({ pId: 0 });
					return resolve(data);
				}
				//父级节点pId
				let pId = node.data.id;
				//获取子级节点
				let { status, data } = await Menu.list({ pId });
				if (status) {
					data.forEach((item, index) => {
						item.icon = "el-icon-" + item.icon; //字符串拼接
					});
					return resolve(data);
				}
			},
			//打开编辑model
			openEditModal(node, data) {
				this.editForm = { ...data };
				this.node = node;
				this.editModalShow = true;
			},
			//编辑节点
			handleUploadNode(formName) {
				//1.表单校验
				this.$refs[formName].validate(async (valid) => {
					if (valid) {
						//2.ajax
						let { status, msg } = await Menu.edit({ ...this.editForm });
						if (status) {
							this.$message.success('编辑成功!');
							//更新节点
							this.node.data = this.editForm;
							this.editModalShow = false;
						}
					}
				});
			},
			//打开插入model
			openInsertModal(node, data) {
				//node：节点   data:节点数据
				//转存node
				this.node = node;
				this.insertForm.pId = data.id;
				this.insertForm.img = '';
				this.insertModalShow = true;
			},
			//插入子菜单
			async handleInsertNode(formName) {
				//1.表单校验
				this.$refs[formName].validate(async (valid) => {
					if (valid) {
						//2.ajax
						let { status, msg, data } = await Menu.insert({ ...this.insertForm });
						if (status) {
							this.$message.success('插入成功!');
							//插入新的节点
							this.$refs.tree.append({ ...data, ...this.insertForm }, this.node);
							this.insertModalShow = false;
							this.insertForm.name = '';
						}
					}
				});
			},
			// 删除子菜单
			remove(node, data) {
				let id = data.id;
				this.$confirm('此操作将永久删除该子菜单，是否继续?', {
					type: 'warning',
				}).then(async () => {
					let { status } = await Menu.remove({ id });
					if (status) {
						//更新DOM
						this.$refs.tree.remove({ ...data });
						this.$message.success('删除成功!');
					}
				}).catch(() => {
					this.$message.info('已取消删除');
				});
			},
		},
	}
</script>

<style scoped>
	.custom-tree-node {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 14px;
		padding-right: 8px;
	}

	/* 提示框样式 */
	.alert {
		margin-bottom: 20px;
	}

	/* 显示序号样式 */
	.style {
		font-size: 12px;
	}

	/* 图片样式 */
	.node-order {
		width: 100px;
		display: inline-block;
		font-size: 12px;
		margin-left: 10px;
	}

	.floor {
		/* width: 118px; */
		list-style: none;
		float: left;
		width: 10%;
		text-align: center;
		height: 100px;
		/* line-height: 100px; */
		color: #666;
		font-size: 10px;
		border-right: 1px solid #eee;
		border-bottom: 1px solid #eee;
		margin-right: -1px;
		margin-bottom: -1px;
	}

	.floor:hover {
		color: #5cb6ff;
	}

	.floor:hover i {
		color: #5cb6ff;
	}

	.floor i {
		display: block;
		font-size: 26px;
		margin-bottom: 10px;
		color: #606266;
		transition: color .15s linear;
		margin-top: 20px;
	}

	.floor p {
		display: inline-block;
		padding: 0 3px;
		height: 1em;
		transition: color .15s linear;
	}

	.icon {
		overflow: hidden;
		list-style: none;
		padding: 0 !important;
		border: 1px solid #eaeefb;
		border-radius: 4px;
	}

	.el-dialog {
		width: 72% !important;
	}

	.checked {
		background-color: #5cb6ff !important;
		color: #fff;
	}

	.checked i {
		color: #fff;
	}
</style>
