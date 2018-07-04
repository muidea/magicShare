import { queryFile, downloadFile } from 'services/view'
import pathToRegexp from 'path-to-regexp'

export default {

  namespace: 'view',

  state: {
    name: '',
    description: '',
    catalog: [],
    createDate: '',
    creater: {},
    fileUril: '',
    expiration: 0,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const match = pathToRegexp('/view/:id').exec(location.pathname)
        if (match) {
          dispatch({
            type: 'queryFile',
            payload: { id: match[1] },
          })
        }
      })
    },
  },

  /* eslint no-shadow: ["error", { "allow": ["data", "errorCode"] }]*/
  effects: {
    *queryFile({ payload }, { call, put, select }) {
      const { sessionID, authToken } = yield select(_ => _.app)

      const queryResult = yield call(queryFile, { ...payload, sessionID, authToken })
      const { data } = queryResult
      const { errorCode, media } = data
      if (errorCode === 0) {
        const { name, description, catalog, createDate, creater, fileToken, expiration } = media
        const downloadResult = yield call(downloadFile, { fileToken, sessionID, authToken })
        const { data } = downloadResult
        const { errorCode, redirectUrl } = data
        if (errorCode === 0) {
          yield put({ type: 'save', payload: { name, description, catalog, createDate, creater, expiration, redirectUrl } })
        }
      }
    },

  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload }
    },
  },
}
