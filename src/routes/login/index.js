import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { LoginPanel } from '../common'

function LoginPage({ loading, dispatch }) {
  const onLogin = (value) => {
    dispatch({ type: 'app/loginUser', payload: { ...value } })
  }

  return (
    <LoginPanel loading={loading} onLogin={onLogin} />
  )
}

LoginPage.propTypes = {
  loading: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ loading, dispatch }) => ({ loading, dispatch }))(LoginPage)
