import axios from 'axios';

// 获取列表 (封装)
let list = (data) => axios.get('/api/admin/goods/list', { params: data });

// 删除商品 (封装)
let remove = (id) => axios.delete('/api/admin/goods', { params: id }); //axios支持RestFul API 风格

// 获取商品详情 (封装)
let detail = (data) => axios.get('/api/admin/goods', { params: data });

// 发布商品(封装)
let release = (data) => axios.post('/api/admin/goods', data);

// 编辑商品(封装)
let edit = (data) => axios.put('/api/admin/goods', data);

export default {
	list,
	remove,
	detail,
	release,
	edit,
}
