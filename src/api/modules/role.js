import axios from 'axios';

// 获取角色列表(封装)
let list = () => axios.get('/api/role/list');

// 修改角色信息(封装)
let edit = (id, name) => axios.put('/api/role', { id, name });

// 删除角色信息(封装)
let remove = (id) => axios.delete('/api/role', { params: id });

// 添加角色信息(封装)
let insert = (data) => axios.post('/api/role', data);

// 根据角色配置获取菜单信息
let config = (id) => axios.get('/api/role/config', { params: id });

// 为指定角色添加菜单
let addmenu = (data) => axios.post('/api/role/menu', data);

// 为指定角色删除菜单
let removemenu = (data) => axios.delete('/api/role/menu', { params: data });

export default {
	list,
	edit,
	remove,
	insert,
	config,
	addmenu,
	removemenu,
}
