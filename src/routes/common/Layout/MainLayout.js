import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'antd'
import { Header } from './Header'
import Footer from './Footer'
import styles from './MainLayout.less'

function MainLayout({ history, user, logoutHandler, children }) {
  return (
    <div>
      <div className={styles.header}>
        <Header history={history} user={user} logoutHandler={logoutHandler} />
      </div>
      <Row className={styles.content}>
        <Col span={16} offset={4}>
          {children}
        </Col>
      </Row>
      <div className={styles.footer}><Footer /></div>
    </div>
  )
}

MainLayout.propTypes = {
  history: PropTypes.object,
  user: PropTypes.object,
  logoutHandler: PropTypes.func,
  children: PropTypes.object,
}


export default MainLayout
