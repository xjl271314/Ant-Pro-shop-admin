import {
  addGoodsClassAPI,
  getGoodSortsAPI,
  uploadImageAPI,
  addGoodsInfoAPI,
  getGoodsListAPI,
  deleteGoodsAPI,
  changeSaleStateAPI,
} from '../services/goods';
import { routerRedux } from 'dva/router';
import { delAllStorage, constructSortData, constructSku } from '../utils/utils';
import { message } from 'antd';

export default {
  namespace: 'goods',

  state: {
    currentStep: 0,
    goodsSort: [],
    goodsList: [],
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
    *addGoods(action, { call, put, select }) {
      let data = action.params;
      //重新构造上传的数据
      let { goods_sn, goods_weight, goods_standard_unit, goods_unit } = action.params;
      data.goods_sku = constructSku(goods_sn, goods_weight, goods_standard_unit, goods_unit);
      if (data.goods_productTime) {
        data.goods_productTime = data.goods_productTime.unix();
      }
      //提交接口
      const result = yield call(addGoodsInfoAPI, data);
      if (result && result.code == 1) {
        message.success(result.message);
        //跳转到结果页
        yield put(routerRedux.push('/goods-manage/goodsinfo-result'));
      }
    },
    //获取所有商品列表
    *getGoodsList({ params }, { call, put, select }) {
      let result = yield call(getGoodsListAPI, params);
      if (result) {
        result.data.map((h, index) => {
          h.key = index;
        });
        yield put({
          type: 'save_data',
          goodsList: result.data,
        });
      }
    },
    //删除所选商品
    *deleteGoods({ goods_sku, params }, { call, put, select }) {
      let result = yield call(deleteGoodsAPI, { goods_sku, params });
      if (result && result.code == 1) {
        message.success(result.message);
        yield put({
          type: 'getGoodsList',
        });
      }
    },
    //更改商品上下架状态
    *changeSaleState({ goods_sku, is_sale, params }, { call, put, select }) {
      let result = yield call(changeSaleStateAPI, { goods_sku, is_sale, params });
      if (result && result.code == 1) {
        message.success(result.message);
        yield put({
          type: 'getGoodsList',
        });
      }
    },
  },
};
