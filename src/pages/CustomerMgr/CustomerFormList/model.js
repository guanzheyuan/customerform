// import { message } from 'antd';
import { queryCompanyArchive } from './service';

export default {
  namespace: 'companyArchive',
  state: {
    archiveListResult: {},
    archiveContentTypeList: [],
    orgUserData: undefined,
    archiveInfo: {
      archiveBaseInfo: {},
    },
  },
  effects: {
    *fetchArchive({ params }, { call, put }) {
      const result = yield call(queryCompanyArchive, params);
      yield put({
        type: 'save',
        archiveListResult: result,
      });
    },
  },
  reducers: {
    save(state, { archiveListResult }) {
      return {
        ...state,
        archiveListResult,
      };
    },
  },
};
