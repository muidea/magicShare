import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'

function ViewPage({ view }) {
  console.log(view)

  return (
    <div>aaa</div>
  )
}

ViewPage.propTypes = {
  view: PropTypes.object,
}

export default connect(({ view }) => ({ view }))(ViewPage)
