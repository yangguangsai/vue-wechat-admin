<template>
	<el-card class="box-card">
		<div slot="header" class="clearfix">
			<span>商品分类</span>
		</div>
		<!-- 树形组件 -->
		<el-tree ref="tree" :load="loadNode" node-key="id" :default-expanded-keys="[1]" lazy :props="defaultProps">
			<span class="custom-tree-node" slot-scope="{ node, data }">
				<span>{{ node.label }}</span>
				<span>
					<el-button type="text" icon="el-icon-edit" :disabled="node.level==1" size="mini" @click.stop="() => openEditModal(node,data)">
						编辑
					</el-button>
					<el-button type="text" icon="el-icon-plus" size="mini" @click.stop="() => openInsertModal(node,data)">
						添加
					</el-button>
					<el-button type="text" icon="el-icon-delete" :disabled="node.level==1" size="mini" node-key="id" @click.stop="() => remove(node, data)">
						删除
					</el-button>
				</span>
			</span>
		</el-tree>
		<!-- 编辑弹窗 -->
		<el-dialog title="编辑节点" :visible.sync="editModalShow">
			<el-form :model="editForm" label-position="left" :rules="rules" ref="editForm">
				<el-form-item label="名称" label-width="80px" prop="name">
					<el-input v-model="editForm.name" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="图片" label-width="80px" prop="img">
					<SingleUpload :url='editForm.img' :action='action' @success='handleUploadSuccess($event)' @remove='editForm.img=""'></SingleUpload>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editModalShow = false">取 消</el-button>
				<el-button type="primary" @click="handleUploadNode('editForm')">保 存</el-button>
			</div>
		</el-dialog>
		<!-- 添加弹窗 -->
		<el-dialog title="添加节点" :visible.sync="insertModalShow">
			<el-form :model="insertForm" label-position="left" :rules="rules" ref="insertForm">
				<el-form-item label="名称" label-width="80px" prop="name">
					<el-input v-model="insertForm.name" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="图片" label-width="80px" prop="img">
					<SingleUpload :url='insertForm.img' :action='action' @success='handleInsertSuccess($event)' @remove='insertForm.img=""'></SingleUpload>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="insertModalShow = false">取 消</el-button>
				<el-button type="primary" @click="handleInsertNode('insertForm')">添 加</el-button>
			</div>
		</el-dialog>
	</el-card>
</template>

<script>
	import { Category } from '@/api/index';
	import SingleUpload from '@/components/SingleUpload.vue';

	export default {
		components: {
			SingleUpload
		},
		data() {
			return {
				action: "/api/upload/common", //上传图片的后台ajax地址

				defaultProps: {
					label: 'name'
				},
				insertForm: {
					name: '',
					pId: '',
					img: '',
				},
				editForm: {
					id: '',
					name: '',
					img: '',
				},
				nodeData: {}, //节点数据
				node: {}, //节点
				insertModalShow: false,
				editModalShow: false,

				rules: {
					name: [
						{ required: true, message: '请输入名称', trigger: 'blur' },
						{ min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
					],
					img: [
						{ required: true, message: '请选择img', trigger: 'change' }
					]
				}
			};
		},
		methods: {
			async loadNode(node, resolve) {
				// node:节点对象
				// resolve: 返回节点数据的方法
				if (node.level === 0) {
					let { status, data } = await Category.allcate({ pId: 0 });
					return resolve(data);
				}
				//父级节点pId
				let pId = node.data.id;
				//获取子级节点
				let { status, data } = await Category.allcate({ pId });
				if (status) {
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
						let { status, msg } = await Category.edit({ ...this.editForm });
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
			//插入节点
			async handleInsertNode(formName) {
				//1.表单校验
				this.$refs[formName].validate(async (valid) => {
					if (valid) {
						//2.ajax
						let { status, msg, data } = await Category.insert({ ...this.insertForm });
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
			//删除分类
			remove(node, data) {
				let id = data.id;
				this.$confirm('此操作将永久删除该节点，是否继续?', '提示', {
					type: 'warning',
				}).then(async () => {
					let { status } = await Category.remove({ id });
					if (status) {
						//更新DOM
						this.$refs.tree.remove({ ...data });
						this.$message.success('删除成功!');
					}
				}).catch(() => {
					this.$message.info('已取消删除');
				});
			},
			//编辑头像上传成功
			handleUploadSuccess(res) {
				this.editForm.img = res.src;
			},
			//添加节点图片上传成功!
			handleInsertSuccess(res) {
				this.insertForm.img = res.src;
			},
		}
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
</style>
