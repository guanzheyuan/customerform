import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryWorkOrder(params) {
  return request(`/ecogrid/workOrder/queryWorkOrderPage?${stringify(params)}`);
}

export async function submitWorkOrder(params) {
  return request('/ecogrid/workOrder/submit', {
    method: 'post',
    data: { ...params },
  });
}

export async function queryWorkTaskType() {
  return request('/ecogrid/worktype/queryWorkTypeList');
}

export async function deleteWorkOrder(id) {
  return request(`/ecogrid/workOrder/delete/${id}`, {
    method: 'delete',
  });
}

export async function saveWorkOrder(params) {
  return request('/ecogrid/workOrder/save', {
    method: 'post',
    data: { ...params },
  });
}

export async function queryOrgAndUser() {
  return request(`/ecogrid/workOrder/formWorkOrder`);
}

export async function queryCurrentUser() {
  return request('/ecogrid/employee/getCurrentUser/1');
}

/* export async function queryOrderDetail(workOrderId) {
  return request(`/ecogrid/workOrder/workOrderDetail/${workOrderId}`);
} */

export async function queryOrderDetail(workOrderId) {
  return request(`/ecogrid/audit/auditForm/${workOrderId}`);
}
