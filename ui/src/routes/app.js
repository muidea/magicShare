/* global window */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Helmet } from 'react-helmet'
import { withRouter } from 'dva/router'
import { MainLayout } from './common'

const App = ({ children, app, history, dispatch }) => {
  const { onlineUser, authToken, sessionID } = app
  const onLogoutHandler = () => {
    dispatch({ type: 'app/logoutUser', payload: { authToken, sessionID } })
  }

  return (
    <div>
      <Helmet>
        <title>MagicShare</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>
      <MainLayout history={history} user={onlineUser} logoutHandler={onLogoutHandler}>
        { children }
      </MainLayout>
    </div>
  )
}

App.propTypes = {
  children: PropTypes.element.isRequired,
  history: PropTypes.object,
  dispatch: PropTypes.func,
  app: PropTypes.object,
}

export default withRouter(connect(({ app, loading }) => ({ app, loading }))(App))
