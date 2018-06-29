import {
  queryTags,
  queryDayPv,
  queryDayUser,
  queryDayLoginUser,
  queryDayUserOpenTime,
  queryDayUseTime,
  queryDayDeviceRank,
  queryDayPvRank,
} from '../services/api';
import { formatChartData, digitToFixed } from './../utils/utils';

export default {
  namespace: 'monitor',

  state: {
    tags: [],
    monitorData: [],
    userData: [],
    loginUserData: [],
    userOpenTimeData: [],
    dayUseData: [],
    deviceRankData: [],
    pvPageData: [],
    averageOpenData: [
      {
        x: 0,
        y: 0,
      },
    ],
  },

  effects: {
    *fetchTags(_, { call, put }) {
      const response = yield call(queryTags);
      yield put({
        type: 'saveTags',
        payload: response.list,
      });
    },
    *getDayPv(action, { call, select, put }) {
      const res = yield call(queryDayPv);
      if (res && res.code == 1) {
        yield put({
          type: 'save_data',
          monitorData: formatChartData(res.object),
        });
      }
    },
    *getDayUser(action, { call, select, put }) {
      const res = yield call(queryDayUser);
      if (res) {
        let step1 = yield put({
          type: 'save_data',
          userData: formatChartData(res.object),
        });
        let step2 = yield put({
          type: 'getDayUserOpenTime',
        });
      }
    },
    *getDayLoginUser(action, { call, select, put }) {
      const res = yield call(queryDayLoginUser);
      if (res) {
        yield put({
          type: 'save_data',
          loginUserData: formatChartData(res.object),
        });
      }
    },
    *getDayUserOpenTime(action, { call, select, put }) {
      const res = yield call(queryDayUserOpenTime);
      if (res) {
        yield put({
          type: 'save_data',
          userOpenTimeData: formatChartData(res.object),
        });
        yield put({
          type: 'getAverageOpenTime',
        });
      }
    },
    *getDayUseTime(action, { call, select, put }) {
      const res = yield call(queryDayUseTime);
      if (res) {
        yield put({
          type: 'save_data',
          dayUseData: res.object,
        });
      }
    },
    *getDayDeviceRank(action, { call, select, put }) {
      const res = yield call(queryDayDeviceRank);
      if (res) {
        yield put({
          type: 'save_data',
          deviceRankData: res.object,
        });
      }
    },
    *getDayPvRank(action, { call, select, put }) {
      const res = yield call(queryDayPvRank);
      if (res) {
        yield put({
          type: 'save_data',
          pvPageData: res.object,
        });
      }
    },
    *getAverageOpenTime(action, { call, select, put }) {
      let userData = yield select(state => state.monitor.userData);
      let userOpenTimeData = yield select(state => state.monitor.userOpenTimeData);
      let arr = [];
      userData.list.map((h, index) => {
        arr.push({
          x: h.x,
          y:
            userData.list[index].y != 0
              ? userOpenTimeData.list[index].y / userData.list[index].y
              : 0,
        });
      });
      yield put({
        type: 'save_data',
        averageOpenData: arr,
      });
    },
  },

  reducers: {
    saveTags(state, action) {
      return {
        ...state,
        tags: action.payload,
      };
    },
    save_data(state, action) {
      return Object.assign({}, state, action);
    },
  },
};
