import {
  queryProjectNotice,
  queryAddProduct,
  queryProjectList,
  queryProductById,
  queryUpdateProduct,
} from '../services/api';
import { routerRedux } from 'dva/router';
import { message } from 'antd';
export default {
  namespace: 'project',

  state: {
    notice: [],
    projectList: [],
    productDetail: [],
    config: '',
  },
  reducers: {
    saveNotice(state, action) {
      return {
        ...state,
        notice: action.payload,
      };
    },
    save_data(state, action) {
      return Object.assign({}, state, action);
    },
  },
  effects: {
    *fetchNotice(_, { call, put }) {
      const response = yield call(queryProjectNotice);
      yield put({
        type: 'saveNotice',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *submitAddProject(action, { call, select, put }) {
      let _config = action.data.config.replace(new RegExp('\n', 'gm'), '');
      let res = yield call(queryAddProduct, {
        productName: action.data.basic.productName,
        spmA: action.data.basic.spmA,
        config: JSON.stringify(_config),
      });
      if (res) {
        message.success('添加成功');
        yield put(routerRedux.push('/projectManage/myProjectManage'));
      }
    },
    *submitUpdateProject(action, { call, select, put }) {
      let _config = action.data.config.replace(new RegExp('\n', 'gm'), '');
      let res = yield call(queryUpdateProduct, {
        productName: action.data.basic.productName,
        productId: action.data.product_id,
        spmA: action.data.basic.spmA,
        config: JSON.stringify(_config),
      });
      if (res) {
        message.success('修改成功');
        yield put(routerRedux.push('/projectManage/myProjectManage'));
      }
    },
    *getProjectList(action, { call, select, put }) {
      let res = yield call(queryProjectList);
      if (res) {
        yield put({
          type: 'save_data',
          projectList: res.object,
        });
      }
    },
    *getProductById(action, { call, select, put }) {
      let res = yield call(queryProductById, { productId: action.id });
      if (res) {
        yield put({
          type: 'save_data',
          productDetail: res.object,
          config: res.object.config,
        });
        action.success();
      }
    },
    *changeValue(action, { select, put }) {
      let _item = yield select(state => state.project[action.item]);
      yield put({
        type: 'save_data',
        [_item]: action.e,
      });
    },
  },
};
