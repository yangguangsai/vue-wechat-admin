import axios from 'axios';

// 登录(封装)
let login = (data) => axios.post('/api/admin/login', data);

//注册 (封装)
let register = (data) => axios.post('/api/admin/register', data);

// 获取列表信息（封装）
let list = (data) => axios.get('/api/admin/list', { params: data });

// 删除列表信息(封装)
let remove = (id) => axios.delete('/api/admin', { params: id });

// 获取个人列表信息(封装)
let info = (id) => axios.get('/api/admin', { params: id });

// 修改信息(封装)
let edit = (data) => axios.put('/api/admin', data);

//外包(供外部使用)
export default {
	login,
	register,
	list,
	remove,
	info,
	edit,
}
