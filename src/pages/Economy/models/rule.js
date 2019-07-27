import { queryRule, removeRule, addRule, updateRule } from '@/services/api';
import {
  getList,
  getJjyxidexinfoList,
  addJjyxidexinfoList,
  deleteJjyxidexinfo,
  deleteJjyxidexTargetYear,
  updateJjyxidexinfo,
  selectTargetYearList,
  addTargetYear,
  updateTargetYear,
  selectTargetProcessList,
  getProjectTargetYearList,
  addProjectTargetYear,
  deleteJjyxProjectTarget,
  updateProjectTargetYear,
  addProjectActualProcess,
  getJjyxProjectActualProcess,
  deleteProjectTargetYear,
  addJjyxidexinfo,
} from '@/services/economyApi';

export default {
  namespace: 'rule',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    result: {},
    targetProcess: {},
    projectTarget: {},
    actualProcess: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRule, payload);
      // eslint-disable-next-line camelcase
      const s_response = {
        data: response,
      };
      yield put({
        type: 'save',
        payload: s_response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *getList({ payload, callback }, { call, put }) {
      const param = payload;
      const response = yield call(getList, param);
      // eslint-disable-next-line camelcase
      const s_response = { result: response };
      yield put({
        type: 'save',
        payload: s_response,
      });
      if (callback) callback();
    },
    *getJjyxidexinfoList({ payload, callback }, { call, put }) {
      const param = payload;
      const response = yield call(getJjyxidexinfoList, param);
      // eslint-disable-next-line camelcase
      const s_response = { targetData: { list: response } };
      yield put({
        type: 'save',
        payload: s_response,
      });
      if (callback) callback(response);
    },
    *addJjyxidexinfo({ payload, callback }, { call, put }) {
      const param = payload;
      const response = yield call(addJjyxidexinfo, param);
      // eslint-disable-next-line camelcase
      const s_response = { result: response };
      yield put({
        type: 'save',
        payload: s_response,
      });
      if (callback) callback(response);
    },
    *addJjyxidexinfoList({ payload, callback }, { call, put }) {
      const param = payload;
      const response = yield call(addJjyxidexinfoList, param);
      // eslint-disable-next-line camelcase
      const s_response = { result: response };
      yield put({
        type: 'save',
        payload: s_response,
      });
      if (callback) callback(response);
    },
    *deleteJjyxidexinfo({ payload, callback }, { call, put }) {
      const param = payload;
      const response = yield call(deleteJjyxidexinfo, param);
      // eslint-disable-next-line camelcase
      const s_response = { result: response };
      yield put({
        type: 'save',
        payload: s_response,
      });
      if (callback) callback(response);
    },
    *deleteJjyxidexTargetYear({ payload, callback }, { call, put }) {
      const param = payload;
      const response = yield call(deleteJjyxidexTargetYear, param);
      // eslint-disable-next-line camelcase
      const s_response = { result: response };
      yield put({
        type: 'save',
        payload: s_response,
      });
      if (callback) callback(response);
    },
    *updateJjyxidexinfo({ payload, callback }, { call, put }) {
      const param = payload;
      const response = yield call(updateJjyxidexinfo, param);
      // eslint-disable-next-line camelcase
      const s_response = { result: response };
      yield put({
        type: 'save',
        payload: s_response,
      });
      if (callback) callback(response);
    },
    *selectTargetYearList({ payload, callback }, { call, put }) {
      const param = payload;
      const response = yield call(selectTargetYearList, param);
      // eslint-disable-next-line camelcase
      const s_response = { targetData: { list: response } };
      yield put({
        type: 'save',
        payload: s_response,
      });
      if (callback) callback(response);
    },
    *addTargetYear({ payload, callback }, { call, put }) {
      const param = payload;
      const response = yield call(addTargetYear, param);
      // eslint-disable-next-line camelcase
      const s_response = { result: response };
      yield put({
        type: 'save',
        payload: s_response,
      });
      if (callback) callback(response);
    },
    *updateTargetYear({ payload, callback }, { call, put }) {
      const param = payload;
      const response = yield call(updateTargetYear, param);
      // eslint-disable-next-line camelcase
      const s_response = { result: response };
      yield put({
        type: 'save',
        payload: s_response,
      });
      if (callback) callback(response);
    },
    *selectTargetProcessList({ payload, callback }, { call, put }) {
      const param = payload;
      const response = yield call(selectTargetProcessList, param);
      // eslint-disable-next-line camelcase
      const s_response = { targetProcess: response };
      yield put({
        type: 'save',
        payload: s_response,
      });
      if (callback) callback(response);
    },
    *getProjectTargetYearList({ payload, callback }, { call, put }) {
      const param = payload;
      const response = yield call(getProjectTargetYearList, param);
      // eslint-disable-next-line camelcase
      const s_response = { projectTarget: { list: response } };
      yield put({
        type: 'save',
        payload: s_response,
      });
      if (callback) callback(response);
    },
    *addProjectTargetYear({ payload, callback }, { call, put }) {
      const param = payload;
      const response = yield call(addProjectTargetYear, param);
      // eslint-disable-next-line camelcase
      const s_response = { result: response };
      yield put({
        type: 'save',
        payload: s_response,
      });
      if (callback) callback(response);
    },
    *deleteJjyxProjectTarget({ payload, callback }, { call, put }) {
      const param = payload;
      const response = yield call(deleteJjyxProjectTarget, param);
      // eslint-disable-next-line camelcase
      const s_response = { result: response };
      yield put({
        type: 'save',
        payload: s_response,
      });
      if (callback) callback(response);
    },
    *updateProjectTargetYear({ payload, callback }, { call, put }) {
      const param = payload;
      const response = yield call(updateProjectTargetYear, param);
      // eslint-disable-next-line camelcase
      const s_response = { result: response };
      yield put({
        type: 'save',
        payload: s_response,
      });
      if (callback) callback(response);
    },
    *addProjectActualProcess({ payload, callback }, { call, put }) {
      const param = payload;
      const response = yield call(addProjectActualProcess, param);
      // eslint-disable-next-line camelcase
      const s_response = { result: response };
      yield put({
        type: 'save',
        payload: s_response,
      });
      if (callback) callback(response);
    },
    *getJjyxProjectActualProcess({ payload, callback }, { call, put }) {
      const param = payload;
      const response = yield call(getJjyxProjectActualProcess, param);
      // eslint-disable-next-line camelcase
      const s_response = { actualProcess: response };
      yield put({
        type: 'save',
        payload: s_response,
      });
      if (callback) callback(response);
    },
    *deleteProjectTargetYear({ payload, callback }, { call, put }) {
      const param = payload;
      const response = yield call(deleteProjectTargetYear, param);
      // eslint-disable-next-line camelcase
      const s_response = { result: response };
      yield put({
        type: 'save',
        payload: s_response,
      });
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
