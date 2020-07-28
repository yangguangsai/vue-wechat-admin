<template>
	<el-card class="box-card">
		<div slot="header" class="clearfix">
			<span>订单列表</span>
		</div>
		<el-table :data="tableData" style="width: 100%" :default-sort="{prop: 'date', order: 'descending'}">
			<el-table-column prop="id" label="#" width="50"></el-table-column>

			<el-table-column width="600px">
				<template slot-scope="scope">
					<el-table :data="scope.row.goodsList">
						<el-table-column label="商品" width="410">
							<template slot-scope="scope">
								<div class="firstcol">
									<div class="box">
										<el-image :src="scope.row.img_md" style='width:100px;'></el-image>
									</div>
									<div style="padding-left: 10px;" class="one">{{scope.row.name}}</div>
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="goods_price" label="单价">
						</el-table-column>
						<el-table-column prop="goods_num" label="数量">
						</el-table-column>
					</el-table>
				</template>
			</el-table-column>

			<el-table-column prop="payment" label="付款金额"> </el-table-column>

			<el-table-column prop="create_time" label="下单时间" sortable width="180"></el-table-column>

			<el-table-column prop="status" label="状态" sortable width="180"></el-table-column>

			<el-table-column prop="address" label="操作">
				<el-button type="primary" plain icon="el-icon-edit"></el-button>
			</el-table-column>
		</el-table>
	</el-card>
</template>

<script>
	import { Order } from '@/api/index';

	export default {
		data() {
			return {
				tableData: []
			}
		},
		created() {
			this.loadList();
		},
		methods: {
			//获取账户订单列表信息
			async loadList() { /* 加载列表数据 */
				let { status, data } = await Order.list();
				if (status) {
					this.tableData = data;
				}
			},
		}
	}
</script>

<style scoped>
	.firstcol {
		display: flex;
		align-items: center;
	}
	.box{
		border: 1px solid #ccc;
		width: 102px;
		height: 102px;
		font-size: 0;
	}
	
</style>
