import { queryIndex } from 'services/index'
import { config } from 'utils'
import qs from 'qs'

const { api } = config
const { fileRegistry } = api

export default {

  namespace: 'index',

  state: {
    summaryList: [],
    serverUrl: '',
    readOnly: true,
    addNewFlag: false,
    uploadFileList: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/') {
          dispatch({
            type: 'queryIndex',
            payload: qs.parse(location.search),
          })
        }
      })
    },
  },

  effects: {
    *queryIndex({ payload }, { call, put, select }) {
      const { onlineUser, sessionID, authToken } = yield select(_ => _.app)

      const result = yield call(queryIndex, { ...payload })
      const { data } = result
      const { media } = data
      const param = qs.stringify({ sessionID, authToken, 'key-name': 'file' })
      const serverUrl = `${fileRegistry}?${param}`
      yield put({ type: 'save', payload: { summaryList: media, serverUrl, readOnly: !onlineUser } })
    },

    *addNew({ payload }, { put, select }) {
      const { onlineUser } = yield select(_ => _.app)
      if (onlineUser) {
        yield put({ type: 'save', payload: { addNewFlag: true } })
      }
    },

    *submitNew({ payload }, { put, select }) {
      const { onlineUser } = yield select(_ => _.app)
      if (onlineUser) {
        yield put({ type: 'save', payload: { addNewFlag: false } })
      }
    },

    *cancelNew({ payload }, { put }) {
      yield put({ type: 'save', payload: { addNewFlag: false } })
    },

  },

  reducers: {
    updateFileList(state, { payload }) {
      const { fileList } = payload
      return { ...state, updateFileList: fileList }
    },

    save(state, action) {
      return { ...state, ...action.payload }
    },
  },
}
