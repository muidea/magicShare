import { queryIndex, batchAddFile } from 'services/index'
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
      yield put({ type: 'save', payload: { summaryList: media, serverUrl, readOnly: !onlineUser, addNewFlag: false } })
    },

    *addNew({ payload }, { put, select }) {
      const { onlineUser } = yield select(_ => _.app)
      if (onlineUser) {
        yield put({ type: 'save', payload: { addNewFlag: true } })
      }
    },

    *submitNew({ payload }, { put, call, select }) {
      const { fileList, description, catalog, privacy, expiration } = payload
      const { sessionID, authToken } = yield select(_ => _.app)
      const result = yield call(batchAddFile, { medias: fileList, description, catalog, expiration, privacy, sessionID, authToken })
      const { errorCode } = result
      if (errorCode === 0) {
        const queryResult = yield call(queryIndex, { ...payload })
        const { data } = queryResult
        const { media } = data
        yield put({ type: 'save', payload: { summaryList: media, addNewFlag: false } })
      }
    },

    *cancelNew({ payload }, { put }) {
      yield put({ type: 'save', payload: { addNewFlag: false } })
    },

  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload }
    },
  },
}
