import React from 'react'
import { Thumbnail } from 'native-base'
import { profileImageSource } from '../lib/utils/imageHelper'

export default ({uri, style}: {uri?: string, style?: any}) => (
  <Thumbnail
    source={profileImageSource(uri)}
    style={style}
  />
)
