import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, List, Col, Button } from 'antd'
import MediaPanel from './mediaPanel'
import styles from './index.less'

function IndexPage({ index, dispatch }) {
  const { summaryList, serverUrl, readOnly, addNewFlag } = index

  const onSelect = (value) => {
    dispatch({ type: 'app/redirectContent', payload: { ...value } })
  }

  const onModify = (value) => {
    dispatch({ type: 'app/redirectContent', payload: { ...value } })
  }

  const onDelete = (value) => {
    dispatch({ type: 'app/redirectContent', payload: { ...value } })
  }

  const onNew = () => {
    dispatch({ type: 'index/addNew' })
  }

  const onSubmit = (value) => {
    dispatch({ type: 'index/submitNew', payload: { ...value } })
  }

  const onCancel = (value) => {
    dispatch({ type: 'index/cancelNew', payload: { ...value } })
  }

  const TitleText = ({ item }) => (
    <div>
      <a><h1 onClick={() => onSelect(item)}>{item.name}</h1></a>
    </div>
  )

  const DescText = ({ item }) => (
    <div>
      <div>{ item.description}</div>
      <Row gutter={24} type="flex" align="middle">
        <Col xl={{ span: 18 }} md={{ span: 18 }}>
          <span>
            Post by {item.creater.name} on { item.createDate }
          </span>
        </Col>
        { !readOnly && <Col xl={{ span: 6 }} md={{ span: 6 }}>
          <Button className={styles.button} onClick={() => onModify(item)} >编辑</Button>
          <Button className={styles.button} onClick={() => onDelete(item)} >删除</Button>
        </Col>
        }
      </Row>
    </div>
  )

  const NewPanel = () => (
    <div>
      {
        !readOnly && !addNewFlag &&
        <Button type="dashed" style={{ width: '100%', marginBottom: 8 }} icon="plus" onClick={onNew} >
        添加
        </Button>
      }
      {
        !readOnly && addNewFlag &&
        <MediaPanel serverUrl={serverUrl} onSubmit={onSubmit} onCancel={onCancel} />
      }
    </div>
  )

  return (
    <List
      itemLayout="horizontal"
      dataSource={summaryList}
      footer={<NewPanel />}
      renderItem={item => (
        <List.Item>
          <List.Item.Meta
            title={<TitleText item={item} />}
            description={<DescText item={item} />}
          />
        </List.Item>
      )}
    />
  )
}

IndexPage.propTypes = {
  index: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ index, dispatch }) => ({ index, dispatch }))(IndexPage)
