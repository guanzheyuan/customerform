import {
  queryTopGridList,
  queryDownGridList,
  queryGrid,
  queryGridInfo,
  queryGridArea,
} from './service';

export default {
  namespace: 'moreOne',
  state: {
    gridTopList: [],
    gridDownList: [],
    gridDetails: [],
    gridInfo: [],
    gridArea: [],
  },
  effects: {
    *queryTopGridList(_, { call, put }) {
      const result = yield call(queryTopGridList);
      yield put({
        type: 'saveGridTopList',
        gridTopList: result,
      });
    },
    *queryDownGridList(_, { call, put }) {
      const result = yield call(queryDownGridList);
      yield put({
        type: 'saveGridDownList',
        gridDownList: result,
      });
    },
    *queryGrid({ payload }, { call, put }) {
      const result = yield call(queryGrid, payload.gridIdList, payload.projectStatus);
      yield put({
        type: 'saveGridDetail',
        gridDetails: result,
      });
    },
    *queryGridArea({ payload }, { call, put }) {
      const result = yield call(queryGridArea, payload.gridIdList);
      yield put({
        type: 'saveGridArea',
        gridArea: result,
      });
    },
    *queryGridInfo({ payload, callback }, { call, put }) {
      const result = yield call(queryGridInfo, payload.gridId);
      if (result.success) {
        callback(result.data);
      }
      yield put({
        type: 'saveGridInfo',
        gridInfo: result,
      });
    },
  },
  reducers: {
    saveGridTopList(state, { gridTopList }) {
      return {
        ...state,
        gridTopList,
      };
    },
    saveGridDownList(state, { gridDownList }) {
      return {
        ...state,
        gridDownList,
      };
    },
    saveGridDetail(state, { gridDetails }) {
      return {
        ...state,
        gridDetails,
      };
    },
    saveGridInfo(state, { gridInfo }) {
      return {
        ...state,
        gridInfo,
      };
    },
    saveGridArea(state, { gridArea }) {
      return {
        ...state,
        gridArea,
      };
    },
  },
};
