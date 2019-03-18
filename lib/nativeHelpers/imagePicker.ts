import { ImagePicker, Permissions } from 'expo'
import permit from './permit'
import { ActionSheet } from 'native-base'
import theme from '../../native-base-theme/variables/platform'

const takePhoto = async () => {
  const canCamera = await permit(Permissions.CAMERA)
  if (!canCamera) { return }
  let result = await ImagePicker.launchCameraAsync({
    mediaTypes: 'Images',
    allowsEditing: true,
    quality: 0.3,
    exif: false,
  })
  if (result.cancelled) { return null }
  return result.uri
}

const pickImage = async () => {
  const canCameraRoll = await permit(Permissions.CAMERA_ROLL)
  if (!canCameraRoll) { return }
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: 'Images',
    allowsEditing: true,
    quality: 0.3,
    exif: false,
  })
  if (result.cancelled) { return null }
  return result.uri
}

export default (callback: (uri: string) => any) => {
  ActionSheet.show(
    {
      options: [
        { text: 'カメラ', icon: 'camera', iconColor: theme.brandDark },
        { text: 'カメラロール', icon: 'ios-image', iconColor: theme.brandDark },
        { text: 'キャンセル', icon: 'close', iconColor: theme.brandDark }
      ],
      cancelButtonIndex: 2,
      title: '写真をアップロード',
    },
    async buttonIndex => {
      switch(buttonIndex) {
        case 0:
          return callback(await takePhoto())
        case 1:
          return callback(await pickImage())
        default:
          return
      }
    }
  )
}
