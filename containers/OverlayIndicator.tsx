import React from 'react'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

import { ActivityIndicator, StyleSheet } from 'react-native'
import { View } from 'native-base'

const GET_IN_PROGRESS = gql`
  query getState @client {
    state {
      inProgress
    }
  }
`

const Indicator = ({data}) => (
  data.state.inProgress ? (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          zIndex: 10000,
          backgroundColor: 'rgba(0,0,0,0.4)',
          alignItems: 'center',
          justifyContent: 'center',
        },
      ]}>
      <ActivityIndicator color="#fff" animating size="large" />
    </View>
  ) : null
)

export default graphql<any>(
  GET_IN_PROGRESS, { name: 'data'}
)(Indicator)

