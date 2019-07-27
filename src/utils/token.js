import { stringify } from 'qs';
import moment from 'moment';
import request from '@/utils/request';

export default {
  /**
   * 是否登陆
   */
  isLogin() {
    if (sessionStorage.getItem('ACCESS_TOKEN')) {
      return true;
    }
    return false;
  },

  /**
   * 是否过期
   */
  isExpires() {
    const tokenExpiresTime = sessionStorage.getItem('TOKEN_EXPIRES_TIME');
    if (!tokenExpiresTime) {
      // eslint-disable-next-line no-console
      console.error('access_token_time not find.');
      return true;
    }
    if (moment().unix() > tokenExpiresTime) {
      return true;
    }
    return false;
  },

  /**
   * 即将过期
   */
  isWillExpires() {
    const tokenExpiresTime = sessionStorage.getItem('TOKEN_EXPIRES_TIME');
    if (!tokenExpiresTime) {
      // eslint-disable-next-line no-console
      console.error('access_token_time not find.');
      return true;
    }
    if (moment().unix() + 60 * 30 > tokenExpiresTime) {
      return true;
    }
    return false;
  },

  token() {
    return sessionStorage.getItem('ACCESS_TOKEN');
  },

  /**
   * 请求授权服务器刷新token
   */
  refreshoken() {
    const refreshToken = sessionStorage.getItem('REFRESH_TOKEN');
    if (!refreshToken) {
      // eslint-disable-next-line no-console
      console.error('refresh_token not find.');
      return;
    }
    const params = {};
    params.grant_type = 'refresh_token';
    params.refresh_token = refreshToken;
    params.client_id = 'cloud';
    params.client_secret = '11';

    request('/oauth/token', {
      method: 'POST',
      body: stringify(params),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    }).then(res => {
      this.saveToken(res);
    });
  },

  deleteToken() {
    sessionStorage.removeItem('ACCESS_TOKEN');
    sessionStorage.removeItem('REFRESH_TOKEN');
    sessionStorage.removeItem('EXPIRES_IN');
    sessionStorage.removeItem('TOKEN_EXPIRES_TIME');
  },

  saveToken(data) {
    if (data.userCode) {
      sessionStorage.setItem('USER_CODE', data.userCode);
    }
    sessionStorage.setItem(
      'ACCESS_TOKEN',
      typeof data.access_token === 'string' ? data.access_token : ''
    );
    sessionStorage.setItem(
      'REFRESH_TOKEN',
      typeof data.refresh_token === 'string' ? data.refresh_token : ''
    );
    sessionStorage.setItem(
      'EXPIRES_IN',
      typeof data.expires_in === 'number' ? data.expires_in : ''
    );
    if (typeof data.expires_in === 'number') {
      sessionStorage.setItem(
        'TOKEN_EXPIRES_TIME',
        moment()
          .add(data.expires_in, 's')
          .unix()
      );
    }
  },
};
