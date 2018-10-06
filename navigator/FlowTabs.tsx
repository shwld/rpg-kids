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
  <Tabs locked={true}>
    <Tab heading={ <TabHeading><Text>できたこと</Text></TabHeading>}>
      <Flow {...props} />
    </Tab>
    <Tab heading={ <TabHeading><Text>みんな</Text></TabHeading>}>
      <Ranking {...props} />
    </Tab>
  </Tabs>
)
