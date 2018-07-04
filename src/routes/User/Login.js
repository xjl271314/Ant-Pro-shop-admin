import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Checkbox, Alert, Icon } from 'antd';
import Login from 'components/Login';
import styles from './Login.less';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
export default class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
  };

  componentDidMount = () => {
    //获取验证码
    this.props.dispatch({
      type: 'login/getCaptcha',
    });
  };

  onTabChange = type => {
    this.setState({ type });
  };

  handleSubmit = (err, values) => {
    const { type } = this.state;
    if (!err) {
      this.props.dispatch({
        type: 'login/login',
        payload: {
          ...values,
          type,
        },
      });
    }
  };

  //重新获取验证码
  resetCaptcha = () => {
    this.props.dispatch({
      type: 'login/getCaptcha',
    });
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = content => {
    return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
  };

  render() {
    const { login, submitting } = this.props;
    const { type } = this.state;
    return (
      <div className={styles.main}>
        <Login defaultActiveKey={type} onTabChange={this.onTabChange} onSubmit={this.handleSubmit}>
          {login.status === 'error' &&
            login.type === 'account' &&
            !login.submitting &&
            this.renderMessage('账户或密码错误（admin/888888）')}
          <UserName name="userName" placeholder="请输入用户名" />
          <Password name="password" placeholder="请输入密码" />
          <Captcha name="captchaText" captcha={login.captcha} resetCaptcha={this.resetCaptcha} />

          {/* 
            <Tab key="mobile" tab="手机号登录">
              {login.status === 'error' &&
                login.type === 'mobile' &&
                !login.submitting &&
                this.renderMessage('验证码错误')}
              <Mobile name="mobile" />
              <Captcha name="captcha" />
            </Tab> 
          */}
          <Submit loading={submitting}>登录</Submit>
          <div className={styles.other}>
            <Link className={styles.register} to="/user/register">
              注册账户
            </Link>
          </div>
        </Login>
      </div>
    );
  }
}
