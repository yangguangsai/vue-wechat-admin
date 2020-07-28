<template>
	<el-card class="box-card">
		<div slot="header" class="clearfix">
			<span>发布商品</span>
		</div>
		<el-form ref="form" :rules="rules" :model="form" label-width="100px" label-position="left">
			<el-form-item label="商品分类">
				<el-select v-model="form.cate_1st" placeholder="请选择">
					<el-option v-for="item in options_1st" :key="item.id" :label="item.name" :value="item.id"></el-option>
				</el-select>
				<el-select v-model="form.cate_2nd" placeholder="请选择">
					<el-option v-for="item in options_2nd" :key="item.id" :label="item.name" :value="item.id"></el-option>
				</el-select>
				<el-select v-model="form.cate_3rd" placeholder="请选择">
					<el-option v-for="item in options_3rd" :key="item.id" :label="item.name" :value="item.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="商品名称" prop='name'>
				<el-input v-model="form.name"></el-input>
				<div class="sub-title">商品标题名称长度至少3个字符，最长200个汉字</div>
			</el-form-item>

			<el-form-item label="商品卖点" prop='hotPoint'>
				<el-input v-model="form.hotPoint" type="textarea" :rows="2" placeholder="请输入内容"></el-input>
				<div class="sub-title">商品卖点不能超过140个汉字</div>
			</el-form-item>

			<el-form-item label="商品价格" prop='price'>
				<el-input class="small" v-model="form.price">
					<template slot="append">元</template>
				</el-input>
				<div class="sub-title">价格必须是0-999999之间的数字，且不能高于市场价</div>
				<div class="sub-title">此价格为商品实际销售价格，如果商品存在规格，改价格显示最低价格</div>
			</el-form-item>

			<el-form-item label="市场价" prop='marketPrice'>
				<el-input class="small" v-model="form.marketPrice">
					<template slot="append">元</template>
				</el-input>
				<div class="sub-title">价格必须是0-999999之间的数字，此价格仅为市场参考价，请根据实际情况认真填写</div>
			</el-form-item>

			<el-form-item label="成本价" prop="cost">
				<el-input class="small" v-model="form.cost">
					<template slot="append">元</template>
				</el-input>
				<div class="sub-title">价格必须是0-999999之间的数字，此价格为商户对所销售的商品的实际成本价进行备注记录，非必填选项，不会在前台销售页面中显示</div>
			</el-form-item>

			<el-form-item label="折扣" prop="discount">
				<el-input class="small" v-model="form.discount">
					<template slot="append">折</template>
				</el-input>
				<div class="sub-title">根据销售价与市场价比例自动生成不需要编辑</div>
			</el-form-item>

			<el-form-item label="库存货件" prop="inventory">
				<el-input value="1000" class="small" v-model="form.inventory">
					<template slot="append">件</template>
				</el-input>
				<div class="sub-title">价格必须是0-999999之间的整数</div>
				<div class="sub-title">若启动了库存配置，则系统自动计算商品的总数，此处无需卖家填写</div>
			</el-form-item>

			<el-form-item label="商品货号" prop="articleNo">
				<el-input class="small" v-model="form.articleNo"></el-input>
				<div class="sub-title">商品货号是商家管理商品的编号，买家不可见</div>
				<div class="sub-title">最多输入20个字符，只支持输入中文、字母、数字、_、/、-和小数点</div>
			</el-form-item>

			<el-form-item label="商品主图" prop="img_md">
				<SingleUpload :url='form.img_md' :action='action' @success='handleInsertSuccess($event)' @remove='form.img_md=""'></SingleUpload>
				<div class="sub-title">上传商品默认主图，如多规格时将默认图片或分规格上传规格主图，支持jpg、if、png格式上传或从图片空间选中，建议使用尺寸
					800*800像素以上，大小不超过1M的正方形图片，上传后的图片将自动保存在图片空间的默认分类中</div>
			</el-form-item>

			<el-form-item label="商品轮播图" prop="slider">
				<el-upload action="/api/upload/slider" list-type="picture-card" :on-success="sliderSuccess">
					<i class="el-icon-plus"></i>
				</el-upload>
				<el-dialog :visible.sync="dialogVisible">
					<img width="100%" :src="form.slider" alt="">
				</el-dialog>
				<div class="sub-title">上传商品默认主图，如多规格时将默认图片或分规格上传规格主图，支持jpg、if、png格式上传或从图片空间选中，建议使用尺寸
					800*800像素以上，大小不超过1M的正方形图片，上传后的图片将自动保存在图片空间的默认分类中</div>
			</el-form-item>

			<div class="section-title">商品详情描述</div>

			<el-form-item label="商品品牌" prop="brand">
				<el-input v-model="form.brand"></el-input>
			</el-form-item>

			<el-form-item label="商品描述">
				<div ref="editor" style="text-align:left"></div><!-- ref跟id一样的特性  具有唯一性 不可重复 -->
			</el-form-item>

			<div class="section-title">商品物流信息</div>

			<el-form-item label="所在地">
				<el-select v-model="form.province_id" placeholder="请选择">
					<el-option v-for="item in province" :key="item.province_id" :label="item.name" :value="item.province_id"></el-option>
				</el-select>
				<el-select v-model="form.city_id" placeholder="请选择">
					<el-option v-for="item in city" :key="item.city_id" :label="item.name" :value="item.city_id"></el-option>
				</el-select>
				<el-select v-model="form.county_id" placeholder="请选择">
					<el-option v-for="item in county" :key="item.county_id" :label="item.name" :value="item.county_id"></el-option>
				</el-select>
			</el-form-item>

			<el-form-item label="运费" prop="freight">
				<el-input value="0" class="small" v-model="form.freight">
					<template slot="append">元</template>
				</el-input>
				<div class="sub-title">运费设为0，前台商品将显示免运费</div>
			</el-form-item>

			<el-form-item>
				<el-button type="success" @click="submitForm('form')">提交</el-button>
			</el-form-item>

		</el-form>
	</el-card>
