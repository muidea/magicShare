import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Link } from 'dva/router'
import { Row, List, Col, Button } from 'antd'
import MediaPanel from './mediaPanel'
import styles from './index.less'

function IndexPage({ index, dispatch }) {
  const { summaryList, serverUrl, readOnly, addNewFlag } = index

  const onDelete = (value) => {
    const { id } = value
    dispatch({ type: 'index/deleteFile', payload: { id } })
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
      <Link to={`/view/${item.id}`}><h1>{item.name}</h1></Link>
    </div>
  )

  const DescText = ({ item }) => (
    <div>
      <div>{ item.description}</div>
      <Row gutter={24} type="flex" align="middle">
        <Col xl={{ span: 22 }} md={{ span: 22 }}>
          <span>
            Post by {item.creater.name} on { item.createDate }
          </span>
        </Col>
        { !readOnly && <Col xl={{ span: 2 }} md={{ span: 2 }}>
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
