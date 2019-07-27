import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { Modal } from 'antd';
import { fakeAccountLogin, getFakeCaptcha } from '@/services/api';
import { fakeOAuth2AccountLogin, logged } from '@/services/user';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import token from '@/utils/token';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *oauthlogin({ payload }, { call }) {
      const loginParams = {
        ...payload,
        password: btoa(payload.password),
      };
      const data = yield call(fakeOAuth2AccountLogin, loginParams);
      if (!data || !data.isSuccess || data.isSuccess !== 1) {
        Modal.error({ title: '用户名或密码错误' });
        return;
      }
      if (data.access_token) {
        token.saveToken(data);
        /* yield call(() => {
         return new Promise(resolve => {
           setTimeout(() => {
             resolve();
           }, 1000);
         })
       }); */

        /* yield put({
          type: 'logged',
        }); */
        //  yield put(routerRedux.push('/'));
        window.location.href = '/';
      } else throw data.errorMsg;
    },
    *logged(_, { call }) {
      yield call(logged);
    },
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.status === 'ok') {
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            redirect = null;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { put }) {
      sessionStorage.clear();
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });
      reloadAuthorized();
      const { redirect } = getPageQuery();
      // redirect
      if (window.location.pathname !== '/user/login' && !redirect) {
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          })
        );
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
