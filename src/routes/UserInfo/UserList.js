import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Popconfirm,
} from 'antd';
import moment from 'moment';

import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './UserList.less';

const confirm = Modal.confirm;
const statusMap = ['error', 'success'];
const status = ['待审核', '启用'];
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ userinfo, loading }) => ({
  userinfo,
  loading: loading.effects['userinfo/getUserApplyList'],
}))
@Form.create()
export default class UserList extends Component {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
  };

  componentDidMount = () => {
    // 调取用户列表
    this.props.dispatch({
      type: 'userinfo/getUserApplyList',
    });
  };

  handleSelectRows = rows => {
    console.log('select');
    this.setState({
      selectedRows: rows,
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, loading } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
  };
  //审核通过
  handleVerify = user => {
    this.props.dispatch({
      type: 'userinfo/commitUserRegisterPass',
      userId: user.userId,
    });
  };

  handlerDelete = user => {
    confirm({
      title: `确认删除用户${user.nickName}?`,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        // this.props.dispatch({
        //   type: 'userinfo/deleteUser',
        //   userId: user.userId,
        // });
      },
    });
  };

  render() {
    const { selectedRows, modalVisible } = this.state;
    const { userList } = this.props.userinfo;
    const { loading } = this.props;
    const columns = [
      {
        title: '管理员昵称',
        dataIndex: 'nickName',
      },
      {
        title: '管理员账号',
        dataIndex: 'email',
      },
      {
        title: '管理员权限',
        dataIndex: 'role',
      },
      {
        title: '管理员注册时间',
        dataIndex: 'registerTime',
        render: val => moment(val).format('YYYY-MM-DD HH:mm:SS'),
      },
      {
        title: '启用状态',
        dataIndex: 'status',
        filters: [
          {
            text: status[0],
            value: 0,
          },
          {
            text: status[1],
            value: 1,
          },
        ],
        onFilter: (value, record) => record.status.toString() === value,
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]} />;
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (e, item) => (
          <Fragment>
            <a href="javascript:void(0)" onClick={this.handlerDelete.bind(this, item)}>
              删除
            </a>
            {item.status != 1 ? (
              <div>
                <Divider type="vertical" />
                <Popconfirm
                  title="确认审核通过?"
                  onConfirm={this.handleVerify.bind(this, item)}
                  onCancel={() => {}}
                  okText="确认"
                  cancelText="取消"
                >
                  <a href="javascript:void(0)">审核</a>
                </Popconfirm>
              </div>
            ) : null}
          </Fragment>
        ),
      },
    ];

    return (
      <div className={styles.main}>
        <PageHeaderLayout title="用户列表">
          <Card bordered={false}>
            <div className={styles.tableList}>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading}
                data={userList}
                columns={columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
            </div>
          </Card>
        </PageHeaderLayout>
      </div>
    );
  }
}
