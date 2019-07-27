import queryProcessTaskList, { queryOrderDetail } from './service';

export default {
  namespace: 'processTask',
  state: {
    processTaskData: {},
    workOrderInfo: {
      workOrderBaseInfo: {},
      attachmentList: [],
    },
    auditList: [],
  },
  effects: {
    *queryProcessTaskList({ params }, { call, put }) {
      const result = yield call(queryProcessTaskList, params);
      yield put({
        type: 'saveProcessTask',
        processTaskData: result.data,
      });
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
    saveProcessTask(state, { processTaskData }) {
      return {
        ...state,
        processTaskData,
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
