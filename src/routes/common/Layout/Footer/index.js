import React from 'react'
import { Divider, BackTop } from 'antd'
import { config } from 'utils'
import styles from './index.less'

const { footerText } = config

const Footer = () => (
  <div className={styles.footer}>
    <Divider /><BackTop />
    <div> { footerText } </div>
  </div>)

export default Footer
