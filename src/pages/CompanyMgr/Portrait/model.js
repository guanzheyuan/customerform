/* eslint-disable array-callback-return */
/* eslint-disable no-array-constructor */
import { queryEnterpriseinfo, queryTablist, queryTabdetail } from './service';

export default {
  namespace: 'portrait',
  state: {
    enterpriseInfo: { data: { main_data_list: [] } },
    tabList: [],
    baseTab: '',
    enterpriseName: '',
    tabDetail: { '': '' },
  },
  effects: {
    *queryEnterpriseinfo({ payload }, { call, put }) {
      const result = yield call(queryEnterpriseinfo, payload);
      yield put({
        type: 'saveEnterpriseinfo',
        enterpriseInfo: result,
      });
    },
    *queryTablist({ payload, callback }, { call, put }) {
      const result = yield call(queryTablist, payload);
      callback(result.data[0].labelEname);
      yield put({
        type: 'saveTablist',
        tabList: result,
      });
    },
    *queryTabdetail({ payload }, { call, put }) {
      const result = yield call(queryTabdetail, payload);
      yield put({
        type: 'saveTabdetail',
        tabDetail: result,
        key: payload,
      });
    },
  },
  reducers: {
    saveEnterpriseinfo(state, { enterpriseInfo }) {
      return {
        ...state,
        enterpriseInfo,
      };
    },
    saveTablist(state, { tabList }) {
      const newTabList = new Array();
      let baseTab = '';
      const tabDetail = {};
      tabList.data.map((data, index) => {
        newTabList.push({ key: data.labelEname, tab: data.labelCname });
        tabDetail[data.labelEname] = '';
        if (index === 0) {
          baseTab = data.labelEname;
        }
      });
      baseTab = 'basic';
      return {
        ...state,
        ...{ tabList: newTabList, baseTab, tabDetail },
      };
    },
    saveTabdetail(state, { tabDetail, key }) {
      const tabInfo = state.tabDetail;
      tabInfo[key] = tabDetail.data;
      return {
        ...state,
        ...{ tabDetail: tabInfo },
      };
    },
  },
};
