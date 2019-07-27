import { message } from 'antd';
import {
  queryNaTongTabs,
  queryNaTongTabelList,
  querySeedTabelList,
  queryDeleteNaTong,
  queryAddNaTong,
  queryDeleteSeed,
  queryInfoDatas,
} from './service';

export default {
  namespace: 'naTongMgr',
  state: {
    naTongTabsList: [],
    naTongTabelList: [],
    seedTabelList: [],
    infoDatas: [],
  },
  effects: {
    *queryNaTongTabs({ payload }, { call, put }) {
      const result = yield call(queryNaTongTabs, payload);
      yield put({
        type: 'saveNaTongTabsList',
        naTongTabsList: result,
      });
    },

    *queryNaTongTabelList({ payload, callback }, { call, put }) {
      const result = yield call(
        queryNaTongTabelList,
        payload.pageNum,
        payload.pageSize,
        payload.databaseId,
        payload.enterpriseName
      );
      yield put({
        type: 'saveNaTongTabelList',
        naTongTabelList: result,
      });
      if (result) {
        callback();
      }
    },

    *querySeedTabelList({ payload, callback }, { call, put }) {
      const result = yield call(
        querySeedTabelList,
        payload.pageNum,
        payload.pageSize,
        payload.enterpriseName
      );
      yield put({
        type: 'saveSeedTabelList',
        seedTabelList: result,
      });
      if (result) {
        callback();
      }
    },

    *queryDeleteNaTong({ payload, callback }, { call }) {
      const result = yield call(queryDeleteNaTong, payload.id);
      if (result.success) {
        message.success('移除成功');
        callback();
      } else {
        message.error('异常错误');
      }
    },

    *queryAddNaTong({ payload, callback }, { call }) {
      const result = yield call(queryAddNaTong, payload.id, payload.typeId);
      if (result.success) {
        message.success('加入成功');
        callback();
      } else {
        message.error('异常错误');
      }
    },

    *queryDeleteSeed({ payload, callback }, { call }) {
      const result = yield call(queryDeleteSeed, payload.id);
      if (result.success) {
        message.success('移除成功');
        callback();
      } else {
        message.error('异常错误');
      }
    },

    *queryInfoDatas({ payload }, { call, put }) {
      const result = yield call(queryInfoDatas, payload.id);
      yield put({
        type: 'saveinfoDatas',
        infoDatas: result,
      });
    },
  },
  reducers: {
    saveNaTongTabsList(state, { naTongTabsList }) {
      return {
        ...state,
        naTongTabsList,
      };
    },
    saveNaTongTabelList(state, { naTongTabelList }) {
      return {
        ...state,
        naTongTabelList,
      };
    },
    saveSeedTabelList(state, { seedTabelList }) {
      return {
        ...state,
        seedTabelList,
      };
    },
    saveinfoDatas(state, { infoDatas }) {
      return {
        ...state,
        infoDatas,
      };
    },
  },
};
