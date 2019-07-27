import { message } from 'antd';
import {
  queryCompanyArchive,
  submitCompanyArchive,
  queryCompanyArchiveContentType,
  deleteCompanyArchive,
  saveCompanyArchive,
  queryCompanyArchiveDetail,
  changeArchiveState,
} from './service';

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
    *fetchContentType(_, { call, put }) {
      const result = yield call(queryCompanyArchiveContentType);
      yield put({
        type: 'saveContentType',
        archiveContentTypeList: result,
      });
    },
    *changeArchiveState({ payload, callback }, { call }) {
      const result = yield call(changeArchiveState, payload);
      if (result.success) {
        if (payload.isValid === 1) {
          message.success('启用成功');
        } else {
          message.success('禁用成功');
        }
      } else {
        message.error(result.msg);
      }
      callback();
    },
    *submitArchive({ payload, callback }, { call }) {
      yield call(submitCompanyArchive, payload);
      callback();
    },
    *saveArchive({ payload, callback }, { call }) {
      yield call(saveCompanyArchive, payload);
      callback();
    },
    *deleteArchive({ id, callback }, { call }) {
      const result = yield call(deleteCompanyArchive, id);
      if (result.success) {
        message.success('删除成功');
      } else {
        message.error(result.msg);
      }
      callback();
    },
    *queryArchiveDetail({ archiveId }, { call, put }) {
      const result = yield call(queryCompanyArchiveDetail, archiveId);
      yield put({
        type: 'saveArchiveDetail',
        archiveInfo: result.data.archiveBaseInfo,
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
    saveContentType(state, { archiveContentTypeList }) {
      return {
        ...state,
        archiveContentTypeList,
      };
    },
    saveArchiveDetail(state, { archiveInfo }) {
      return {
        ...state,
        archiveInfo,
      };
    },
  },
};
