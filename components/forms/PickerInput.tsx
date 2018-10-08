import React from 'react'
import {
  Label,
  Picker,
  Icon,
  View,
} from 'native-base'

export interface InputSelection {
  value: string
  validate(value: string): boolean
  isDirty?: boolean
}

interface SelectProps {
  label: string
  onChange(item: InputSelection)
  item:InputSelection
  choice: {label: string, value: string}[]
}

export default (props: SelectProps) => (
  <View style={{padding: 5}}>
    <Label style={{marginRight: 20, fontSize: 14}}>{props.label}</Label>
    <Picker
      mode="dropdown"
      iosIcon={<Icon name="ios-arrow-down-outline" />}
      style={{ width: undefined }}
      placeholder="選択する"
      placeholderStyle={{ color: "#bfc6ea" }}
      placeholderIconColor="#007aff"
      selectedValue={props.item.value}
      onValueChange={value => props.onChange({ ...props.item, value, isDirty: true })}
    >
      {props.choice.map(({label, value}) => (
        <Picker.Item label={label} value={value} key={value} />
      ))}
    </Picker>
  </View>
)
