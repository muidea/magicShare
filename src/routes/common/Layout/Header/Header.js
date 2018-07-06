import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Icon, Row } from 'antd'
import { Link } from 'dva/router'
import styles from './Header.less'

const { SubMenu } = Menu

function MaintainHeader({ history, user, logoutHandler }) {
  const { location } = history

  const onMenuClick = ({ key }) => {
    if (key === 'logout') {
      logoutHandler()
    }
  }

  return (
    <div className={styles.maintain_content}>
      <Row type="flex" justify="end">
        <Menu
          selectedKeys={[location.pathname]}
          mode="horizontal"
          className={styles.menu}
          onClick={onMenuClick}
        >
          <Menu.Item key="/login">
            <Link to="/"><Icon type="home" />Home</Link>
          </Menu.Item>
          { !user &&
          <Menu.Item key="/login">
            <Link to="/login"><Icon type="tool" />Login</Link>
          </Menu.Item>
          }
          { user &&
          <SubMenu
            key="/user"
            style={{ float: 'right' }}
            title={
              <span>
                <Icon type="user" />
                { user.name }
              </span>}
          >
            <Menu.Item key="logout">
              Logout
            </Menu.Item>
          </SubMenu>
          }
        </Menu>
      </Row>
    </div>
  )
}

MaintainHeader.propTypes = {
  history: PropTypes.object,
  user: PropTypes.object,
  logoutHandler: PropTypes.func,
}

export default MaintainHeader
