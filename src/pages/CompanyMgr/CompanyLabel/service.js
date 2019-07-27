import request from '@/utils/request';

export async function queryLabelList(pageNum, pageSize, labelName) {
  return request(`/entermgr/emlabel/list?pageNum=${pageNum}&pageSize=${pageSize}`, {
    method: 'get',
    params: labelName,
  });
}

export async function saveLabelData(params) {
  return request(`/entermgr/emlabel`, {
    method: 'POST',
    data: params,
  });
}

export async function updateStatusChange(labelId, labelStatus) {
  return request(`/entermgr/emlabel/${labelId}/${labelStatus}`, {
    method: 'put',
  });
}

export async function deleteLabel(labelId) {
  return request(`/entermgr/emlabel/${labelId}`, {
    method: 'delete',
  });
}

export async function queryDetailLabel(labelId) {
  return request(`/entermgr/emlabel/detail/${labelId}`, {
    method: 'get',
  });
}

export async function queryUpdatafreq() {
  return request(`/entermgr/emlabel/dict/updatafreq`, {
    method: 'get',
  });
}

export async function queryAllLabelList(labelId, pageNum, pageSize) {
  return request(`/entermgr/emlabel/${labelId}/epinfo?pageNum=${pageNum}&pageSize=${pageSize}`, {
    method: 'get',
  });
}

export async function queryParamList() {
  return request(`/entermgr/emlablerule/getParamList`, {
    method: 'get',
  });
}

export async function queryQyLeftList(labelId, pageNum, pageSize, enterpriseName) {
  return request(
    `/entermgr/emlabel/${labelId}/epinfo/noexist?pageNum=${pageNum}&pageSize=${pageSize}`,
    {
      method: 'get',
      params: enterpriseName,
    }
  );
}

export async function queryQyRightList(labelId, pageNum, pageSize, enterpriseName) {
  return request(`/entermgr/emlabel/${labelId}/epinfo?pageNum=${pageNum}&pageSize=${pageSize}`, {
    method: 'get',
    params: enterpriseName,
  });
}

export async function addQyData(params) {
  return request(`/entermgr/ementerpriselabelref`, {
    method: 'POST',
    data: params,
  });
}

export async function deleteQyData(params) {
  return request(`/entermgr/ementerpriselabelref`, {
    method: 'delete',
    data: params,
  });
}

export async function addQyLabelAndRule(params) {
  return request(`/entermgr/emlablerule`, {
    method: 'POST',
    data: params,
  });
}

export async function editQyLabelAndRule(params) {
  return request(`/entermgr/emlablerule`, {
    method: 'put',
    data: params,
  });
}

export async function queryEditRule(id) {
  return request(`/entermgr/emlablerule/${id}/rules`, {
    method: 'get',
  });
}

export async function checkLabelName(labelName) {
  return request(`/entermgr/emlabel/check?labelName=${labelName}`, {
    method: 'get',
  });
}

export async function checkRule(params) {
  return request(`/entermgr/emlablerule/check`, {
    method: 'POST',
    data: params,
  });
}
