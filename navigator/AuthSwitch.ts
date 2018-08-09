import React from 'react';
import { createSwitchNavigator } from 'react-navigation';
import RootTabs from './RootTabs'
import EntryScreen from '../screens/EntryScreen'
import WalkThroughScreen from '../screens/WalkThroughScreen'

export default createSwitchNavigator(
  {
    Entry: EntryScreen,
    App: RootTabs,
    SignUp: WalkThroughScreen,
  },
  {
    initialRouteName: 'Entry',
  },
);
