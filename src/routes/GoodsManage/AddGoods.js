import React, { PureComponent } from 'react';
import numeral from 'numeral';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Row, Col, Form, Steps, Card, Input, Button, Icon } from 'antd';

import styles from './AddGoods.less';
const Step = Steps.Step;
const FormItem = Form.Item;

/* eslint react/no-array-index-key: 0 */
@Form.create()
@connect(({ goods }) => ({
  currentStep: goods.currentStep,
}))
export default class AddGoods extends PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'goods/changeValue',
      item: 'currentStep',
      e: 0,
    });
  }

  handleSubmit = () => {
    const { form, dispatch } = this.props;
    //setTimeout 用于保证获取表单值是在所有表单字段更新完毕的时候
    setTimeout(() => {
      form.validateFields((err, value) => {
        if (!err) {
          console.log('准备提交', value);
          //提交分类
          dispatch({
            type: 'goods/addGoodsClass',
            params: {
              ...value,
            },
          });
          // .then((res) => {
          //     if (res) {
          //         this.props.history.push({
          //             pathname: '/goods-manage/goodsinfo-edit',
          //             state: {
          //                 defaultSort: { ...value }
          //             }
          //         })
          //     }
          // });
        }
      });
    }, 0);
  };

  next = () => {
    this.props.dispatch({
      type: 'goods/goInfoEdit',
    });
  };
  render() {
    const { form, currentStep } = this.props;
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

    const formThreeLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 10 },
        sm: { span: 8 },
        md: { span: 6 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    return (
      <div className={styles.AddGoodsContainer}>
        <Card bordered={false}>
          <h2>商品添加详细步骤</h2>
          <Steps current={0}>
            <Step title="填选商品分类" />
            <Step title="编辑商品信息" />
            <Step title="发布商品" />
          </Steps>

          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <FormItem {...formThreeLayout} label="商品一级类目">
              {getFieldDecorator('goodsCat', {
                rules: [
                  {
                    required: true,
                    message: '请填写商品分类信息',
                  },
                ],
              })(<Input placeholder="填写一个商品一级类目吧" />)}
            </FormItem>

            <FormItem {...formThreeLayout} label="商品二级类目">
              {getFieldDecorator('goodsBrand', {
                rules: [
                  {
                    required: true,
                    message: '请填写商品分类信息',
                  },
                ],
              })(<Input placeholder="填写一个商品二级类目吧" />)}
            </FormItem>

            <FormItem {...formThreeLayout} label="商品三级类目">
              {getFieldDecorator('goodsSort', {
                rules: [
                  {
                    required: true,
                    message: '请填写商品分类信息',
                  },
                ],
              })(<Input placeholder="填写一个商品三级类目吧" />)}
            </FormItem>

            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={false}>
                提交
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.next}>
                直接下一步<Icon type="right" />
              </Button>
            </FormItem>
          </Form>
        </Card>
      </div>
    );
  }
}
