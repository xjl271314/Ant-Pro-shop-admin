import { routerRedux } from 'dva/router';
import { fakeAccountLogin } from '../services/api';
import { login, register, getCaptcha, logOut } from '../services/user';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import md5 from 'md5'

export default {
  namespace: 'login',

  state: {
    status: undefined,
    captcha: ''
  },

  effects: {
    *getCaptcha(_, { call, put }) {
      const response = yield call(getCaptcha);
      // Login successfully

      if (response.success) {
        yield put({
          type: 'loginCaptcha',
          payload: response.object,
        });
      }
    },
    *login({ payload }, { call, put }) {
      payload.password = md5(payload.password)
      const response = yield call(login, payload);
      // Login successfully
      if (response.success) {
        response.status = 'ok'
        response.type = 'account'
        response.currentAuthority = response.object.role

        yield put({
          type: 'changeLoginStatus',
          payload: response,
        });
        reloadAuthorized();
        
        yield put(routerRedux.push('/'));
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

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
    loginCaptcha(state, {payload}) {
      return {
        ...state,
        captcha: payload
      }
    }
  },
};
