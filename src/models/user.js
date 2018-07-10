import { query as queryUsers, queryCurrent } from '../services/user';
import { routerRedux } from 'dva/router';
import { delAllStorage } from '../utils/utils';
export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      if (response) {
        yield put({
          type: 'save_data',
          currentUser: response.data,
        });
      } else {
        delAllStorage();
        yield put(routerRedux.push('/user/login'));
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    save_data(state, action) {
      return Object.assign({}, state, action);
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};
