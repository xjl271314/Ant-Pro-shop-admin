import { stringify } from 'qs';
import request from './request';
import { message } from 'antd';

export default async function newRequest(url, options) {
  let res = null;
  try {
    res = await request(url, options);
    if (res && res.code == 1) {
      // message.success(res.message);
      return res;
    } else if (res && res.code != 1 && res.message != '') {
      message.error(res.message);
      return false;
    }
  } catch (err) {
    console.log(err.message);
    throw err;
    return false;
  }
}
