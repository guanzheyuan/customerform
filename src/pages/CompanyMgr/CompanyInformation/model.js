import { queryInformationList } from './service';

export default {
  namespace: 'information',
  state: {
    informationList: {},
  },
  effects: {
    *fetchInformation({ payload }, { call, put }) {
      const result = yield call(queryInformationList, payload);
      yield put({
        type: 'saveInformationList',
        informationList: result,
      });
    },
  },
  reducers: {
    saveInformationList(state, { informationList }) {
      return {
        ...state,
        informationList,
      };
    },
  },
};
