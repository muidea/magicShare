import React from 'react'
import PropTypes from 'prop-types'
import { DescriptionList, EditableTagGroup } from 'components'

const { Description } = DescriptionList

const MediaView = ({ media }) => (
  <div>
    <DescriptionList size="large" title="文件信息" style={{ marginBottom: 32 }}>
      <Description term="文件名">{media.name}</Description>
      <Description term="描述">{media.description}</Description>
      <Description term="分组"><EditableTagGroup readOnly value={media.catalog} /></Description>
      <Description term="上传时间">{media.createDate}</Description>
    </DescriptionList>
  </div>
)

MediaView.propTypes = {
  media: PropTypes.object,
}

export default MediaView
