import {
  queryRaiseType,
  getRaiseStatistic,
  querySeedList,
  queryEntpList,
  queryPlanList,
  queryNotiList,
  updateEntp,
  deleteEntp,
  addSeedToCul,
  deleteSeed,
  updateMutiSeed,
  updateSeed,
} from './service';

export default {
  namespace: 'raiseMgr',
  state: {
    typeList: [],
    // 统计数据
    tjdata: {},
    // 种子库数据
    zzkdata: {},
    // 企业列表
    entpdata: {},
    // 计划列表
    plandata: {},
    // 通知列表
    notidata: {},
  },
  effects: {
    *queryRaiseType({ callback }, { call, put }) {
      const result = yield call(queryRaiseType);
      yield put({
        type: 'saveRaiseType',
        typeList: result,
        callback,
      });
      callback(result);
    },
    *getRaiseStatistic({ id }, { call, put }) {
      const result = yield call(getRaiseStatistic, id);
      yield put({
        type: 'saveStatistic',
        id,
        data: result,
      });
    },
    *querySeedList({ params }, { call, put }) {
      const result = yield call(querySeedList, params);
      yield put({
        type: 'saveSeedList',
        id: params.databaseId,
        data: result,
      });
    },
    *queryEntpList({ params }, { call, put }) {
      const result = yield call(queryEntpList, params);
      yield put({
        type: 'saveEntpList',
        id: params.databaseId,
        data: result,
      });
    },
    *queryPlanList({ params }, { call, put }) {
      const result = yield call(queryPlanList, params);
      yield put({
        type: 'savePlanList',
        id: params.databaseId,
        data: result,
      });
    },
    *queryNotiList({ params }, { call, put }) {
      const result = yield call(queryNotiList, params);
      yield put({
        type: 'saveNotiList',
        id: params.databaseId,
        data: result,
      });
    },

    // 企业培育成功
    *successEntp({ id, callback }, { call }) {
      const params = {
        id,
        isSuccess: '1',
      };
      const result = yield call(updateEntp, params);
      callback(result);
    },
    // 企业培育移除s
    *deleteEntp({ id, callback }, { call }) {
      const result = yield call(deleteEntp, id);
      callback(result);
    },
    // 种子库-加入培育库
    *addSeedToCul({ id, callback }, { call }) {
      const result = yield call(addSeedToCul, id);
      callback(result);
    },
    // 种子库-移除
    *deleteSeed({ id, callback }, { call }) {
      const result = yield call(deleteSeed, id);
      callback(result);
    },
    // 种子库-全量更新
    *updateMutiSeed({ params, callback }, { call }) {
      const result = yield call(updateMutiSeed, params);
      callback(result);
    },
    // 种子库-更新
    *updateSeed({ params, callback }, { call }) {
      const result = yield call(updateSeed, params);
      callback(result);
    },
  },
  reducers: {
    saveRaiseType(state, { typeList }) {
      const tjdata = {};
      const zzkdata = {};
      const entpdata = {};
      const plandata = {};
      const notidata = {};
      typeList.map(item => {
        const key = item.id.toString();
        if (tjdata[key] === undefined) {
          tjdata[key] = [];
        }
        if (zzkdata[key] === undefined) {
          zzkdata[key] = { list: [], total: 0, pageNum: 1, pageSize: 5, searchContent: '' };
        }
        if (entpdata[key] === undefined) {
          entpdata[key] = { list: [], total: 0, pageNum: 1, pageSize: 5 };
        }
        if (plandata[key] === undefined) {
          plandata[key] = { list: [], total: 0, pageNum: 1, pageSize: 5 };
        }
        if (notidata[key] === undefined) {
          notidata[key] = { list: [], total: 0, pageNum: 1, pageSize: 5 };
        }
        return item;
      });
      return {
        ...state,
        typeList,
        zzkdata,
        entpdata,
        plandata,
        notidata,
      };
    },
    saveStatistic(state, { id, data }) {
      const { tjdata } = state;
      tjdata[id] = [
        {
          key: 0,
          name: '独角兽企业数量',
          count: data.entpCount,
        },
        {
          key: 1,
          name: '培育库企业数量',
          count: data.cultivateEntpCount,
        },
        {
          key: 2,
          name: '种子库企业数量',
          count: data.seedEntpCount,
        },
        {
          key: 3,
          name: '培育成功企业数量',
          count: data.successCultivateEntpCount,
        },
      ];
      return {
        ...state,
        tjdata,
      };
    },
    saveSeedList(state, { id, data }) {
      const { zzkdata } = state;
      zzkdata[id].list = data.list;
      zzkdata[id].total = data.total;
      zzkdata[id].pageNum = data.pageNum;
      zzkdata[id].pageSize = data.pageSize;
      return {
        ...state,
        zzkdata,
      };
    },
    saveEntpList(state, { id, data }) {
      const { entpdata } = state;
      entpdata[id].list = data.list;
      entpdata[id].total = data.total;
      entpdata[id].pageNum = data.pageNum;
      entpdata[id].pageSize = data.pageSize;
      return {
        ...state,
        entpdata,
      };
    },
    savePlanList(state, { id, data }) {
      const { plandata } = state;
      plandata[id].list = data.list;
      plandata[id].total = data.total;
      plandata[id].pageNum = data.pageNum;
      plandata[id].pageSize = data.pageSize;
      return {
        ...state,
        plandata,
      };
    },
    saveNotiList(state, { id, data }) {
      const { notidata } = state;
      notidata[id].list = data.list;
      notidata[id].total = data.total;
      notidata[id].pageNum = data.pageNum;
      notidata[id].pageSize = data.pageSize;
      return {
        ...state,
        notidata,
      };
    },
  },
};
