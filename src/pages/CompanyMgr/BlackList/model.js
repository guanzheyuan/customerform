import { blackList, removeBlackList } from './service';

export default {
  namespace: 'blackList',
  state: {
    blackListData: [],
  },
  effects: {
    *List({ payload }, { call, put }) {
      const result = yield call(
        blackList,
        payload.pageNum,
        payload.pageSize,
        payload.enterpriseName
      );
      yield put({
        type: 'saveBlackList',
        blackListData: result,
      });
    },
    *Delete({ payload, callback }, { call }) {
      yield call(removeBlackList, payload.id);
      callback();
    },
  },

  reducers: {
    saveBlackList(state, { blackListData }) {
      return {
        ...state,
        blackListData,
      };
    },
  },
};
