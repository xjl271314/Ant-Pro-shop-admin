import React, { Fragment } from 'react';
import { Button, Row, Col, Icon, Steps, Card } from 'antd';
import Result from 'components/Result';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { Link } from 'dva/router';

const actions = (
  <Fragment>
    <Button type="primary">
      <Link to="/goods-manage/add-goods">返回继续添加</Link>
    </Button>
    <Button>
      <Link to="/index">返回主页</Link>
    </Button>
  </Fragment>
);

export default () => (
  <PageHeaderLayout>
    <Card bordered={false}>
      <Result
        type="success"
        title="新增商品成功"
        description="【小提示】: 新增商品信息的Sku属性不是必填项哦，一般适用于服装类商品"
        extra={null}
        actions={actions}
        style={{ marginTop: 48, marginBottom: 16 }}
      />
    </Card>
  </PageHeaderLayout>
);
