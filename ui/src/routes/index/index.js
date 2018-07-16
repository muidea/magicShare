import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Link } from 'dva/router'
import { Row, List, Col, Button } from 'antd'
import { EditableTagGroup } from 'components'
import MediaPanel from './mediaPanel'
import styles from './index.less'

function IndexPage({ index, dispatch }) {
  const { summaryList, serverUrl, readOnly, addNewFlag } = index

  const onSelect = (tag) => {
    dispatch({ type: 'index/viewCatalog', payload: { ...tag } })
  }

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
      {
      (item.type === 'media') && <Link to={`/view/${item.id}`}><h1>{item.name}</h1></Link>
      }
      {
      (item.type === 'catalog') && <a onClick={() => onSelect(item)}><h1>{item.name}</h1></a>
      }
    </div>
  )

  const DescText = ({ item }) => (
    <div className="content-inner">
      <div className={styles.description} >{ item.description}</div>
      <Row gutter={24} type="flex" align="middle">
        <Col xl={{ span: 22 }} md={{ span: 22 }}>
          <span>
            <EditableTagGroup readOnly onSelect={onSelect} value={item.catalog} /> Post by {item.creater.name} on { item.createDate }
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
