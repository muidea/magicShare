import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Radio } from 'antd'
import styles from './index.less'

const RadioGroup = Radio.Group
const RadioButton = Radio.Button

export default class RadioItemGroup extends Component {
  constructor(props) {
    super(props)

    if ('value' in props) {
      const { value } = props
      if (value) {
        if ('id' in value) {
          this.state = { value: value.id }
        }
      }
    }

    if ('disabled' in props) {
      const { disabled } = props
      this.state = { ...this.state, disabled }
    } else {
      this.state = { ...this.state, disabled: false }
    }

    if ('style' in props) {
      const { style } = props
      this.state = { ...this.state, style }
    }

    this.state = { ...this.state, borderStyle: styles.normalBorder }
  }

  componentWillReceiveProps(nextProps) {
    const { value } = nextProps
    if (value != null) {
      if ('id' in value) {
        this.setState({ value: value.id })
      }
    }
  }

  handleInputChange = (e) => {
    const { value } = e.target
    const { onChange, dataSource } = this.props
    if (onChange) {
      for (let idx = 0; idx < dataSource.length;) {
        const item = dataSource[idx]
        const { id } = item
        if (id === value) {
          onChange(item)
          break
        }
        idx += 1
      }
    }
  }

  focus() {
    this.setState({ borderStyle: styles.focusBorder })
  }

  blur() {
    this.setState({ borderStyle: styles.normalBorder })
  }

  render() {
    const { dataSource } = this.props
    const { borderStyle } = this.state
    return (
      <RadioGroup className={borderStyle} disabled={this.state.disabled} onChange={this.handleInputChange} value={this.state.value}>
        { dataSource && dataSource.map((tag) => {
          const chkItem = (
            <RadioButton key={tag.id} value={tag.id} >
              {tag.name}
            </RadioButton>
          )
          return chkItem
        })}
      </RadioGroup>
    )
  }
}

RadioItemGroup.propTypes = {
  dataSource: PropTypes.array,
  style: PropTypes.object,
  value: PropTypes.any,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
}
