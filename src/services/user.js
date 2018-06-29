import request from '../utils/request';
import { stringify } from 'qs';
import newRequest from './../utils/newRequest';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/user/getUserInfo');
}

// 用户登录
export async function login(params) {
  return newRequest('/api/user/login', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 用户注册
export async function register(params) {
  return request('/api/user/register', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 用户注册获取验证码
export async function getCaptcha() {
  return request('/api/user/getCaptcha');
}

// 用户登出
export async function logOut() {
  return request('/api/user/logOut');
}

// 用户列表获取
export async function userApplyList() {
  return request('/api/user/getUserList');
}

// 用户审核通过
export async function userRegisterPass(params) {
  return request(`/api/user/registerPass?${stringify(params)}`);
}
