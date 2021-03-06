import React from 'react'
import { TouchableOpacity } from 'react-native'
import {
  Body,
  Text,
  Card,
  CardItem,
  Icon,
  ActionSheet,
  Grid,
  Col,
} from 'native-base'
import CharacterIcon from './CharacterIcon'
import getAge from '../lib/utils/getAge'
import styles from '../styles'
import theme from '../native-base-theme/variables/platform'
import Lottie from './Lottie'
import { Acquirement, Character } from '../graphql/types'


interface Props {
  acquirement: Acquirement
  character: Character
  onCharacterClick: Function
  onAcquirementClick: Function
  onBlockClick?: Function
  onReportClick?: Function
}

const blockOrReport = (name: string, onBlockClick) => {
  ActionSheet.show(
    {
      options: [
        { text: 'ブロックする', icon: 'ios-remove-circle', iconColor: theme.brandWarning },
        { text: 'キャンセル', icon: 'close', iconColor: theme.brandDark }
      ],
      cancelButtonIndex: 1,
      title: `${name}さんのできた！を`,
    },
    async buttonIndex => {
      switch(buttonIndex) {
        case 0:
          return onBlockClick()
        default:
          return
      }
    }
  )
}

export default ({ acquirement, character, onCharacterClick, onAcquirementClick, onBlockClick }: Props) => (
  <Card>
    <CardItem button onPress={() => onCharacterClick()}>
      <CharacterIcon uri={character.imageUrl} sex={character.sex} style={{marginRight: 20}} />
      <Body style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start'}}>
        <Text style={styles.w100}>{character.name}</Text>
        <Text note numberOfLines={1} style={styles.w100}>{getAge(character.birthday, acquirement.acquiredAt)}ころ</Text>
      </Body>
    </CardItem>
    <CardItem>
      <Grid>
        <Col style={{width: '90%'}}>
          <TouchableOpacity onPress={() => onAcquirementClick()} style={styles.inline}>
            <Lottie source={require('../assets/lottie/check_animation.json')} size={theme.noteFontSize} />
            <Text style={{color: theme.brandPrimary, fontSize: theme.noteFontSize}}> {acquirement.name}</Text>
          </TouchableOpacity>
        </Col>
        {(onBlockClick) && <Col style={{width: '10%'}}>
          <Icon
            name='ios-more' onPress={() => blockOrReport(character.name, onBlockClick)}
            style={{marginRight: 10, color: 'gray', textAlign: 'right'}}
          ></Icon>
        </Col>}
      </Grid>
    </CardItem>
    {/* <CardItem style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
      <Icon name="heart" style={{ color: '#ED4A6A' }} />
    </CardItem> */}
  </Card>
)
