import {
  queryWorkTaskType,
  queryOrgAndUser,
  queryTodoList,
  dealWorkOrderTask,
  queryAuditForm,
  queryChildrenOrgListOfCurOrg,
  queryAllPersonResponseInfo,
  queryGridList,
  getEnterReportList,
  getZxwgyEnterReportList,
  getWgzxEnterReportList,
  batchCheck,
  getRespPersonList,
  getRespDeptList,
  queryEvaluateDict,
  addEvaluate,
  addRemarks,
} from './service';

export default {
  namespace: 'todoTask',
  state: {
    todoTaskData: {},
    workTaskTypeList: [],
    orgUserData: undefined,
    auditForm: {
      workOrderInfo: {
        workOrderBaseInfo: {},
        attachmentList: [],
      },
      auditList: [],
    },
    orgList: [],
    gridList: [],
    allPersonList: [],
    reportList: [],
    zxwgyReportList: [],
    wgzxReportList: [],
    evaluatePersonList: [],
    evaluateDeptList: [],
    evaluateDict: {
      workFinishSituation: [],
      workSatisfaction: [],
      workFinishQuality: [],
    },
  },
  effects: {
    *fetchWorkTaskType(_, { call, put }) {
      const result = yield call(queryWorkTaskType);
      yield put({
        type: 'saveWorkType',
        workTaskTypeList: result,
      });
    },
    *fetchOrgAndUser({ id }, { call, put }) {
      const result = yield call(queryOrgAndUser, id);
      yield put({
        type: 'saveOrgAndUser',
        orgUserData: result.data,
      });
    },
    *queryTodoTaskList({ params }, { call, put }) {
      const result = yield call(queryTodoList, params);
      yield put({
        type: 'saveTodoTask',
        todoTaskData: result.data,
      });
    },
    *dealTask({ params, callback }, { call }) {
      const result = yield call(dealWorkOrderTask, params);
      callback(result);
    },
    *queryAuditForm({ id }, { call, put }) {
      const result = yield call(queryAuditForm, id);
      yield put({
        type: 'saveAuditForm',
        auditForm: result.data,
      });
    },
    *queryChildrenOrgListOfCurOrg(_, { call, put }) {
      const result = yield call(queryChildrenOrgListOfCurOrg);
      yield put({
        type: 'saveOrgList',
        orgList: result.data,
      });
    },
    *queryAllPersonResponseInfo({ cb }, { call, put }) {
      const result = yield call(queryAllPersonResponseInfo);
      yield put({
        type: 'saveAllPerson',
        allPersonList: result.data,
      });
      cb();
    },
    *queryGridList(_, { call, put }) {
      const result = yield call(queryGridList);
      yield put({
        type: 'saveGridList',
        gridList: result,
      });
    },
    *getEnterReportList({ params }, { call, put }) {
      const result = yield call(getEnterReportList, params);
      yield put({
        type: 'saveReportList',
        reportList: result.data,
      });
    },
    *getZxwgyEnterReportList({ params }, { call, put }) {
      const result = yield call(getZxwgyEnterReportList, params);
      yield put({
        type: 'saveZxwgyReportList',
        zxwgyReportList: result.data,
      });
    },
    *getWgzxEnterReportList({ params }, { call, put }) {
      const result = yield call(getWgzxEnterReportList, params);
      yield put({
        type: 'saveWgzxReportList',
        wgzxReportList: result.data,
      });
    },
    *batchCheck({ params }, { call }) {
      yield call(batchCheck, params);
    },
    *getRespPersonList({ workOrderId }, { call, put }) {
      const result = yield call(getRespPersonList, workOrderId);
      yield put({
        type: 'saveEvaluatePersonList',
        evaluatePersonList: result,
      });
    },
    *getRespDeptList({ workOrderId }, { call, put }) {
      const result = yield call(getRespDeptList, workOrderId);
      yield put({
        type: 'saveEvaluateDeptList',
        evaluateDeptList: result,
      });
    },
    *queryEvaluateDict(_, { call, put }) {
      const result = yield call(queryEvaluateDict);
      yield put({
        type: 'saveEvaluateDict',
        evaluateDict: result,
      });
    },
    *addEvaluate({ params }, { call }) {
      yield call(addEvaluate, params);
    },
    *addRemarks({ params }, { call }) {
      yield call(addRemarks, params);
    },
  },
  reducers: {
    saveWorkType(state, { workTaskTypeList }) {
      return {
        ...state,
        workTaskTypeList,
      };
    },
    saveOrgAndUser(state, { orgUserData }) {
      return {
        ...state,
        orgUserData,
      };
    },
    saveTodoTask(state, { todoTaskData }) {
      return {
        ...state,
        todoTaskData,
      };
    },
    saveAuditForm(state, { auditForm }) {
      return {
        ...state,
        auditForm,
      };
    },
    saveOrgList(state, { orgList }) {
      return {
        ...state,
        orgList,
      };
    },
    saveGridList(state, { gridList }) {
      return {
        ...state,
        gridList,
      };
    },
    saveAllPerson(state, { allPersonList }) {
      return {
        ...state,
        allPersonList,
      };
    },
    saveReportList(state, { reportList }) {
      return {
        ...state,
        reportList,
      };
    },
    saveZxwgyReportList(state, { zxwgyReportList }) {
      return {
        ...state,
        zxwgyReportList,
      };
    },
    saveWgzxReportList(state, { wgzxReportList }) {
      return {
        ...state,
        wgzxReportList,
      };
    },
    saveEvaluatePersonList(state, { evaluatePersonList }) {
      return {
        ...state,
        evaluatePersonList,
      };
    },
    saveEvaluateDeptList(state, { evaluateDeptList }) {
      return {
        ...state,
        evaluateDeptList,
      };
    },
    saveEvaluateDict(state, { evaluateDict }) {
      return {
        ...state,
        evaluateDict,
      };
    },
  },
};
