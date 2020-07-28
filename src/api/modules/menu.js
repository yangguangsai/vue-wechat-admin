import axios from 'axios';

// 获取子菜单
let list = (data) => axios.get('/api/menu/sub', { params: data });

// 设置子菜单图标
let icon = (data) => axios.put('/api/menu/icon', data);

// 删除子菜单
let remove = (id) => axios.delete('/api/menu', { params: id });

// 添加子节点
let insert = (data) => axios.post('/api/menu', data);

// 更新子菜单
let edit = (data) => axios.put('/api/menu', { params: data });

//获取所有icon图标
let iconList = (data) => axios.get('/api/admin/icon/list', { params: data });

export default {
	list,
	icon,
	remove,
	insert,
	edit,
	iconList,
}
