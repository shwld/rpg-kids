import React from "react"
import {
  Tab,
  Tabs,
  TabHeading,
  Text,
} from 'native-base'
import { NavigationScreenProp } from 'react-navigation'
import Flow from '../screens/FlowScreen'
import Ranking from '../screens/RankingScreen'


interface Props {
  navigation: NavigationScreenProp<any, any>
}

export default (props: Props) => (
  <Tabs>
    <Tab heading={ <TabHeading><Text>みんな</Text></TabHeading>}>
      <Flow {...props} />
    </Tab>
    <Tab heading={ <TabHeading><Text>ランキング</Text></TabHeading>}>
      <Ranking {...props} />
    </Tab>
  </Tabs>
)
