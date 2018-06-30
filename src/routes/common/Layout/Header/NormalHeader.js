import React from 'react'
import { Menu, Icon, Row } from 'antd'
import { Link } from 'dva/router'
import styles from './index.less'

function NormailHeader({ history }) {
  const { location } = history

  return (
    <div className={styles.normal_content}>
      <Row type="flex" justify="end">
        <Menu
          selectedKeys={[location.pathname]}
          mode="horizontal"
          className={styles.menu}
        >
          <Menu.Item key="/">
            <Link to="/"><Icon type="home" />Home</Link >
          </Menu.Item>
          <Menu.Item key="/catalog">
            <Link to="/catalog"><Icon type="appstore-o" />Post</Link>
          </Menu.Item>
          <Menu.Item key="/contact">
            <Link to="/contact"><Icon type="profile" />Contact</Link>
          </Menu.Item>
          <Menu.Item key="/about">
            <Link to="/about"><Icon type="idcard" />About</Link>
          </Menu.Item>
        </Menu>
      </Row>
    </div>
  )
}

export default NormailHeader
