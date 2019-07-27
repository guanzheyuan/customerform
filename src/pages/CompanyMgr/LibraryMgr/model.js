import { queryLibrarylist } from './service';

export default {
  namespace: 'library',
  state: {
    libraryList: [],
  },
  effects: {
    *queryLibrarylist({ payload }, { call, put }) {
      const result = yield call(
        queryLibrarylist,
        payload.pageNum,
        payload.pageSize,
        payload.searchParam
      );
      yield put({
        type: 'saveLibrarylist',
        libraryList: result,
      });
    },
  },
  reducers: {
    saveLibrarylist(state, { libraryList }) {
      return {
        ...state,
        libraryList,
      };
    },
  },
};
