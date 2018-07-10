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
            formData:{

            }
        },
    });
}

