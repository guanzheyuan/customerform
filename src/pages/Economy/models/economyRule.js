import {
  getJjyxidexinfoList,
  searchtype,
  gridList,
  emlabelList,
  mapinfo,
  enterprisesearchtype,
  labeEnableList,
  enterprisegridList,
  getIndexValue,
  enterprisemapinfo,
  selectIndexTargetActualProcessList,
  adupIndexActualProcess,
  lotUpdateIndexActualProcess,
} from '@/services/economyApi';
import {
  queryGrid,
  queryGridArea,
  // eslint-disable-next-line import/no-unresolved
} from '../MoreOne/service';

export default {
  namespace: 'economyRule',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    result: {},
    areaPots: [],
    jjyxIndexListRes: {},
    gridListRes: {},
    emableRes: {},
    mapinfoRes: {},
    entepriseJjyxIndexListRes: {},
    entepriseGridListRes: {},
    entepriseEmableRes: {},
    entepriseMapinfoRes: {},
    targetData: {},
  },

  effects: {
    *getJjyxidexinfoList({ payload, callback }, { call, put }) {
      const param = payload;
      const response = yield call(getJjyxidexinfoList, param);
      // eslint-disable-next-line camelcase
      const s_response = { data: { list: response } };
      yield put({
        type: 'save',
        payload: s_response,
      });
      if (callback) callback(response);
    },
    *queryGrid({ payload }, { call, put }) {
      const result = yield call(queryGrid, payload.gridIdList, payload.projectStatus);
      yield put({
        type: 'saveGridDetail',
        gridDetails: result,
      });
    },
    *queryGridArea({ payload, callback }, { call, put }) {
      const result = yield call(queryGridArea, payload.gridIdList);
      yield put({
        type: 'saveGridArea',
        areaPots: result,
      });
      if (callback) callback(result);
    },
    *searchtype({ payload, callback }, { call, put }) {
      const result = yield call(searchtype, payload);
      yield put({
        type: 'saveType',
        jjyxIndexListRes: result,
      });
      if (callback) callback(result);
    },
    *gridList({ payload, callback }, { call, put }) {
      const result = yield call(gridList, payload);
      yield put({
        type: 'saveGrid',
        gridListRes: result,
      });
      if (callback) callback(result);
    },
    *emlabelList({ payload, callback }, { call, put }) {
      const result = yield call(emlabelList, payload);
      yield put({
        type: 'saveemlabel',
        emableRes: result,
      });
      if (callback) callback(result);
    },
    *mapinfo({ payload, callback }, { call, put }) {
      const result = yield call(mapinfo, payload);
      yield put({
        type: 'savemapinfo',
        mapinfoRes: result,
      });
      if (callback) callback(result);
    },
    *enterprisesearchtype({ payload, callback }, { call, put }) {
      const result = yield call(enterprisesearchtype, payload);
      yield put({
        type: 'saveenterprisetype',
        entepriseJjyxIndexListRes: result,
      });
      if (callback) callback(result);
    },
    *labeEnableList({ payload, callback }, { call, put }) {
      const result = yield call(labeEnableList, payload);
      yield put({
        type: 'savelabeenableList',
        entepriseEmableRes: result,
      });
      if (callback) callback(result);
    },
    *enterprisegridList({ payload, callback }, { call, put }) {
      const result = yield call(enterprisegridList, payload);
      yield put({
        type: 'saveenterprisegridList',
        entepriseGridListRes: result,
      });
      if (callback) callback(result);
    },
    *getIndexValue({ payload, callback }, { call, put }) {
      const result = yield call(getIndexValue, payload);
      yield put({
        type: 'saveenteprisemapinfo',
        entepriseMapinfoRes: result,
      });
      if (callback) callback(result);
    },
    *enterprisemapinfo({ payload, callback }, { call, put }) {
      const result = yield call(enterprisemapinfo, payload);
      yield put({
        type: 'saveenteprisemapinfo',
        entepriseMapinfoRes: result,
      });
      if (callback) callback(result);
    },
    *selectIndexTargetActualProcessList({ payload, callback }, { call, put }) {
      const result = yield call(selectIndexTargetActualProcessList, payload);
      // eslint-disable-next-line camelcase
      const s_response = { targetData: { list: result } };
      yield put({
        type: 'save',
        payload: s_response,
      });
      if (callback) callback(s_response);
    },
    *adupIndexActualProcess({ payload, callback }, { call, put }) {
      const result = yield call(adupIndexActualProcess, payload);
      yield put({
        type: 'save',
        result,
      });
      if (callback) callback(result);
    },
    *lotUpdateIndexActualProcess({ payload, callback }, { call, put }) {
      const result = yield call(lotUpdateIndexActualProcess, payload);
      yield put({
        type: 'save',
        result,
      });
      if (callback) callback(result);
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
