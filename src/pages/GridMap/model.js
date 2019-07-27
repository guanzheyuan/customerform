import {
  queryAllGridList,
  queryGridDetails,
  queryGridCompanys,
  queryDefaultGrid,
  queryDefaultArea,
  queryDefaultCompany,
  deleteTreeNode,
  addGrid,
  updateGrid,
  getGridRespPerson,
} from './service';

export default {
  namespace: 'gridmap',
  state: {
    gridList: [],
    gridDetails: {
      areaList: [],
      areaPoint: [],
      gridLevel: -1,
      staffUserDto: { staffId: '', phone: '' },
    },
    gridCompanys: { list: [], total: 0, pageNum: 0 },
    defaultGrid: [],
    defaultArea: [],
    defaultCompany: [],
    gridRespPerson: [],
  },
  effects: {
    *queryGridList(_, { call, put }) {
      const result = yield call(queryAllGridList);
      yield put({
        type: 'saveGridList',
        gridList: result,
      });
    },
    *queryGridDetail({ payload, callback }, { call, put }) {
      const result = yield call(queryGridDetails, payload.param);
      callback(result);
      yield put({
        type: 'saveGridDetail',
        gridDetails: result,
      });
    },
    *queryGridCompany({ payload }, { call, put }) {
      const result = yield call(queryGridCompanys, payload.id, payload.pageNum, payload.pageSize);
      yield put({
        type: 'saveGridCompany',
        gridCompanys: result,
      });
    },
    *queryDefaultGrid(_, { call, put }) {
      const result = yield call(queryDefaultGrid);
      yield put({
        type: 'saveDefaultGrid',
        defaultGrid: result,
      });
    },
    *queryDefaultArea(_, { call, put }) {
      const result = yield call(queryDefaultArea);
      yield put({
        type: 'saveDefaultArea',
        defaultArea: result,
      });
    },
    *queryDefaultCompany(_, { call, put }) {
      const result = yield call(queryDefaultCompany);
      yield put({
        type: 'saveDefaultCompany',
        defaultCompany: result,
      });
    },
    *deleteTreeNode({ payload, callback }, { call }) {
      const result = yield call(deleteTreeNode, payload.param);
      callback(result);
    },
    *addGrid({ payload, callback }, { call }) {
      const result = yield call(addGrid, payload.param);
      callback(result);
    },
    *updateGrid({ payload, callback }, { call }) {
      const result = yield call(updateGrid, payload.param);
      callback(result);
    },
    *getGridRespPerson(_, { call, put }) {
      const result = yield call(getGridRespPerson);
      yield put({
        type: 'saveGridRespPerson',
        gridRespPerson: result,
      });
    },
  },
  reducers: {
    saveGridList(state, { gridList }) {
      return {
        ...state,
        gridList,
      };
    },
    saveGridDetail(state, { gridDetails }) {
      return {
        ...state,
        gridDetails,
      };
    },
    saveGridCompany(state, { gridCompanys }) {
      return {
        ...state,
        gridCompanys,
      };
    },
    saveDefaultGrid(state, { defaultGrid }) {
      return {
        ...state,
        defaultGrid,
      };
    },
    saveDefaultArea(state, { defaultArea }) {
      return {
        ...state,
        defaultArea,
      };
    },
    saveDefaultCompany(state, { defaultCompany }) {
      return {
        ...state,
        defaultCompany,
      };
    },
    saveGridRespPerson(state, { gridRespPerson }) {
      return {
        ...state,
        gridRespPerson,
      };
    },
  },
};
