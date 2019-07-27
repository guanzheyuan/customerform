import { getTaskFormInfoById, getEditTask, saveFormInfo } from './service';

export default {
  namespace: 'companyinfo',
  state: {
    taskFormInfo: { formName: '', formElements: [] },
    editTask: { formName: '', formElements: [] },
  },
  effects: {
    *getTaskFormInfoById({ payload }, { call, put }) {
      const result = yield call(getTaskFormInfoById, payload.param);
      yield put({
        type: 'saveTaskFormInfo',
        taskFormInfo: result,
      });
    },
    *getEditTask({ payload }, { call, put }) {
      const result = yield call(getEditTask, payload.id);
      yield put({
        type: 'saveEditTask',
        editTask: result,
      });
    },
    *saveFormInfo({ payload, callback }, { call }) {
      const result = yield call(saveFormInfo, payload.param);
      callback(result);
    },
  },
  reducers: {
    saveTaskFormInfo(state, { taskFormInfo }) {
      return {
        ...state,
        taskFormInfo,
      };
    },
    saveEditTask(state, { editTask }) {
      return {
        ...state,
        editTask,
      };
    },
  },
};
