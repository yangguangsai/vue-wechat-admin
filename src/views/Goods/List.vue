<template>
	<el-card class="box-card">
		<div slot="header" class="clearfix">
			<span>商品列表</span>
		</div>
		<el-table :data="tableData" style="width: 100%" :default-sort="{prop: 'date', order: 'descending'}">
			<el-table-column prop="address" label="商品名称">
				<template slot-scope="scope">
					<div class="scope-box">
						<div>
							<el-image :src="scope.row.img_md" style="width: 80px;"></el-image>
						</div>
						<div class="goods-name">
							<span>{{scope.row.name}}</span>
							<span>商品货号:{{scope.row.articleNo}}</span>
						</div>
					</div>
				</template>
			</el-table-column>

			<el-table-column prop="price" label="价格" sortable width="180"></el-table-column>

			<el-table-column prop="inventory" label="库存" sortable width="180"></el-table-column>

			<el-table-column prop="create_time" label="发布时间" sortable width="180"></el-table-column><!-- :formatter="formatter" -->

			<el-table-column label="操作" width="180">
				<template slot-scope="scope">
					<!-- 点编辑的时候获取当前id的信息  需要路由传参 即根据id传参（Article里面的 路径 path: 'edit/:id',） -->
					<el-link :href='`#/goods/edit/${scope.row.id}`' class="am-margin-right-sm" type="primary">
						<el-button type="primary" plain icon="el-icon-edit"></el-button>
					</el-link>
					<el-button type="danger" plain icon="el-icon-delete" @click="removeGoods(scope.row.id,scope.$index)"></el-button>
				</template>
			</el-table-column>
		</el-table>

		<div class="block">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage1"
			 :page-sizes="[4, 8, 16, 32]" :page-size="3" background layout="prev, pager, next, sizes, total" :total="this.total"></el-pagination>
		</div>
	</el-card>
</template>

<script>
	import { Goods } from '@/api/index'
	export default {
		data() {
			return {
				tableData: [],
				pagesize: 4,
				pageindex: 1,
				currentPage1: 1,//默认页数 第一页
				total: 11
			}
		},
		created() {
			//生命周期获取数据
			this.loadList();
		},
		methods: {
			//获取列表信息
			async loadList() { /* 加载列表数据 */
				let { status, goods, total } = await Goods.list();
				if (status) {
					this.tableData = goods;
					this.total = total;
				}
			},
			// 删除列表
			removeGoods(id, index) {
				console.log(id, index);
				this.$confirm('此操作将永久删除该商品, 是否继续?', '删除商品', {
					type: 'warning'
				}).then(async () => {
					let { status } = await Goods.remove({ id });
					if (status) {
						//更新DOM
						this.tableData.splice(index, 1);
						this.$message.success('删除成功!');
						this.total--;
					}
				}).catch(() => {
					this.$message.info('取消删除');
				});
			},
			async handleSizeChange(val) { /* val是每页多少条数据*/
				this.pagesize = val;
				let index = this.pageindex;
				let { status, total, goods } = await Goods.list({ pageSize: val, pageIndex: index });
				if (status) {
					this.tableData = goods;
					this.total = total;
				}
			},
			async handleCurrentChange(val) { /* val是第几页 */
				this.pageindex = val;
				let size = this.pagesize;
				let { status, total, goods } = await Goods.list({ pageSize: size, pageIndex: val });
				if (status) {
					this.tableData = goods;
					this.total = total;
				}
			},
		}
	}
</script>

<style scoped>
	.block {
		display: flex;
		justify-content: flex-end;
		margin-top: 15px;
	}

	.scope-box {
		display: flex;
	}

	.goods-name {
		display: flex;
		flex-direction: column;
		margin-left: 10px;
		margin-top: 20px;
		font-size: 12px;
	}

	.am-margin-right-sm {
		margin-right: 10px;
	}
</style>
