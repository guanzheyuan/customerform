import request from '@/utils/request';

export async function getTaskFormInfoById(param) {
  return request(`/ecogrid/formtaskinfo/getTaskFormInfoById/${param}`);
}

export async function getEditTask(id) {
  return request(`/ecogrid/formtaskinfo/getTaskUncommitedFormInfoById/${id}`);
}

export async function saveFormInfo(param) {
  return request(`/ecogrid/formtaskinfo/saveFormInfo`, {
    method: 'post',
    data: param,
  });
}
