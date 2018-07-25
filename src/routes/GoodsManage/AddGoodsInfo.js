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
  Checkbox,
  DatePicker,
  message,
} from 'antd';
import { getBase64 } from './../../utils/utils';
import area from './../../utils/area';
import styles from './AddGoodsInfo.less';
import Colors from './../../components/Colors';
import Sizes from './../../components/Sizes';
import moment from 'moment';
const Step = Steps.Step;
const FormItem = Form.Item;
const Panel = Collapse.Panel;

import E from 'wangeditor';
@Form.create()
@connect(({ goods }) => ({
  currentStep: goods.currentStep,
  goodsSort: goods.goodsSort,
}))
export default class AddGoodsInfo extends PureComponent {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
    listImg: [],
    colorGroup: [
      {
        label: '红色',
        value: 'red',
        show: false,
        checked: false,
      },
      {
        label: '橙色',
        value: 'orange',
        show: false,
        checked: false,
      },
      {
        label: '黄色',
        value: 'yellow',
        show: false,
        checked: false,
      },
      {
        label: '绿色',
        value: 'green',
        show: false,
        checked: false,
      },
      {
        label: '蓝色',
        value: 'blue',
        show: false,
        checked: false,
      },
    ],
    checkedColors: [],
    sizeGroup: [],
    baseSizes: ['35', '36', '37'], //默认尺寸
    checkedSize: [], //选中的尺寸
    currentColorIndex: -1,
  };

  componentDidMount = () => {
    const { form } = this.props;
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
    // 启用编辑器
    const editor = new E(this.editorElem);
    // 自定义菜单配置
    editor.customConfig.menus = [
      'head', // 标题
      'bold', // 粗体
      'fontSize', // 字号
      'fontName', // 字体
      'italic', // 斜体
      'underline', // 下划线
      'strikeThrough', // 删除线
      'foreColor', // 文字颜色
      'backColor', // 背景颜色
      'link', // 插入链接
      'list', // 列表
      'justify', // 对齐方式
      'quote', // 引用
      'emoticon', // 表情
      'image', // 插入图片
      'table', // 表格
      'video', // 插入视频
      'code', // 插入代码
      'undo', // 撤销
      'redo', // 重复
    ];
    editor.customConfig.colors = [
      '#000000',
      '#eeece0',
      '#1c487f',
      '#4d80bf',
      '#c24f4a',
      '#8baa4a',
      '#7b5ba1',
      '#46acc8',
      '#f9963b',
      '#ffffff',
    ];
    // 表情面板可以有多个 tab ，因此要配置成一个数组。数组每个元素代表一个 tab 的配置
    editor.customConfig.emotions = [
      {
        // tab 的标题
        title: 'emoji',
        // type -> 'emoji' / 'image'
        type: 'emoji',
        // content -> 数组
        content: ['😀', '😃', '😄', '😁', '😆'],
      },
    ];
    //图片插入成功回调
    editor.customConfig.linkImgCallback = function(url) {
      console.log(url); // url 即插入图片的地址
    };
    //degug模式
    editor.customConfig.debug = true;
    //使用Base64保存图片
    editor.customConfig.uploadImgShowBase64 = true;
    // 配置服务器端地址
    editor.customConfig.uploadImgServer = '/api/upload';
    //配置zindex
    editor.customConfig.zIndex = 10;
    // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
    editor.customConfig.onchange = html => {
      //  赋值给form表单
      this.props.form.setFieldsValue({
        goods_details: html,
      });
    };
    editor.create();
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
  handleChange = ({ file, fileList }) => {
    this.setState({ fileList });
    //设置商品主图地址
    let imgUrl = '';
    if (file.status == 'done') {
      imgUrl = file.response.data.pictureUrl;
    }
    //  赋值给form表单
    this.props.form.setFieldsValue({
      goods_primary_img: imgUrl,
    });
  };
  handleListChange = ({ file, fileList }) => {
    this.setState({ listImg: fileList });
    let resultImgs = [];
    if (file.status == 'done') {
      fileList.map((item, index) => {
        resultImgs.push(item.response.data.pictureUrl);
      });
    }
    //  赋值给form表单
    this.props.form.setFieldsValue({
      goods_list_img: resultImgs,
    });
  };
  // groupChange
  groupChange = checkList => {
    console.log('颜色选中列表', checkList);
    let values = this.state.colorGroup;
    values.forEach((item, index) => {
      if (checkList.includes(index)) {
        item.checked = true;
      }
    });
    this.setState({
      checkedColors: checkList.sort(),
      colorGroup: values,
    });
    let result = [];
    //把选中的值构造进尺码表
    checkList.forEach((item, index) => {
      if (!result.includes(item)) {
        let len = this.state.checkedSize.length > 0 ? this.state.checkedSize.length : 1;
        result.push({
          key: index,
          color: values[item].label,
          sizes: this.state.checkedSize,
          price: Array(len).fill('0.00'),
          storage: Array(len).fill('0'),
          imgs: '',
        });
      }
    });
    this.setState({ sizeGroup: result });
  };
  //组合的颜色名focus事件
  labelFoucs = (e, index) => {
    //focus的时候去判断如果选中进尺寸列表的话 去实时更新尺寸列表的数据
    let newSizeGroup = [...this.state.sizeGroup];
    if (newSizeGroup.length > 0) {
      //获得需要修改的尺寸列表的index
      newSizeGroup.forEach((item, index2) => {
        if (item.color == e.target.value) {
          this.setState({
            currentColorIndex: index2,
          });
        }
      });
    }
  };
  //改变组合的颜色名
  labelChange = (e, index) => {
    let newGroup = [...this.state.colorGroup];
    newGroup[index].label = e.target.value;
    this.setState({
      colorGroup: newGroup,
    });
    //判断当前的currentColorIndex
    let currentColorIndex = this.state.currentColorIndex;
    let newSizeGroup = [...this.state.sizeGroup];
    //当该颜色已经选择了尺寸的时候，实时改变选择了尺寸的颜色名称
    if (this.state.checkedColors.includes(index)) {
      newSizeGroup[currentColorIndex].color = e.target.value;
    }
    this.setState({
      sizeGroup: newSizeGroup,
    });
  };
  //改变组合的颜色
  colorChange = (val, index) => {
    let newGroup = [...this.state.colorGroup];
    //修改颜色
    newGroup[index].value = val.hex;
    newGroup[index].show = false;
    this.setState({
      colorGroup: newGroup,
    });
  };
  // 改变颜色选择器的显示状态
  showChange = (index, e) => {
    let checkedColors = [...this.state.checkedColors];
    let newGroup = this.state.colorGroup;
    newGroup[index].show = true;
    this.setState({
      colorGroup: newGroup,
    });
  };
  //改变选中的尺寸列表
  sizeGroupChange = sizeList => {
    this.setState({
      checkedSize: sizeList.sort(),
    });
    //当已经选择了颜色分类的时，实时改变颜色分类的尺码
    let newSizeGroup = [...this.state.sizeGroup];
    if (newSizeGroup.length > 0) {
      //把选中的值构造进尺码表
      let len = sizeList.length;
      newSizeGroup.forEach((item, index) => {
        item.sizes = sizeList;
        //同时实时改变当前的尺码的售价和库存的数量
        item.price = Array(len).fill('0.00');
        item.storage = Array(len).fill('0');
        // item.imgs = ''
      });
      this.setState({
        sizeGroup: newSizeGroup,
      });
    }
    //
    console.log('checked', sizeList);
  };
  //修改默认的尺寸
  sizeChange = (e, i) => {
    let newSizeList = [...this.state.baseSizes];
    let newCheckedSize = [...this.state.checkedSize];
    //该尺寸已经存在
    if (newSizeList.includes(e.target.value)) {
      return;
    }
    console.log('当前修改的尺寸位置', i);
    newSizeList[i] = e.target.value;
    //删除之前那个
    newCheckedSize.splice(i, 1);
    this.setState({
      baseSizes: newSizeList.sort(),
      checkedSize: newCheckedSize,
    });
    console.log('当前选中的尺寸', newCheckedSize, '新的基本尺寸', newSizeList);
  };
  //颜色模板管理
  manageColors = () => {};
  //尺寸管理
  manageSizes = () => {
    console.log('商品信息', this.state.sizeGroup);
  };
  //添加尺寸值
  addSizes = () => {
    let newSizeBase = [...this.state.baseSizes];
    let len = this.state.baseSizes.length;
    let newData = Number(this.state.baseSizes[len - 1]) + 1;
    newSizeBase.push(newData);

    this.setState({
      baseSizes: newSizeBase,
    });
  };
  //保存尺寸编辑信息
  handleSave = data => {
    // console.log('save data')
    this.setState({
      sizeGroup: data,
    });
  };
  //表单提交
  handleSubmit = () => {
    const { form, dispatch } = this.props;
    //把Sku信息赋值进来
    this.props.form.setFieldsValue({
      goods_sizes: this.state.sizeGroup,
      goods_colors: this.state.checkedColors,
    });
    //setTimeout 用于保证获取表单值是在所有表单字段更新完毕的时候
    setTimeout(() => {
      form.validateFields((err, value) => {
        if (!err) {
          //提交分类
          dispatch({
            type: 'goods/addGoods',
            params: { ...value },
          });
        } else {
          message.error(Object.values(err)[0].errors[0].message);
        }
      });
    }, 0);
  };
  render() {
    const { form, currentStep, goodsSort } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { previewVisible, previewImage, fileList, listImg } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 6 },
        md: { span: 8 },
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
    //提交按钮布局
    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
    //商品详情布局
    const detailLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
    };
    //每行三列布局
    const threeColumnLayout = {
      labelCol: {
        xs: { span: 10 },
        sm: { span: 12 },
      },
      wrapperCol: {
        xs: { span: 12 },
        sm: { span: 10 },
      },
    };
    //颜色等sku全行布局
    const fullRowLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 24 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 24 },
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

          <Form onSubmit={this.handleSubmit} style={{ marginTop: 20 }}>
            <Collapse defaultActiveKey={['1']}>
              <Panel header="商品基本信息" key="1">
                <FormItem {...formItemLayout} label="商品分类">
                  {getFieldDecorator('goods_cat', {
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
                  {getFieldDecorator('goods_name', {
                    rules: [
                      {
                        required: true,
                        message: '请填写商品名称',
                      },
                    ],
                  })(<Input placeholder="商品名称" />)}
                </FormItem>

                <FormItem {...formItemLayout} label="商品短语">
                  {getFieldDecorator('goods_brief', {})(
                    <Input placeholder="显示在商品名称下简短的介绍" />
                  )}
                </FormItem>

                <FormItem {...formItemLayout} label="商品编码">
                  {getFieldDecorator('goods_sn', {
                    rules: [
                      {
                        required: true,
                        message: '请填写商品编码',
                      },
                    ],
                  })(<Input placeholder="商品编码请输入国际编码" />)}
                </FormItem>

                <FormItem {...formThreeLayout} label="商品净含量">
                  {getFieldDecorator('goods_weight', {
                    rules: [
                      {
                        required: true,
                        message: '请填写商品净含量',
                      },
                    ],
                  })(<Input placeholder="商品净含量" />)}
                </FormItem>

                <FormItem {...formThreeLayout} label="商品规格单位">
                  {getFieldDecorator('goods_standard_unit', {
                    rules: [
                      {
                        required: true,
                        message: '请填写商品规格单位',
                      },
                    ],
                  })(<Input placeholder="ml 克 千克等国际单位" />)}
                </FormItem>

                <FormItem {...formThreeLayout} label="商品包装形式">
                  {getFieldDecorator('goods_unit', {
                    rules: [
                      {
                        required: true,
                        message: '商品包装形式',
                      },
                    ],
                  })(<Input placeholder="瓶 袋 盒等包装单位" />)}
                </FormItem>

                <FormItem {...formItemLayout} label="生产日期">
                  {getFieldDecorator('goods_productTime', {})(
                    <DatePicker placeholder="请选择生产日期" />
                  )}
                </FormItem>

                <FormItem {...formThreeLayout} label="保质期">
                  {getFieldDecorator('goods_expireTime', {})(
                    <Input placeholder="请填写保质期时间(天)" />
                  )}
                </FormItem>

                <FormItem {...formItemLayout} label="生产厂家">
                  {getFieldDecorator('goods_industry', {})(
                    <Input placeholder="请填写商品的生产厂商" />
                  )}
                </FormItem>

                <FormItem {...formItemLayout} label="商品主图">
                  {getFieldDecorator('goods_primary_img', {
                    rules: [
                      {
                        required: true,
                        message: '请选择商品的主图',
                      },
                    ],
                  })(
                    <div className="clearfix">
                      <Upload
                        action="/api/goods/upload"
                        accept="image/*"
                        withCredentials
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={this.handlePreview}
                        onChange={this.handleChange}
                      >
                        {fileList.length >= 1 ? null : uploadButton}
                      </Upload>

                      <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                      </Modal>
                    </div>
                  )}
                </FormItem>

                <FormItem {...formItemLayout} label="商品列表图">
                  {getFieldDecorator('goods_list_img', {
                    rules: [
                      {
                        required: true,
                        message: '请选择商品的列表图',
                      },
                    ],
                  })(
                    <div className="clearfix">
                      <Upload
                        action="/api/goods/upload"
                        accept="image/*"
                        withCredentials
                        listType="picture-card"
                        fileList={listImg}
                        onPreview={this.handlePreview}
                        onChange={this.handleListChange}
                      >
                        {listImg.length >= 10 ? null : uploadButton}
                      </Upload>

                      <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                      </Modal>
                    </div>
                  )}
                </FormItem>

                <FormItem {...detailLayout} label="商品详情">
                  {getFieldDecorator('goods_details', {
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  })(<div ref={node => (this.editorElem = node)} style={{ marginTop: 20 }} />)}
                </FormItem>
              </Panel>

              <Panel header="商品Sku信息" key="2">
                <FormItem
                  {...fullRowLayout}
                  label={
                    <span>
                      <span>颜色分类</span>
                      <span className={styles.manage} onClick={this.manageColors}>
                        管理属性值
                      </span>
                    </span>
                  }
                  className={styles.colors}
                >
                  {getFieldDecorator('goods_colors', {})(
                    <Colors
                      colorGroup={this.state.colorGroup}
                      checkedValue={this.state.checkedColors}
                      groupChange={this.groupChange}
                      labelFoucs={this.labelFoucs}
                      labelChange={this.labelChange}
                      colorChange={this.colorChange}
                      showChange={this.showChange}
                    />
                  )}
                </FormItem>

                <FormItem
                  {...fullRowLayout}
                  label={
                    <span>
                      <span>尺寸</span>
                      <span className={styles.manage} onClick={this.manageSizes}>
                        管理属性值
                      </span>
                    </span>
                  }
                  className={styles.colors}
                >
                  {getFieldDecorator('goods_sizes', {})(
                    <div>
                      <Row>
                        <Checkbox.Group
                          style={{ width: '100%' }}
                          value={this.state.checkedSize}
                          onChange={this.sizeGroupChange}
                        >
                          {this.state.baseSizes.map((item, index) => (
                            <Col span={6} key={index}>
                              <Checkbox value={item}>
                                <input
                                  type="text"
                                  value={item}
                                  className={styles.sizeInput}
                                  onChange={e => {
                                    this.sizeChange(e, index);
                                  }}
                                />
                              </Checkbox>
                            </Col>
                          ))}
                          <Col span={6} onClick={this.addSizes}>
                            <span className={styles.sizeAdd}>添加尺寸</span>
                          </Col>
                        </Checkbox.Group>
                      </Row>
                      <Sizes dataSource={this.state.sizeGroup} handleSave={this.handleSave} />
                    </div>
                  )}
                </FormItem>
              </Panel>

              <Panel header="商品销售信息" key="3">
                <Row>
                  <Col span={8}>
                    <FormItem {...threeColumnLayout} label="商品进价">
                      {getFieldDecorator('goods_buy_price', {
                        rules: [
                          {
                            required: true,
                            message: '请填写商品进价',
                          },
                        ],
                      })(<Input placeholder="商品进货价格" />)}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem {...threeColumnLayout} label="商品零售价">
                      {getFieldDecorator('goods_normal_price', {
                        rules: [
                          {
                            required: true,
                            message: '请填写商品零售价',
                          },
                        ],
                      })(<Input placeholder="商品正常零售价格" />)}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem {...threeColumnLayout} label="商品批发价">
                      {getFieldDecorator('goods_wholesale_price', {})(
                        <Input placeholder="商品批发价格" />
                      )}
                    </FormItem>
                  </Col>
                </Row>

                <Row>
                  <Col span={8}>
                    <FormItem {...threeColumnLayout} label="商品会员价">
                      {getFieldDecorator('goods_vip_price', {})(
                        <Input placeholder="商品会员价格" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem {...threeColumnLayout} label="商品库存量">
                      {getFieldDecorator('goods_storage', {
                        rules: [
                          {
                            required: true,
                            message: '请填写商品库存量',
                          },
                        ],
                      })(<Input placeholder="商品库存量" />)}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem {...threeColumnLayout} label="商品预警最低库存">
                      {getFieldDecorator('goods_storage_min', {})(
                        <Input placeholder="商品最低存货量" />
                      )}
                    </FormItem>
                  </Col>
                </Row>

                <Row>
                  <Col span={8}>
                    <FormItem {...threeColumnLayout} label="商品预警最高库存">
                      {getFieldDecorator('goods_storage_max', {})(
                        <Input placeholder="商品最高存货量" />
                      )}
                    </FormItem>
                  </Col>
                </Row>

                <Row>
                  <Col span={8}>
                    <FormItem {...threeColumnLayout} label="是否上架">
                      {getFieldDecorator('is_sale', {
                        rules: [
                          {
                            required: true,
                            message: '请选择是否上架',
                          },
                        ],
                        initialValue: true,
                      })(<Switch checkedChildren="是" unCheckedChildren="否" defaultChecked />)}
                    </FormItem>
                  </Col>
                </Row>
              </Panel>

              <Panel header="商品供货信息" key="4">
                <FormItem {...formThreeLayout} label="商品供货商">
                  {getFieldDecorator('goods_supplier', {})(<Input placeholder="商品供货商名称" />)}
                </FormItem>

                <FormItem {...formItemLayout} label="供货商地区">
                  {getFieldDecorator('goods_supplier_area', {})(
                    <Cascader
                      options={area}
                      onChange={e => {
                        console.log('onchange', e);
                      }}
                      placeholder="请选择供货商地区"
                    />
                  )}
                </FormItem>

                <FormItem {...formItemLayout} label="供货商详细地址">
                  {getFieldDecorator('goods_supplier_address', {})(
                    <Input placeholder="供货商详细地址" />
                  )}
                </FormItem>

                <FormItem {...formThreeLayout} label="供货商联系方式">
                  {getFieldDecorator('goods_supplier_phone', {})(
                    <Input placeholder="供货商联系方式" />
                  )}
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
        </Card>
      </div>
    );
  }
}
