/* global window */

import { routerRedux } from 'dva/router'
import qs from 'qs'
import { queryStatus, loginUser, logoutUser } from 'services/app'
import { config } from 'utils'

const { prefix } = config

export default {
  namespace: 'app',
  state: {
    isLogin: true,
    sessionID: window.localStorage.getItem(`${prefix}SessionID`),
    authToken: window.localStorage.getItem(`${prefix}AuthToken`),
    onlineUser: {},
  },

  subscriptions: {
    setupHistory({ dispatch, history }) {
      history.listen((location) => {
        dispatch({
          type: 'queryStatus',
          payload: {
            locationPathname: location.pathname,
            locationQuery: qs.parse(location.search),
          },
        })
      })
    },
  },

  effects: {
    *redirectContent({ payload }, { put }) {
      const { id, type } = payload
      if (type === 'article') {
        yield put(routerRedux.push({
          pathname: `/article/${id}`,
        }))
      } else if (type === 'catalog') {
        yield put(routerRedux.push({
          pathname: `/catalog/${id}`,
        }))
      }
    },

    *queryStatus({ payload }, { call, put, select }) {
      const { authToken, sessionID } = yield select(_ => _.app)
      if (authToken) {
        payload = { ...payload, authToken }
      }
      if (sessionID) {
        payload = { ...payload, sessionID }
      }

      const result = yield call(queryStatus, { ...payload })
      const { data } = result
      const { errorCode, onlineUser } = data

      yield put({ type: 'saveSession', payload: { isLogin: errorCode === 0, onlineUser } })
    },

    *loginUser({ payload }, { call, put }) {
      const result = yield call(loginUser, { ...payload })
      const { data } = result

      const { errorCode, reason, onlineUser, authToken, sessionID } = data
      if (errorCode === 0) {
        yield put({ type: 'saveSession', payload: { isLogin: errorCode === 0, authToken, sessionID, onlineUser } })
        yield put(routerRedux.push({
          pathname: '/maintain',
        }))
      } else {
        throw reason
      }
    },

    *logoutUser({ payload }, { call, put, select }) {
      const { authToken, sessionID } = yield select(_ => _.app)
      if (authToken) {
        payload = { ...payload, authToken }
      }
      if (sessionID) {
        payload = { ...payload, sessionID }
      }

      const result = yield call(logoutUser, { ...payload })
      const { data } = result
      const { errorCode, reason } = data

      if (errorCode === 0) {
        yield put({ type: 'clearSession', payload: { authToken: '', sessionID: '', onlineUser: {} } })
        yield put(routerRedux.push({
          pathname: '/',
        }))
      } else {
        throw reason
      }
    },

  },

  reducers: {
    saveSession(state, { payload }) {
      const { sessionID, authToken } = payload

      if (sessionID && authToken) {
        window.localStorage.setItem(`${prefix}SessionID`, sessionID)
        window.localStorage.setItem(`${prefix}AuthToken`, authToken)
      }

      return { ...state, ...payload }
    },

    clearSession(state, { payload }) {
      window.localStorage.removeItem(`${prefix}SessionID`)
      window.localStorage.removeItem(`${prefix}AuthToken`)

      return { ...state, ...payload }
    },
  },
}