</template>

<script>
	import { Goods } from '@/api/index';
	import { Category } from '@/api/index';
	import { Province } from '@/api/index';
	import E from 'wangeditor';
	import SingleUpload from '@/components/SingleUpload.vue';

	export default {
		components: {
			SingleUpload
		},
		data() {
			return {
				action: '/api/upload/goods', //商品主图ajax

				//省市区三个数组
				province: [],
				city: [],
				county: [],
				//下拉菜单的三个数组
				options_1st: [],
				options_2nd: [],
				options_3rd: [],

				dialogVisible: false, //轮播图

				form: {
					cate_1st: '',
					cate_2nd: '',
					cate_3rd: '',
					name: '',
					hotPoint: '',
					price: '',
					marketPrice: '',
					cost: '',
					discount: '',
					inventory: '',
					articleNo: '',
					img_lg: '',
					img_md: '',
					slider: '',
					brand: '',
					detail: '',
					freight: '',
					province_id: '110000000000', //省级id
					city_id: '110100000000', //市级id
					county_id: '110101000000', //县级id
				},
				rules: {
					name: [
						{ required: true, message: '请输入商品名称', trigger: 'blur' },
						{ min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }
					],

					hotPoint: [
						{ required: true, message: '请输入商品卖点', trigger: 'blur' },
						{ min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }
					],

					price: [
						{ required: true, message: '请输入价格', trigger: 'blur' },
						{ min: 0, max: 99999, message: '价格在 0 到 99999 之间', trigger: 'blur' }
					],

					marketPrice: [
						{ required: true, message: '请输入市场价', trigger: 'blur' },
						{ min: 0, max: 99999, message: '市场价格在 0 到 99999 之间', trigger: 'blur' }
					],

					cost: [
						{ required: true, message: '请输入成本价', trigger: 'blur' },
						{ min: 0, max: 99999, message: '市场价格在 0 到 99999 之间', trigger: 'blur' }
					],

					inventory: [
						{ required: true, message: '请输入库存货件', trigger: 'blur' },
						{ min: 0, max: 99999, message: '市场价格在 0 到 99999 之间', trigger: 'blur' }
					],

					img_md: [
						{ required: true, message: '请选择商品主图', trigger: 'change' }
					],

					slider: [
						{ required: true, message: '请选择商品轮播图', trigger: 'change' }
					],

					brand: [
						{ required: true, message: '请选择商品品牌', trigger: 'blur' },
						{ min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
					],
					freight: [
						{ required: true, message: '请输入运费', trigger: 'blur' },
						{ min: 1, max: 1000, message: '运费在 1 到 1000 之间', trigger: 'blur' }
					]
				}
			}
		},
		mounted() {
			var editor = new E(this.$refs.editor)
			editor.customConfig.onchange = (html) => {
				this.form.detail = html
			}
			//配置图片上传
			editor.customConfig.uploadImgServer = '/api/upload/editor';
			//配置上传 fileName
			editor.customConfig.uploadFileName = 'file';
			
			editor.create();
		},
		async created() {
			//三级分类
			let options = await this.loadSubcate(1);
			this.options_1st = options;
			//根据一级分类的id自动选中二级分类的第一个值,默认选择第一项
			this.form.cate_1st = options[0].id;

			//省市区
			let provinceList = await Province.provinceList();
			this.province = provinceList.data;
			//市级
			let cityList = await Province.city({ id: this.form.province_id });
			this.city = cityList.data;
			//县区
			let countyList = await Province.county({ id: this.form.city_id });
			this.county = countyList.data;
		},
		watch: {
			'form.cate_1st': async function(val) {
				//获取二级分类
				let options = await this.loadSubcate(val);
				//给二级分类数组赋值
				this.options_2nd = options;
				//根据一级分类的id自动选中二级分类的第一个值,默认选择第一项
				this.form.cate_2nd = options[0].id;
			},
			'form.cate_2nd': async function(val) {
				//获取三级分类
				let options = await this.loadSubcate(val);
				//给三级分类数组赋值
				this.options_3rd = options;
				//根据二级分类的id自动选中三级分类的第一个值,默认选择第一项
				if (val == 0) {
					this.form.cate_3rd = 0;
				} else {
					this.form.cate_3rd = options[0].id
				}
			},
			//省市区三级
			'form.province_id': async function(val) { /* 就是Province的id*/
				//获取市分类
				let { data, status } = await Province.city({ id: val });
				//给二级分类数组赋值
				if (status) {
					this.city = data;
					//根据一级分类的id自动选中二级分类的第一个值,默认选择第一项
					this.form.city_id = data[0].id;
				}
			},
			'form.city_id': async function(val) {
				//获取县分类
				let { status, data } = await Province.county({ id: val });
				//给三级分类数组赋值
				this.county = data;
				if (status) {
					this.county = data;
					//根据一级分类的id自动选中二级分类的第一个值,默认选择第一项
					this.form.county_id = data[0].id;
				}
			},
		},
		methods: {
			async loadSubcate(id) {
				//父级节点pId
				let pId = id;
				//获取子级节点
				let { status, data } = await Category.allcate({ pId });
				if (status) {
					return data;
				}
			},
			//上传商品主图成功
			handleInsertSuccess(res) {
				this.form.img_md = res.mdImg;
			},

			//上传轮播图成功
			sliderSuccess(res) {
				this.form.slider = res.src;
			},

			//发布成功
			submitForm(formName) {
				this.$refs[formName].validate(async (valid) => {
					if (valid) {
						let { status, msg } = await Goods.release(this.form);
						if (status) {
							this.$message.success('发布成功!');
							//跳转页面
							this.$router.push({ path: '/goods/list' });
						}
					} else {
						this.$message.info('发布失败!');
						return false;
					}
				});
			},
		}
	}
</script>

<style scoped>
	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}

	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 178px;
		height: 178px;
		line-height: 178px;
		text-align: center;
	}

	.avatar {
		width: 178px;
		height: 178px;
		display: block;
	}

	/* 样式 */
	.section-title {
		background-color: #f5f5f5;
		padding: 10px;
		margin-bottom: 10px;
	}


	.sub-title {
		font-size: 12px;
		color: #999;
	}

	.small {
		width: 200px;
	}
</style>
