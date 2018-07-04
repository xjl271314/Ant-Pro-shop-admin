import { fakeRegister } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { register, getCaptcha } from '../services/user';
import md5 from 'md5';

export default {
  namespace: 'register',

  state: {
    status: undefined,
    captcha: '',
  },
  reducers: {
    registerHandle(state, { payload }) {
      setAuthority('user');
      reloadAuthorized();
      return {
        ...state,
        status: payload.status,
      };
    },
    save_data(state, action) {
      return Object.assign({}, state, action);
    },
  },
  effects: {
    //获取验证码
    *getCaptcha(_, { call, put }) {
      const result = yield call(getCaptcha);
      yield put({
        type: 'save_data',
        captcha: result.data,
      });
    },
    //提交注册请求
    *submit({ payload }, { call, put }) {
      payload.password = md5(payload.password);
      payload.confirmPassword = md5(payload.confirmPassword);
      const response = yield call(register, payload);
      if (response) {
        yield put({
          type: 'registerHandle',
          payload: response,
        });
      } else {
        yield put({
          type: 'getCaptcha',
        });
      }
    },
  },
};
