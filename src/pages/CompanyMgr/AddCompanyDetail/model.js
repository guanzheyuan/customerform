import { getElementDataSource } from './service';

export default {
  namespace: 'addcompany',
  state: {
    elementData: [],
  },
  effects: {
    *getElementDataSource(_, { call, put }) {
      const result = yield call(getElementDataSource);
      yield put({
        type: 'saveElementDataSource',
        elementData: result,
      });
    },
  },
  reducers: {
    saveElementDataSource(state, { elementData }) {
      return {
        ...state,
        elementData,
      };
    },
  },
};
