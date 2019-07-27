import {
  queryWorkOrder,
  submitWorkOrder,
  queryWorkTaskType,
  deleteWorkOrder,
  queryOrgAndUser,
  saveWorkOrder,
  queryOrderDetail,
} from './service';

export default {
  namespace: 'workOrder',
  state: {
    orderListResult: {},
    workTaskTypeList: [],
    orgUserData: undefined,
    workOrderInfo: {
      workOrderBaseInfo: {},
      attachmentList: [],
    },
    auditList: [],
  },
  effects: {
    *fetchWorkOrder({ params }, { call, put }) {
      const result = yield call(queryWorkOrder, params);
      yield put({
        type: 'save',
        orderListResult: result.data,
      });
    },
    *fetchOrgAndUser({ id }, { call, put }) {
      const result = yield call(queryOrgAndUser, id);
      yield put({
        type: 'saveOrgAndUser',
        orgUserData: result.data,
      });
    },
    *fetchWorkTaskType(_, { call, put }) {
      const result = yield call(queryWorkTaskType);
      yield put({
        type: 'saveWorkType',
        workTaskTypeList: result,
      });
    },
    *submitWorkOrder({ payload, callback }, { call }) {
      yield call(submitWorkOrder, payload);
      callback();
    },
    *saveWorkOrder({ payload, callback }, { call }) {
      yield call(saveWorkOrder, payload);
      callback();
    },
    *deleteWorkOrder({ id, callback }, { call }) {
      yield call(deleteWorkOrder, id);
      callback();
    },
    *queryOrderDetail({ workOrderId }, { call, put }) {
      const result = yield call(queryOrderDetail, workOrderId);
      yield put({
        type: 'saveOrderDetail',
        workOrderInfo: result.data.workOrderInfo,
        auditList: result.data.auditList,
      });
    },
  },
  reducers: {
    save(state, { orderListResult }) {
      return {
        ...state,
        orderListResult,
      };
    },
    saveOrgAndUser(state, { orgUserData }) {
      return {
        ...state,
        orgUserData,
      };
    },
    saveWorkType(state, { workTaskTypeList }) {
      return {
        ...state,
        workTaskTypeList,
      };
    },
    saveOrderDetail(state, { workOrderInfo, auditList }) {
      return {
        ...state,
        workOrderInfo,
        auditList,
      };
    },
  },
};
