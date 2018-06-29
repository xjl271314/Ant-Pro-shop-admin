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
  json: true,
  height: 300,
};

const pageHeaderContent = (
  <div className={styles.pageHeaderContent}>
    <p>我们需要在下列的文本编辑器中配置一段json文本来添加我们的项目。</p>
    <p>
      譬如：<br />
      <span style={{ display: 'inline-block', width: '2em' }} />&#123;<br />
      <span style={{ display: 'inline-block', width: '4em' }} />"1000":&#123;<br />
      <span style={{ display: 'inline-block', width: '8em' }} />"path":"/login",<br />
      <span style={{ display: 'inline-block', width: '8em' }} />"name":"登录页"<br />
      <span style={{ display: 'inline-block', width: '6em' }} /> &#125;<br />
      <span style={{ display: 'inline-block', width: '2em' }} /> &#125;
    </p>
  </div>
);
@connect(({ loading }) => ({
  submitting: loading.effects['project/submitAddProject'],
}))
@Form.create()
export default class productDetail extends Component {
  state = {
    config: '',
  };
  componentDidMount = () => {
    let product_id = this.props;
    console.log(product_id);
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
      }
    });
  };
  render() {
    const { loading } = this.props;
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
      <PageHeaderLayout content={pageHeaderContent}>
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
              this.setState({ config: value });
            }}
            onChange={(editor, data, value) => {
              this.setState({ config: value });
            }}
          />
          <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </FormItem>
        </Form>
      </PageHeaderLayout>
    );
  }
}
