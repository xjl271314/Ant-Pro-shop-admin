import { fakeRegister } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { register, getCaptcha} from '../services/user';
import md5 from 'md5'

export default {
  namespace: 'register',

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
          type: 'registerCaptcha',
          payload: response.object,
        });
      }
    },
    *submit({ payload }, { call, put }) {
      payload.password = md5(payload.password)
      const response = yield call(register, payload);
      yield put({
        type: 'registerHandle',
        payload: response,
      });
    },
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
    registerCaptcha(state, {payload}) {
      return {
        ...state,
        captcha: payload
      }
    }
  },
};
