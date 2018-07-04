import { routerRedux } from 'dva/router';
import { fakeAccountLogin } from '../services/api';
import { login, register, getCaptcha, logOut } from '../services/user';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { addStorage, delAllStorage } from '../utils/utils';
import md5 from 'md5';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    captcha: '',
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
    save_data(state, action) {
      return Object.assign({}, state, action);
    },
  },
  effects: {
    // 获取验证码
    *getCaptcha(action, { call, put }) {
      const result = yield call(getCaptcha);
      yield put({
        type: 'save_data',
        captcha: result.data,
      });
    },
    *login({ payload }, { call, put }) {
      payload.password = md5(payload.password);
      const response = yield call(login, payload);
      console.log(response);
      // Login successfully
      if (response.success) {
        response.status = 'ok';
        response.type = 'account';
        response.currentAuthority = response.data.role == 2 ? 'admin' : 'user';
        //保存session
        addStorage('token', response.data.token);
        yield put({
          type: 'changeLoginStatus',
          payload: response,
        });
        reloadAuthorized();

        yield put(routerRedux.push('/dashboard/analysis'));

        //15分钟后清除token及其他本地存储
        setTimeout(() => {
          delAllStorage();
        }, 15 * 60 * 1000);
      }
    },
    *logout(_, { put, select, call }) {
      try {
        // get location pathname
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        // add the parameters in the url
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
        call(logOut);
      } finally {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            currentAuthority: 'guest',
          },
        });
        reloadAuthorized();
        yield put(routerRedux.push('/user/login'));
      }
    },
  },
};
