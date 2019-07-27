import { stringify } from 'qs';
import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent(userCode) {
  return request(`/portal/users/user/${userCode}`);
}

export async function logged() {
  return request('/ecogrid/logged');
}

export async function qryCurrentUser(userId) {
  return request(`/sso/users/queryUserById?userId=${userId}`);
}

export async function logout() {
  return request('/logout', {});
}
export async function fakeOAuth2AccountLogin(params) {
  const authParam = params;
  authParam.grant_type = 'password';
  authParam.client_id = 'cloud';
  authParam.client_secret = '11';

  return request('/oauth/token', {
    method: 'POST',
    data: authParam,
    requestType: 'form',
  });
}

export async function fakeAccountLogin(params) {
  return request('/login', {
    method: 'POST',
    body: stringify(params),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
  });
}
