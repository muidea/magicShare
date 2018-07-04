import React from 'react'
import PropTypes from 'prop-types'
import { Button, Row, Col, Form, Input, InputNumber } from 'antd'
import { EditableTagGroup, MultiUpload } from 'components'

import styles from './mediaPanel.less'

const FormItem = Form.Item
const { TextArea } = Input

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
}

const MediaPanel = ({
  serverUrl,
  onSubmit,
  onCancel,
  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
  },
}) => {
  const handleOk = () => {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }

      console.log(values)

      onSubmit(values)
    })
  }

  return (
    <div className={styles.form}>
      <form>
        <Row type="flex" justify="center" align="top">
          <Col span={14}>
            <FormItem label="描述" {...formItemLayout}>
              {getFieldDecorator('description', { })(<TextArea rows={3} cols={3} />)}
            </FormItem>
            <FormItem label="有效期(天)" {...formItemLayout}>
              {getFieldDecorator('expiration', { })(<InputNumber />)}
            </FormItem>
            <FormItem label="分类" {...formItemLayout}>
              {getFieldDecorator('catalog', { })(<EditableTagGroup />)}
            </FormItem>
          </Col>
          <Col span={10}>
            <FormItem>
              {getFieldDecorator('fileList', { })(<MultiUpload serverUrl={serverUrl} />)}
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="center">
          <Col>
            <Button type="primary" size="large" className={styles.button} onClick={handleOk}>
              确认
            </Button>
            <Button size="large" className={styles.button} onClick={onCancel}>
              取消
            </Button>
          </Col>
        </Row>
      </form>
    </div>
  )
}

MediaPanel.propTypes = {
  form: PropTypes.object,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
}

export default Form.create()(MediaPanel)
