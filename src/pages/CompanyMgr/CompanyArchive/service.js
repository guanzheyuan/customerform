import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryCompanyArchive(params) {
  return request(`/entermgr/epattrextlabeldisplay/page?${stringify(params)}`);
}

export async function submitCompanyArchive(params) {
  return request('/ecogrid/companyArchive/submit', {
    method: 'post',
    data: { ...params },
  });
}

export async function queryCompanyArchiveContentType() {
  return request('/archive/queryContentType');
}

export async function deleteCompanyArchive(id) {
  return request(`/entermgr/epattrextlabeldisplay/${id}`, {
    method: 'delete',
  });
}

export async function saveCompanyArchive(params) {
  return request('/ecogrid/companyArchive/save', {
    method: 'post',
    data: { ...params },
  });
}

export async function queryCurrentUser() {
  return request('/ecogrid/employee/getCurrentUser/1');
}

export async function queryCompanyArchiveDetail(archiveId) {
  return request(`/ecogrid/companyArchive/${archiveId}`);
}

export async function changeArchiveState(params) {
  return request(`/entermgr/epattrextlabeldisplay/${params.id}/${params.isValid}`, {
    method: 'patch',
  });
}
