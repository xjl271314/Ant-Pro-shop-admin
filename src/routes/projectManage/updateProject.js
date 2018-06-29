import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Row, Col, Card, Icon, Button, List, Avatar, Form, Input, message } from 'antd';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/javascript-hint.js';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './updateProject.less';

const FormItem = Form.Item;
const options = {
  lineNumbers: true, //显示行号
  extraKeys: { Ctrl: 'autocomplete' }, //自动提示配置
  mode: { name: 'javascript' }, //定义mode
  lineSeparator: '\n', //指定换行符
  json: true,
  height: 300,
};

const breadcrumbList = [{ title: '首页' }, { title: '项目管理' }, { title: '修改项目配置' }];
@connect(({ loading, project }) => ({
  loading: loading.effects['project/getProductById'],
  productDetail: project.productDetail,
  config: project.config,
}))
@Form.create()
export default class updateProject extends Component {
  state = {
    config: '',
  };
  product_id = '5b1111cf459db9185aaccc87';
  componentDidMount = () => {
    // this.product_id = this.props.location.state.product_id;
    this.getDefault();
  };

  getDefault() {
    //根据id获取详情
    this.props.dispatch({
      type: 'project/getProductById',
      id: this.product_id,
      success: () => {
        let { productDetail } = this.props;
        //设置默认表单

        this.props.form.setFields({
          productName: {
            value: productDetail.productName,
          },
        });
        this.props.form.setFields({
          spmA: {
            value: productDetail.spmA,
          },
        });

        this.setState({
          config: JSON.parse(productDetail.config),
        });
      },
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'project/submitUpdateProject',
          data: {
            basic: values,
            config: this.state.config,
            product_id: this.product_id,
          },
          success: () => {
            setTimeout(() => {
              this.props.history.push('/projectManage/myProjectManage');
            }, 200);
          },
        });
      }
    });
  };
  render() {
    const { loading, productDetail } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    return (
      <PageHeaderLayout breadcrumbList={breadcrumbList}>
        <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
          <FormItem {...formItemLayout} label="产品名称">
            {getFieldDecorator('productName', {
              rules: [
                {
                  required: true,
                  message: '请输入要添加的产品名称',
                },
              ],
            })(<Input placeholder="给产品起个响亮的名字吧" />)}
          </FormItem>

          <FormItem {...formItemLayout} label="spmA">
            {getFieldDecorator('spmA', {
              rules: [
                {
                  required: true,
                  message: '埋点编号为数字',
                },
              ],
            })(<Input placeholder="请输入产品的埋点编号" />)}
          </FormItem>
          <CodeMirror
            value={this.state.config}
            options={options}
            onBeforeChange={(editor, data, value) => {
              this.setState({
                config: value,
              });
            }}
            onChange={(editor, data, value) => {
              this.setState({
                config: value,
              });
            }}
          />
          <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
            <Button type="primary" htmlType="submit">
              提交
            </Button>

            <Button
              type="default"
              style={{ marginLeft: 20 }}
              onClick={() => {
                this.props.history.goBack();
              }}
            >
              返回
            </Button>
          </FormItem>
        </Form>
      </PageHeaderLayout>
    );
  }
}
