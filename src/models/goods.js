import { addGoodsClassAPI, getGoodSortsAPI, uploadImageAPI } from '../services/goods';
import { routerRedux } from 'dva/router';
import { delAllStorage, constructSortData } from '../utils/utils';
import { message } from 'antd';
export default {
  namespace: 'goods',

  state: {
    currentStep: 0,
    goodsSort: [],
  },
  reducers: {
    save_data(state, action) {
      return Object.assign({}, state, action);
    },
  },
  effects: {
    // 新增商品分类
    *addGoodsClass({ params }, { call, put }) {
      const result = yield call(addGoodsClassAPI, params);
      if (result) {
        message.success('添加分类成功');
        yield put({
          type: 'save_data',
          currentStep: 1,
        });
        yield put(routerRedux.push('/goods-manage/goodsinfo-edit'));
      }
    },
    *goInfoEdit(_, { put, select }) {
      yield put({
        type: 'save_data',
        currentStep: 1,
      });
      yield put(routerRedux.push('/goods-manage/goodsinfo-edit'));
    },
    *changeValue({ item, e }, { select, put }) {
      let _item = yield select(state => state.goods[item]);
      yield put({
        type: 'save_data',
        [_item]: e,
      });
    },
    // 获取所有商品分类
    *getGoodSorts(_, { call, put, select }) {
      const result = yield call(getGoodSortsAPI);
      if (result && result.data && result.data.length > 0) {
        // 构造数据
        const data = constructSortData(result.data);
        yield put({
          type: 'save_data',
          goodsSort: data,
        });
      }
    },
    // 上传商品图片
    *uploadImage({ data }, { call, put, select }) {
      // console.log(data)
      // var formData = new FormData();
      // let file = {
      //     filename :data.file.name
      // }
      // formData.append('file', file)
      // const result = yield call(uploadImageAPI,{formData});
    },
  },
};
