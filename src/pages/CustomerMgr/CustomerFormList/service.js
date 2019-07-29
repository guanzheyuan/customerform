// import { stringify } from 'qs';
import request from '@/utils/request';

// export async function queryFormList1(params) {
//   return request(`/entermgr/epattrextlabeldisplay/page?${stringify(params)}`);
// }

export async function queryFormList(params) {
  return request('/customer/estCustomerform/queryCustomerform', {
    method: 'post',
    data: {
      ...params,
    },
  });
}

export async function addForm(params) {
  return request('/customer/estCustomerform/insert', {
    method: 'post',
    data: {
      ...params,
    },
  });
}

export async function editForm(params) {
  return request('/customer/estCustomerform/update', {
    method: 'post',
    data: {
      ...params,
    },
  });
}

export async function deleteFormData(id) {
  return request(`/customer/estCustomerform/delete/${id}`, {
    method: 'delete',
  });
}
