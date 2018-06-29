import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Row, Col, Card, Icon, Button, List, Avatar } from 'antd';

import Ellipsis from 'components/Ellipsis';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './projectManage.less';
@connect(({ loading, project }) => ({
  loading: false,
  projectList: project.projectList,
}))
export default class projectManage extends Component {
  componentDidMount = () => {
    // 获取我的所有项目产品
    this.props.dispatch({
      type: 'project/getProjectList',
    });
  };

  showConfigDialog = pid => {};
  render() {
    const { loading, projectList } = this.props;
    console.log(projectList);
    const pageHeaderContent = (
      <div className={styles.pageHeaderContent}>
        <div className={styles.avatar}>
          <Avatar
            size="large"
            src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"
          />
        </div>
        <div className={styles.content}>
          <div className={styles.contentTitle}>早安，曲丽丽，祝你开心每一天！</div>
          <div>交互专家 | 备胎金服－备胎信用－技术管理部－UED</div>
        </div>
      </div>
    );

    const extraContent = (
      <div className={styles.extraContent}>
        <div className={styles.statItem}>
          <p>项目数</p>
          <p>{projectList.length}</p>
        </div>
      </div>
    );
    return (
      <PageHeaderLayout content={pageHeaderContent} extraContent={extraContent}>
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card
              className={styles.projectList}
              style={{ marginBottom: 24 }}
              title="全部项目"
              extra={
                <Button type="dashed" className={styles.newButton} onClick={this.addProduct}>
                  <Link to="/projectManage/addProject">
                    <Icon type="plus" /> 新增产品
                  </Link>
                </Button>
              }
              bordered={false}
              loading={loading}
              bodyStyle={{ padding: 0 }}
            >
              {projectList && projectList.length > 0
                ? projectList.map((item, index) => (
                    <Card.Grid className={styles.projectGrid} key={index}>
                      <Card bodyStyle={{ padding: 0 }} bordered={false}>
                        <Card.Meta
                          title={
                            <div className={styles.cardTitle}>
                              <Avatar
                                size="large"
                                src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"
                              />
                              <span className={styles.productName}>{item.productName}</span>
                            </div>
                          }
                        />
                      </Card>
                      <Link
                        to={{
                          pathname: '/projectManage/updateProject',
                          state: {
                            product_id: item.productId,
                            product: item,
                          },
                        }}
                        className={styles.changeProductConfig}
                      >
                        配置修改
                      </Link>
                    </Card.Grid>
                  ))
                : null}
            </Card>
          </Col>
        </Row>
      </PageHeaderLayout>
    );
  }
}
