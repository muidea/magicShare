import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button } from 'antd'
import { DescriptionList, EditableTagGroup } from 'components'

const { Description } = DescriptionList

function ViewPage({ view, dispatch }) {
  console.log(view)

  const { name, description, catalog, createDate, creater, fileUrl } = view

  const onReturn = () => {
    dispatch({ type: 'view/returnBack' })
  }

  return (
    <div>
      <DescriptionList size="large" title="文件信息" style={{ marginBottom: 32 }}>
        <Description term="文件名">{name}</Description>
        <Description term="描述">{description}</Description>
        <Description term="分组"><EditableTagGroup readOnly value={catalog} /></Description>
        <Description term="上传时间">{createDate}</Description>
        <Description term="上传者">{creater.name}</Description>
        <Description term="下载文件"><Button style={{ border: 0 }} size="large" icon="download" target="_blank" href={fileUrl} /></Description>
      </DescriptionList>
      <Button type="dashed" style={{ width: '100%', marginBottom: 8 }} icon="to-top" onClick={onReturn} >
        返回
      </Button>
    </div>
  )
}

ViewPage.propTypes = {
  view: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ view, dispatch }) => ({ view, dispatch }))(ViewPage)
