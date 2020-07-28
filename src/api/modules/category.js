import axios from 'axios';

//获取所有树形分类 
let allcate = (data) => axios.get('/api/category/sub', { params: data });

// 删除分类
let remove = (id) => axios.delete('/api/category', { params: id });

// 添加子分类
let insert = (data) => axios.post('/api/category', data);

// 编辑分类
let edit = (data) => axios.put('/api/category', data);

export default {
	allcate,
	remove,
	insert,
	edit,
}
