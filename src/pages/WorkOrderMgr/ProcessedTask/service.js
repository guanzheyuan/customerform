import { stringify } from 'qs';
import request from '@/utils/request';

export default async function queryProcessTaskList(params) {
  return request(`/ecogrid/workOrder/queryHasDealWorkOrderPage?${stringify(params)}`);
}

export async function queryOrderDetail(workOrderId) {
  return request(`/ecogrid/audit/auditForm/${workOrderId}`);
}
