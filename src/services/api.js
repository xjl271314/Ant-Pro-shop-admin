import { stringify } from 'qs';
import request from '../utils/request';
import newRequest from './../utils/newRequest';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}

// 获取每日pv
export async function queryDayPv() {
  return request('/api/analysis/todayPv');
}

// 获取每日用户打开数
export async function queryDayUser() {
  return newRequest('/api/analysis/todayUser');
}

// 获取每日登录用户数
export async function queryDayLoginUser() {
  return newRequest('/api/analysis/todayLoginUser');
}

// 获取当天用户打开次数
export async function queryDayUserOpenTime() {
  return newRequest('/api/analysis/todayOpenTimes');
}

// 获取当天用户使用时间
export async function queryDayUseTime() {
  return newRequest('/api/analysis/todayUseTimes');
}

// 获取当天用户使用时间
export async function queryDayDeviceRank() {
  return newRequest('/api/analysis/todayDeviceRate');
}
// 获取当天页面访问排行榜
export async function queryDayPvRank() {
  return newRequest('/api/analysis/todayPvRate');
}

// 提交添加新产品的请求
export async function queryAddProduct(params) {
  return newRequest('/api/product/addProduct', {
    method: 'POST',
    body: params,
  });
}
// 提交添加新产品的请求
export async function queryUpdateProduct(params) {
  return newRequest('/api/product/updateProduct', {
    method: 'POST',
    body: params,
  });
}

// 获取当天页面访问排行榜
export async function queryProjectList() {
  return newRequest('/api/product/getProductList');
}

//产品详情
export async function queryProductById(params) {
  return newRequest(`/api/product/getProductDetail?${stringify(params)}`);
}
