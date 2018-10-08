import React from 'react'
import { Thumbnail } from 'native-base'
import { profileImageSource } from '../lib/utils/imageHelper'

export default ({uri, sex, style}: {uri?: string, sex?: string, style?: any}) => (
  <Thumbnail
    source={profileImageSource(uri, sex)}
    style={style}
  />
)
