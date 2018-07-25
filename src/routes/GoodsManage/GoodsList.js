import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
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
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './GoodsList.less';
import { Link } from 'dva/router';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'success'];
const status = ['下架', '正常销售'];

@connect(({ goods, loading }) => ({
  goodsList: goods.goodsList,
  loading: false,
}))
@Form.create()
export default class GoodsList extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
  };
  componentDidMount = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'goods/getGoodsList',
    });
  };

  //根据条件进行商品搜索
  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };
      dispatch({
        type: 'goods/getGoodsList',
        params: values,
      });
      this.setState({
        formValues: values,
      });
    });
  };
  //重置搜索表单
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();

    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'goods/getGoodsList',
    });
  };
  //处理选中商品
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };
  //处理条件结果 分页信息 条件信息 排序信息
  handleStandardTableChange = (pagination, filtersArg) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current - 1,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };

    dispatch({
      type: 'goods/getGoodsList',
      params: params,
    });
  };
  //构造搜索表单
  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="商品编码">
              {getFieldDecorator('goods_sn')(<Input placeholder="商品编码" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="商品名称">
              {getFieldDecorator('goods_name')(<Input placeholder="商品编码" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="商品净含量">
              {getFieldDecorator('goods_weight')(<InputNumber style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="规格单位">
              {getFieldDecorator('goods_standard_unit')(<Input placeholder="商品规格单位" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="包装形式">
              {getFieldDecorator('goods_unit')(<Input placeholder="商品包装形式" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
  //编辑商品
  edit = row => {
    //跳转到商品详情页面
  };
  //上下架操作
  changeSaleState = (row, state) => {
    this.props.dispatch({
      type: 'goods/changeSaleState',
      goods_sku: row.goods_sku,
      is_sale: state,
    });
  };
  //删除商品操作
  delete = row => {
    this.props.dispatch({
      type: 'goods/deleteGoods',
      goods_sku: row.goods_sku,
    });
  };
  render() {
    const { goodsList, loading } = this.props;
    const { selectedRows } = this.state;
    const columns = [
      {
        title: '商品编码',
        dataIndex: 'goods_sn',
      },
      {
        title: '商品名称',
        dataIndex: 'goods_name',
      },
      {
        title: '商品净含量',
        dataIndex: 'goods_weight',
        align: 'center',
      },
      {
        title: '规格单位',
        dataIndex: 'goods_standard_unit',
        align: 'center',
      },
      {
        title: '包装形式',
        dataIndex: 'goods_unit',
        align: 'center',
      },
      {
        title: '状态',
        dataIndex: 'is_sale',
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
        onFilter: (value, record) => record.is_sale.toString() === value,
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]} />;
        },
      },
      {
        title: '操作',
        render: row => (
          <Fragment>
            <span className="span-a-normal" onClick={this.edit.bind(this, row)}>
              编辑
            </span>
            <Divider type="vertical" />
            {row.is_sale == 1 ? (
              <span className="span-a-normal" onClick={this.changeSaleState.bind(this, row, -1)}>
                下架
              </span>
            ) : (
              <span className="span-a-normal" onClick={this.changeSaleState.bind(this, row, 1)}>
                上架
              </span>
            )}
            <Divider type="vertical" />
            <Popconfirm
              title={`确认删除: ${row.goods_name}`}
              onConfirm={this.delete.bind(this, row)}
              okText="确定"
              cancelText="取消"
            >
              <span className="span-a-attention">删除</span>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableListForm}>{this.renderAdvancedForm()}</div>
          <div className={styles.tableListOperator}>
            {selectedRows.length > 0 && (
              <span>
                <Button type="primary">批量上架</Button>
                <Button>批量下架</Button>
                <Button type="danger">批量删除</Button>
              </span>
            )}
          </div>
          <StandardTable
            selectedRows={selectedRows}
            loading={loading}
            data={goodsList}
            columns={columns}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
