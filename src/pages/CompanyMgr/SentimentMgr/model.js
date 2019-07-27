import { echartsSource, TrendsSource } from './service';

export default {
  namespace: 'sentimentMgr',
  state: {
    echartsData: [],
    TrendsData: [],
  },
  effects: {
    *searchData({ payload }, { call, put }) {
      const response = yield call(echartsSource, payload);
      yield put({
        type: 'echartsData',
        echartsData: response,
      });
    },
    *TrendsList({ payload }, { call, put }) {
      const result = yield call(TrendsSource, payload);
      yield put({
        type: 'TrendsData',
        TrendsData: result,
      });
    },
  },
  reducers: {
    echartsData(state, { echartsData }) {
      return {
        ...state,
        echartsData,
      };
    },
    TrendsData(state, { TrendsData }) {
      return {
        ...state,
        TrendsData,
      };
    },
  },
};
