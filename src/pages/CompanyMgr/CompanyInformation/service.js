import request from '@/utils/request';

export async function queryInformationList(params) {
  return request('/ecogrid/formtaskinfo/getTaskList', {
    method: 'post',
    data: { ...params },
  });
}

export async function queryInformationDetails(params) {
  return request('', {
    method: 'post',
    data: { ...params },
  });
}
