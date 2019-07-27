import { queryCreditList } from './service';

export default {
  namespace: 'creditMgr',
  state: {
    creditList: [],
  },
  effects: {
    *queryCreditList({ payload }, { call, put }) {
      const result = yield call(
        queryCreditList,
        payload.pageNum,
        payload.pageSize,
        payload.searchParam
      );
      yield put({
        type: 'saveCreditList',
        creditList: result,
      });
    },
  },
  reducers: {
    saveCreditList(state, { creditList }) {
      return {
        ...state,
        creditList,
      };
    },
  },
};
