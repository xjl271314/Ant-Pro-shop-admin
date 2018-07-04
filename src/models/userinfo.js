import { userApplyList, userRegisterPass } from '../services/user';
import moment from 'moment';
import { message } from 'antd';

export default {
  namespace: 'userinfo',
  state: {
    userList: [],
  },
  reducers: {
    save_data(state, action) {
      return Object.assign({}, state, action);
    },
  },
  effects: {
    //获取用户列表
    *getUserApplyList(action, { select, call, put }) {
      let res = yield call(userApplyList);
      if (res.code == 1) {
        yield put({
          type: 'save_data',
          userList: res.object.userList,
        });
      }
    },
    //审核通过用户
    *commitUserRegisterPass(action, { select, call, put }) {
      let res = yield call(userRegisterPass, {
        userId: action.userId,
      });
      if (res.code == 1) {
        message.success('操作成功！');
      } else {
        message.error(res.message);
      }
    },
    //删除用户
    *deleteUser(action, { select, call, put }) {
      console.log(action);
    },
  },
  subscriptions: {
    setup: function({ dispatch, history }) {
      let bool = false;
      history.listen(function(dispatch) {});
    },
  },
};
