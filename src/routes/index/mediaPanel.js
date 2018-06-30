import React from 'react'
import PropTypes from 'prop-types'
import { Button, Row, Col, Form, Icon, Input, InputNumber, Upload, message } from 'antd'
import { EditableTagGroup } from 'components'

import styles from './mediaPanel.less'

const FormItem = Form.Item
const { TextArea } = Input

const { Dragger } = Upload

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
}

const MediaPanel = ({
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
      onSubmit(values)
    })
  }

  const props = {
    name: 'file',
    multiple: false,
    action: '//jsonplaceholder.typicode.com/posts/',
    onChange(info) {
      const status = info.file.status
      if (status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`)
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
  }

  return (
    <div className={styles.form}>
      <form>
        <Row type="flex" justify="center" align="top">
          <Col span={14}>
            <FormItem label="名称" hasFeedback {...formItemLayout}>
              {getFieldDecorator('name', {
                rules: [
                  { required: true },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="描述" {...formItemLayout}>
              {getFieldDecorator('description', { })(<TextArea rows={3} cols={3} />)}
            </FormItem>
            <FormItem label="有效期" {...formItemLayout}>
              {getFieldDecorator('expiration', { })(<InputNumber />)}
            </FormItem>
            <FormItem label="分类" {...formItemLayout}>
              {getFieldDecorator('catalog', { })(<EditableTagGroup />)}
            </FormItem>
          </Col>
          <Col span={10}>
            <Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <Icon type="inbox" />
              </p>
              <p className="ant-upload-text">选择文件进行上传</p>
              <p className="ant-upload-hint">只支持单个文件</p>
            </Dragger>
          </Col>
        </Row>
        <Row type="flex" justify="center">
          <Col>
            <Button type="primary" size="large" className={styles.button} onClick={handleOk}>
              确认
            </Button>
            <Button type="primary" size="large" className={styles.button} onClick={onCancel}>
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
}

export default Form.create()(MediaPanel)
