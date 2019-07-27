import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryWorkTaskType() {
  return request('/ecogrid/worktype/queryWorkTypeList');
}

export async function queryOrgAndUser() {
  return request(`/ecogrid/workOrder/formWorkOrder`);
}

export async function queryTodoList(params) {
  return request(`/ecogrid/audit/queryAuditPage?${stringify(params)}`);
}

export async function dealWorkOrderTask(params) {
  return request(`/ecogrid/audit/dealWorkOrderTask`, {
    method: 'post',
    data: params,
  });
}

export async function queryAuditForm(id) {
  return request(`/ecogrid/audit/auditForm/${id}`);
}

export async function queryChildrenOrgListOfCurOrg() {
  return request(`/ecogrid/audit/queryChildrenOrgListOfCurOrg`);
}

// 查询网格区域列表
export async function queryGridList() {
  return request(`/ecogrid/grid/getAllGridList`);
}

/* // 根据部门查询责任人
export async function queryRespInfo(orgId) {
  return request(`/ecogrid/audit/getDeptResponseInfo/${orgId}`)
} */

// 根据部门查询所有网格员
export async function queryAllPersonResponseInfo() {
  return request(`/ecogrid/audit/queryAllPersonResponseInfo`);
}

// 专职网格员查看企业名录
export async function getEnterReportList(params) {
  return request(`/ecogrid/enterpriseinfo/getEnterReportList?${stringify(params)}`);
}

// 专项网格员查看企业名录
export async function getZxwgyEnterReportList(params) {
  return request(`/ecogrid/enterpriseinfo/getZxwgyEnterReportList?${stringify(params)}`);
}

// 网格中心查看企业名录
export async function getWgzxEnterReportList(params) {
  return request(`/ecogrid/enterpriseinfo/getWgzxEnterReportList?${stringify(params)}`);
}

// 批量核实企业名录
export async function batchCheck(params) {
  return request(`/ecogrid/audit/batchCheck?${stringify(params)}`, {
    method: 'post',
  });
}

// 获取被评价人列表
export async function getRespPersonList(workOrderId) {
  return request(`/ecogrid/task/getRespPersonList/${workOrderId}`);
}

// 获取被评价部门列表
export async function getRespDeptList(workOrderId) {
  return request(`/ecogrid/task/getRespDeptList/${workOrderId}`);
}

// 获取评价相关字典列表
export async function queryEvaluateDict() {
  return request(`/ecogrid/workEvaluate/queryDictValues`);
}

// 增加主评价
export async function addEvaluate(params) {
  return request(`/ecogrid/workEvaluate/addOrEdit`, {
    method: 'post',
    data: params,
  });
}

// 添加核实备注
export async function addRemarks(params) {
  return request(`/ecogrid/enterprisereport/addRemarks`, {
    method: 'post',
    data: params,
  });
}
