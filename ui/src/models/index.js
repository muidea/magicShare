import { queryAllFile, deleteFile, batchAddFile } from 'services/index'
import { config } from 'utils'
import qs from 'qs'

const { fileRegistry } = config

export default {

  namespace: 'index',

  state: {
    summaryList: [],
    privacyPolicy: [],
    serverUrl: '',
    readOnly: true,
    addNewFlag: false,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/') {
          dispatch({
            type: 'queryAllFile',
            payload: qs.parse(location.search, { ignoreQueryPrefix: true }),
          })
        }
      })
    },
  },

  effects: {
    *viewCatalog({ payload }, { call, put, select }) {
      const { id } = payload
      const { sessionID, authToken } = yield select(_ => _.app)

      const result = yield call(queryAllFile, { catalog: id, sessionID, authToken })
      const { data } = result
      const { summary, privacyPolicy } = data
      yield put({ type: 'save', payload: { summaryList: summary, privacyPolicy } })
    },

    *queryAllFile({ payload }, { call, put, select }) {
      const { onlineUser, sessionID, authToken } = yield select(_ => _.app)
      const result = yield call(queryAllFile, { ...payload, sessionID, authToken })
      const { data } = result
      const { summary, privacyPolicy } = data
      const param = qs.stringify({ sessionID, authToken, 'key-name': 'file' })
      const serverUrl = `${fileRegistry}?${param}`
      yield put({ type: 'save', payload: { summaryList: summary, privacyPolicy, serverUrl, readOnly: !onlineUser, addNewFlag: false } })
    },

    *deleteFile({ payload }, { call, put, select }) {
      const { sessionID, authToken } = yield select(_ => _.app)

      yield call(deleteFile, { ...payload, sessionID, authToken })
      yield put({ type: 'queryAllFile' })
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
      yield call(batchAddFile, { medias: fileList, description, catalog, expiration, privacy, sessionID, authToken })
      yield put({ type: 'queryAllFile' })
      yield put({ type: 'save', payload: { addNewFlag: false } })
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
