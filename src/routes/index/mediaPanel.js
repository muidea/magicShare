import React from 'react'
import PropTypes from 'prop-types'
import { Button, Row, Col, Form, Input, InputNumber } from 'antd'
import { EditableTagGroup, MultiUpload, RadioItemGroup } from 'components'

import styles from './mediaPanel.less'

const FormItem = Form.Item
const { TextArea } = Input

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
}

const protectedItems = [
  { id: 0, name: '共享' },
  { id: 1, name: '私有' },
]

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

      const { description } = values
      if (!description) {
        values = { ...values, description: '' }
      }

      console.log(values)

      onSubmit(values)
    })
  }

  return (
    <div className={styles.form}>
      <form>
        <Row type="flex" align="top">
          <Col span={12}>
            <FormItem>
              {getFieldDecorator('fileList', {
                rules: [{
                  required: true, message: '文件不能为空',
                }],
              })(<MultiUpload serverUrl={serverUrl} />)}
            </FormItem>
            <FormItem label="有效期(天)" {...formItemLayout}>
              {getFieldDecorator('expiration', {
                rules: [{
                  required: true, message: '请输入文件有效期',
                }],
              })(<InputNumber />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="描述" {...formItemLayout}>
              {getFieldDecorator('description', { })(<TextArea rows={3} cols={3} />)}
            </FormItem>
            <FormItem label="分类" {...formItemLayout}>
              {getFieldDecorator('catalog', {
                rules: [{
                  required: true, message: '分类不能为空',
                }],
              })(<EditableTagGroup />)}
            </FormItem>
            <FormItem label="是否共享" {...formItemLayout}>
              {getFieldDecorator('privacy', {
                rules: [{
                  required: true, message: '确认是否共享该文件',
                }],
              })(<RadioItemGroup dataSource={protectedItems} />)}
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
