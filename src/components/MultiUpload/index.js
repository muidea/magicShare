import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Upload, Icon } from 'antd'

const { Dragger } = Upload

export default class MultiUpload extends Component {
  state = {
    fileList: [],
  }

  handleChange = (info) => {
    let newFileList = []
    const fileList = info.fileList
    for (let offset = 0; offset < fileList.length; offset += 1) {
      const cur = fileList[offset]
      let existFlag = false
      for (let idx = 0; idx < newFileList.length; idx += 1) {
        const ext = newFileList[idx]
        if (cur.name === ext.name && cur.lastModified === ext.lastModified && cur.size === ext.size) {
          existFlag = true
          break
        }
      }

      if (!existFlag) {
        newFileList.push(fileList[offset])
      }
    }

    if (info.file.status !== 'uploading') {
      const valList = []

      newFileList = newFileList.filter((file) => {
        if (file.response) {
          if (file.response.errorCode === 0) {
            valList.push({ name: file.name, fileToken: file.response.fileToken })
            return true
          }
        }

        return true
      })

      const { onChange } = this.props
      if (onChange) {
        onChange(valList)
      }
    }

    this.setState({ fileList: newFileList })
  }

  beforeUpload = (file) => {
    let existFlag = false
    const { fileList } = this.state
    for (const item of fileList) {
      if (item.name === file.name) {
        existFlag = true
      }
    }

    return !existFlag
  }

  render() {
    const props = {
      name: 'file',
      multiple: false,
      action: this.props.serverUrl,
      onChange: this.handleChange,
      beforeUpload: this.beforeUpload,
    }

    return (
      <Dragger {...props} fileList={this.state.fileList}>
        <p className="ant-upload-drag-icon">
          <Icon type="inbox" />
        </p>
        <p className="ant-upload-text">选择上传文件</p>
      </Dragger>
    )
  }
}

MultiUpload.propTypes = {
  onChange: PropTypes.func,
}
