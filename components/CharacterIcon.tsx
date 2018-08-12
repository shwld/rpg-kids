import React from 'react';
import {
  Thumbnail,
} from "native-base";
import { generatePublicMediaUrl } from '../lib/firebase'

function getImageSource(imageUri: string) {
  if (imageUri) {
    return { uri: generatePublicMediaUrl(imageUri) }
  }
  return require('../assets/baby_asia_boy.png')
}

export default ({characterId, style}: {characterId: string, style?: any}) => (
  <Thumbnail
    source={getImageSource(`characters/${characterId}/profile.jpg`)}
    style={style}
  />
)
