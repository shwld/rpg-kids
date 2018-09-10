import React from 'react'
import {
  Body,
  Text,
  Card,
  CardItem,
  Button,
  Icon,
  Left,
  Right,
  ActionSheet,
  Grid,
  Col,
} from "native-base"
import CharacterIcon from './CharacterIcon'
import getAge from '../lib/utils/getAge'
import styles from '../styles'
import formatFromDate from '../lib/utils/formatFromDate'

interface Props {
  acquirement: {
    name: string
    acquiredAt: Date
    character: {
      id: string
      name: string
      birthday: Date
      imageUrl: string
    }
  }
  onCharacterClick: Function
  onAcquirementClick: Function
  onBlockClick?: Function
  onReportClick?: Function
}

const blockOrReport = (name: string, onBlockClick) => {
  ActionSheet.show(
    {
      options: [
        { text: 'ブロックする', icon: 'ios-remove-circle', iconColor: '#f42ced' },
        { text: 'キャンセル', icon: 'close', iconColor: '#25de5b' }
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

export default ({ acquirement, onCharacterClick, onAcquirementClick, onBlockClick }: Props) => (
  <Card>
    <CardItem button onPress={() => onCharacterClick()}>
      <CharacterIcon uri={acquirement.character.imageUrl} style={{marginRight: 20}} />
      <Body style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start'}}>
        <Text style={styles.w100}>{acquirement.character.name}</Text>
        <Text note numberOfLines={1} style={styles.w100}>{getAge(acquirement.character.birthday, acquirement.acquiredAt)}ころ</Text>
      </Body>
    </CardItem>
    <CardItem>
      <Grid>
        <Col style={{width: '90%'}}>
          <Button primary rounded small onPress={() => onAcquirementClick()}>
            <Text>{acquirement.name}</Text>
          </Button>
        </Col>
        {(onBlockClick) && <Col style={{width: '10%'}}>
          <Icon
            name='ios-more' onPress={() => blockOrReport(acquirement.character.name, onBlockClick)}
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
