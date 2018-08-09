import React from 'react';
import { Icon } from 'native-base';

export default (name: string, {focused, tintColor}) => (
  <Icon
    name={name}
    active={focused}
    style={{ color: tintColor }}
  />
)
