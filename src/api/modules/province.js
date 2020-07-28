import axios from 'axios';

// 获取所有省份
let provinceList = (data) => axios.get('/api/pcct/province', { params: data });

// 获取所有市区
let city = (id) => axios.get('/api/pcct/city', { params: id });

// 获取所有县区
let county = (data) => axios.get('/api/pcct/county', { params: data });


export default {
	provinceList,
	city,
	county,
}
