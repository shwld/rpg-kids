import React from "react";
import UserCard from '../components/UserCard'
import {
  Content,
  Text,
} from "native-base";
export default () => (
  <Content>
    <Text>チャートとか入れたい</Text>
    {[...Array(10).keys()].map(i => (
      <UserCard
        key={i}
        id={`${i}`}
        imageUrl={`https://randomuser.me/api/portraits/women/${(Math.floor(Math.random()*(100+1-1))+1)}.jpg`}
        name={'あかり'}
        age={'10ヶ月のころ'}
        postedAt={'6月26日'}
        skill={'自分を中心に回転'}
        onClick={() => {}}
      />
    ))}
  </Content>
)
