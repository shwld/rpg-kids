export const profileImagePath = (characterId: string) => `characters/${characterId}/profile.jpg`
export const profileImageSource = (uri?: string) => uri ? {uri} : require('../../assets/baby_asia_boy.png')
