import { querySearchtype, queryLablelist, queryEnterprise } from './service';

export default {
  namespace: 'inquiry',
  state: {
    labelList: [],
    searchTypeList: [],
    enterpriseList: { list: [], total: -1 },
  },
  effects: {
    *querySearchtype(_, { call, put }) {
      const result = yield call(querySearchtype);
      yield put({
        type: 'saveSearchtype',
        searchTypeList: result,
      });
    },
    *queryLablelist(_, { call, put }) {
      const result = yield call(queryLablelist);
      yield put({
        type: 'saveLablelist',
        labelList: result,
      });
    },
    *queryEnterprise({ payload }, { call, put }) {
      const result = yield call(
        queryEnterprise,
        payload.pageNum,
        payload.pageSize,
        payload.searchParam
      );
      yield put({
        type: 'saveEnterprise',
        enterpriseList: result,
        pageNum: payload.pageNum,
      });
    },
  },
  reducers: {
    saveSearchtype(state, { searchTypeList }) {
      return {
        ...state,
        searchTypeList,
      };
    },
    saveLablelist(state, { labelList }) {
      return {
        ...state,
        labelList,
      };
    },
    saveEnterprise(state, { enterpriseList, pageNum }) {
      const {
        enterpriseList: { list },
      } = state;
      if (pageNum === 0) {
        return {
          ...state,
          enterpriseList,
        };
      }

      return {
        ...state,
        ...{
          enterpriseList: { list: list.concat(enterpriseList.list), total: enterpriseList.total },
        },
      };
    },
  },
};
