import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Tooltip, Icon, DatePicker, Select, Spin } from 'antd';
import { ChartCard, MiniArea, Bar } from 'components/Charts';
import numeral from 'numeral';
import styles from './DataMonitor.less';
import { formatChartData, digitToFixed } from './../../utils/utils';
import moment from 'moment';
import { div } from 'gl-matrix/src/gl-matrix/vec3';

const Option = Select.Option;

@connect(({ monitor, loading, project }) => ({
  monitor,
  loading: loading.effects['monitor/getDayPv'],
  projects: project.projectList,
}))
export default class DataMonitor extends Component {
  constructor(props, context) {
    super(props, context);
  }
  componentDidMount() {
    this.getStaticData();
    // 是否开启定时统计数据
    this.timer = setInterval(() => {
      this.getStaticData();
    }, 60000);
  }

  getStaticData = () => {
    //获取pv
    this.props.dispatch({
      type: 'monitor/getDayPv',
    });

    // 获取我的所有项目产品
    this.props.dispatch({
      type: 'project/getProjectList',
    });
    // 获取当天打开用户数
    this.props.dispatch({
      type: 'monitor/getDayUser',
    });
    // 获取当天登录用户数
    this.props.dispatch({
      type: 'monitor/getDayLoginUser',
    });
    //当天使用时间
    this.props.dispatch({
      type: 'monitor/getDayUseTime',
    });

    //当天机型使用排行
    this.props.dispatch({
      type: 'monitor/getDayDeviceRank',
    });

    //当天页面访问排行
    this.props.dispatch({
      type: 'monitor/getDayPvRank',
    });
  };
  componentWillUnmount = () => {
    clearInterval(this.timer);
  };

  render() {
    const {
      monitorData,
      userData,
      loginUserData,
      userOpenTimeData,
      dayUseData,
      deviceRankData,
      pvPageData,
      averageOpenData,
    } = this.props.monitor;

    const { projects } = this.props;
    const topColResponsiveProps = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 6,
      style: { marginBottom: 24 },
    };

    const { loading } = this.props;
    //平均用户打开次数
    this.AverageOpenTime = Number(digitToFixed(userOpenTimeData.count / userData.count)) || 0;

    return (
      <Fragment>
        <div style={{ paddingBottom: 50 }}>
          <Row className={styles.appSelect}>
            <span>当前应用：</span>
            <Select
              defaultValue={(projects[0] && projects[0].productId) || ''}
              style={{ width: 120 }}
            >
              {projects && projects.length > 0
                ? projects.map((item, index) => {
                    return (
                      <Option key={index} value={item.productId}>
                        {item.productName}
                      </Option>
                    );
                  })
                : null}
            </Select>

            {loading ? (
              <Row style={{ textAlign: 'center', margin: ' 0 20px' }}>
                <Spin size="small" />
              </Row>
            ) : null}
          </Row>

          <Row gutter={24}>
            <Col {...topColResponsiveProps}>
              <ChartCard
                bordered={false}
                title="App页面访问总量"
                action={
                  <Tooltip title="实时页面访问总量，x轴代表时间，y轴代表数量">
                    <Icon type="info-circle-o" />
                  </Tooltip>
                }
                total={numeral(monitorData.count).format('0,0')}
                footer={null}
                contentHeight={46}
              >
                <MiniArea color="#975FE4" data={monitorData.list} />
              </ChartCard>
            </Col>

            <Col {...topColResponsiveProps}>
              <ChartCard
                bordered={false}
                title="用户数"
                action={
                  <Tooltip title="当日App打开用户，x轴代表时间，y轴代表数量">
                    <Icon type="info-circle-o" />
                  </Tooltip>
                }
                total={numeral(userData.count).format('0,0')}
                footer={null}
                contentHeight={46}
              >
                <MiniArea color="#1890ff" data={userData.list} />
              </ChartCard>
            </Col>

            <Col {...topColResponsiveProps}>
              <ChartCard
                bordered={false}
                title="登录用户数"
                action={
                  <Tooltip title="登录用户数，x轴代表时间，y轴代表数量">
                    <Icon type="info-circle-o" />
                  </Tooltip>
                }
                total={numeral(loginUserData.count).format('0,0')}
                footer={null}
                contentHeight={46}
              >
                <MiniArea color="#1890ff" data={loginUserData.list} />
              </ChartCard>
            </Col>

            <Col {...topColResponsiveProps}>
              <ChartCard
                bordered={false}
                title="app打开次数"
                action={
                  <Tooltip title="app打开次数，x轴代表时间，y轴代表数量">
                    <Icon type="info-circle-o" />
                  </Tooltip>
                }
                total={numeral(userOpenTimeData.count).format('0,0')}
                footer={null}
                contentHeight={46}
              >
                <MiniArea color="#1890ff" data={userOpenTimeData.list} />
              </ChartCard>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col {...topColResponsiveProps}>
              <ChartCard
                bordered={false}
                title="用户平均打开次数"
                action={
                  <Tooltip title="用户平均打开次数，x轴代表时间，y轴代表数量">
                    <Icon type="info-circle-o" />
                  </Tooltip>
                }
                total={this.AverageOpenTime}
                footer={null}
                contentHeight={46}
              >
                <MiniArea color="#975FE4" data={averageOpenData} />
              </ChartCard>
            </Col>

            <Col {...topColResponsiveProps}>
              <ChartCard
                title="每次打开app平均使用时长"
                action={
                  <Tooltip title="平均使用时长">
                    <Icon type="info-circle-o" />
                  </Tooltip>
                }
                style={{ height: 150 }}
                total={parseInt(dayUseData.perOpen / 60) + '分钟'}
                contentHeight={46}
              />
            </Col>

            <Col {...topColResponsiveProps}>
              <ChartCard
                title="用户平均使用时长"
                style={{ height: 150 }}
                action={
                  <Tooltip title="用户平均使用时长">
                    <Icon type="info-circle-o" />
                  </Tooltip>
                }
                total={parseInt(dayUseData.perUser / 60) + '分钟'}
                contentHeight={46}
              />
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xl={8} lg={12} md={12} sm={24} xs={24}>
              <Card className={styles.Rank}>
                <h4 className={styles.rankingTitle}>设备访问排行榜</h4>
                <ul className={styles.rankingList}>
                  {deviceRankData.map((item, i) => {
                    return (
                      <li key={item.deviceModel}>
                        <span
                          className={[
                            i == 0
                              ? styles.active1
                              : '' + i == 1 ? styles.active2 : '' + i == 2 ? styles.active3 : '',
                          ]}
                        >
                          {i + 1}
                        </span>
                        <span>{item.deviceModel || '未知机型'}</span>
                        <span>{numeral(item.count).format('0,0')}</span>
                      </li>
                    );
                  })}
                </ul>
              </Card>
            </Col>

            <Col xl={8} lg={12} md={12} sm={24} xs={24}>
              <Card className={styles.Rank}>
                <h4 className={styles.rankingTitle}>页面访问排行榜</h4>
                <ul className={styles.rankingList}>
                  {pvPageData.map((item, i) => (
                    <li key={item.path}>
                      <span
                        className={[
                          i == 0
                            ? styles.active1
                            : '' + i == 1 ? styles.active2 : '' + i == 2 ? styles.active3 : '',
                        ]}
                      >
                        {i + 1}
                      </span>
                      <span>{item.path}</span>
                      <span>{numeral(item.count).format('0,0')}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </Col>
          </Row>
        </div>
      </Fragment>
    );
  }
}
