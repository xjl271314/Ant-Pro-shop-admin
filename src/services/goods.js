import request from '../utils/request';
import { stringify } from 'qs';
import newRequest from './../utils/newRequest';

// 添加商品分类
export async function addGoodsClassAPI(params) {
  return newRequest('/api/goods/addClass', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 获取所有商品分类

export async function getGoodSortsAPI(params) {
  return newRequest('/api/goods/getClass');
}

//上传商品图片
export async function uploadImageAPI(params) {
  return newRequest('/api/goods/imgUpload', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
      formData: {},
    },
  });
}

//新增商品信息基础版本
export async function addGoodsInfoAPI(params) {
  return newRequest('/api/goods/addGoods', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

//获取我的所有商品信息列表
export async function getGoodsListAPI(params) {
  return newRequest('/api/goods/getList', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

//删除指定商品
export async function deleteGoodsAPI(params) {
  return newRequest('/api/goods/delete', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

//修改指定商品上下架状态
export async function changeSaleStateAPI(params) {
  return newRequest('/api/goods/changeState', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}
