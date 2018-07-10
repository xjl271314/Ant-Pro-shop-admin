import React, { PureComponent } from 'react';
import numeral from 'numeral';
import { connect } from 'dva';
import {
  Row,
  Col,
  Form,
  Steps,
  Card,
  Input,
  Button,
  Cascader,
  Icon,
  Upload,
  Modal,
  Switch,
  Collapse,
} from 'antd';
import { getBase64 } from './../../utils/utils';
import styles from './AddGoodsInfo.less';
const Step = Steps.Step;
const FormItem = Form.Item;
const Panel = Collapse.Panel;

// var E = require('wangeditor')  // 使用 npm 安装

// // 创建编辑器
// var editor = new E('#editor')
// editor.create()

/* eslint react/no-array-index-key: 0 */
@Form.create()
@connect(({ goods }) => ({
  currentStep: goods.currentStep,
  goodsSort: goods.goodsSort,
}))
export default class AddGoodsInfo extends PureComponent {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [
      //     {
      //     uid: -1,
      //     name: 'xxx.png',
      //     status: 'done',
      //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      // }
    ],
    imageUrl: '',
    imageFile: [],
  };

  componentDidMount = () => {
    let params = this.props.history.location.state;
    if (params && params.defaultSort) {
      //把默认值赋值给默认分类
      this.defaultSort = [
        params.defaultSort.goodsCat,
        params.defaultSort.goodsBrand,
        params.defaultSort.goodsSort,
      ];
    } else {
      //获取所有已经存在分类
      this.props.dispatch({
        type: 'goods/getGoodSorts',
      });
    }
  };

  filter = (inputValue, path) => {
    return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
  };
  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };
  handleChange = ({ file, fileList, e }) => {
    this.setState({ fileList });
  };
  render() {
    const { form, currentStep, goodsSort } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { previewVisible, previewImage, fileList } = this.state;
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
        xs: { span: 4 },
        sm: { span: 4 },
        md: { span: 4 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div>Upload</div>
      </div>
    );
    return (
      <div className={styles.AddGoodsContainer}>
        <Card bordered={false}>
          <h2>商品详情编辑</h2>
          <Steps current={1}>
            <Step title="填选商品分类" />
            <Step title="编辑商品信息" />
            <Step title="发布商品" />
          </Steps>

          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <Collapse defaultActiveKey={['1']}>
              <Panel header="商品基本信息" key="1">
                <FormItem {...formItemLayout} label="商品分类">
                  {getFieldDecorator('goodsCat', {
                    rules: [
                      {
                        required: true,
                        message: '请填选商品分类',
                      },
                    ],
                    initialValue: this.defaultSort,
                  })(
                    <Cascader
                      options={goodsSort}
                      onChange={e => {
                        console.log('onchange', e);
                      }}
                      placeholder="Please select"
                      showSearch={this.filter}
                    />
                  )}
                </FormItem>

                <FormItem {...formItemLayout} label="商品名称">
                  {getFieldDecorator('goodsName', {
                    rules: [
                      {
                        required: true,
                        message: '请填写商品名称',
                      },
                    ],
                  })(<Input placeholder="商品名称" />)}
                </FormItem>

                <FormItem {...formItemLayout} label="商品编码">
                  {getFieldDecorator('goodsSn', {
                    rules: [
                      {
                        required: true,
                        message: '请填写商品编码',
                      },
                    ],
                  })(<Input placeholder="商品编码请输入国际编码" />)}
                </FormItem>

                <FormItem {...formItemLayout} label="商品图像">
                  {getFieldDecorator('goodsImg', {
                    rules: [
                      {
                        required: true,
                        message: '请选择商品的图像',
                      },
                    ],
                  })(
                    <div className="clearfix">
                      <Upload
                        name="file"
                        action="http://localhost:8000/api/goods/imgUpload"
                        accept="image/*"
                        withCredentials
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={this.handlePreview}
                        onChange={this.handleChange}
                      >
                        {fileList.length >= 10 ? null : uploadButton}
                      </Upload>

                      <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                      </Modal>
                    </div>
                  )}
                </FormItem>

                <FormItem {...formItemLayout} label="商品详情">
                  {getFieldDecorator('goodsDetail', {
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  })(<div id="editor" />)}
                </FormItem>
              </Panel>

              <Panel header="商品销售信息" key="2">
                <FormItem {...formThreeLayout} label="商品进价">
                  {getFieldDecorator('buying_price', {
                    rules: [
                      {
                        required: true,
                        message: '请填写商品进价',
                      },
                    ],
                  })(<Input placeholder="商品进货价格" />)}
                </FormItem>

                <FormItem {...formThreeLayout} label="商品零售价">
                  {getFieldDecorator('normal_price', {
                    rules: [
                      {
                        required: true,
                        message: '请填写商品零售价',
                      },
                    ],
                  })(<Input placeholder="商品正常零售价格" />)}
                </FormItem>

                <FormItem {...formThreeLayout} label="商品批发价">
                  {getFieldDecorator('wholesale_price', {})(<Input placeholder="商品批发价格" />)}
                </FormItem>

                <FormItem {...formThreeLayout} label="商品会员价">
                  {getFieldDecorator('vip_price', {})(<Input placeholder="商品会员价格" />)}
                </FormItem>

                <FormItem {...formItemLayout} label="是否上架">
                  {getFieldDecorator('ifSale', {
                    rules: [
                      {
                        required: true,
                        message: '请选择是否上架',
                      },
                    ],
                  })(<Switch checkedChildren="是" unCheckedChildren="否" defaultChecked />)}
                </FormItem>
              </Panel>
            </Collapse>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={false}>
                提交
              </Button>
              <Button
                style={{ marginLeft: 8 }}
                onClick={() => {
                  this.props.history.goBack();
                }}
              >
                <Icon type="left" />返回上一步
              </Button>
            </FormItem>
          </Form>

          {/* <form action="http://localhost:8000/api/goods/imgUpload" method="post" encType="multipart/form-data">
                        <input type="file" name="file" id="file" value=""  />
                        <input type="submit" value="提交" />
                    </form> */}
        </Card>
      </div>
    );
  }
}
