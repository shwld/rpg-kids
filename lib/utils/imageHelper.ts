export const profileImagePath = (characterId: string) => `characters/${characterId}/profile.jpg`
export const profileImageSource = (uri?: string, sex?: string) => {
  let source = uri ? {uri} : (sex == 'female' ? require('../../assets/baby_asia_girl.png') : require('../../assets/baby_asia_boy.png'))
  return source
}
