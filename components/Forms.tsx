import React from 'react'
import {
  Item,
  Input,
  Label,
  DatePicker,
} from 'native-base'
import formatFromDate from '../lib/utils/formatFromDate'
import subYears from 'date-fns/sub_years'
import { Platform } from 'react-native'

export interface InputString {
  value: string
  validate(value: string): boolean
  isDirty?: boolean
}

interface TextInputProps {
  label: string
  onChange(item: InputString)
  item: InputString
  secureTextEntry?: boolean
  // HACK: Use @types
  textContentType?: 'none'|'URL'|'addressCity'|'addressCityAndState'|'addressState'|'countryName'|'creditCardNumber'|'emailAddress'|'familyName'|'fullStreetAddress'|'givenName'|'jobTitle'|'location'|'middleName'|'name'|'namePrefix'|'nameSuffix'|'nickname'|'organizationName'|'postalCode'|'streetAddressLine1'|'streetAddressLine2'|'sublocality'|'telephoneNumber'|'username'|'password'
  maxLength?: number
  keyboardType?: 'default'|'email-address'|'numeric'|'phone-pad'|'ascii-capable'|'numbers-and-punctuation'|'url'|'number-pad'|'name-phone-pad'|'decimal-pad'|'twitter'|'web-search'|'visible-password'
}

export class TextInput extends React.Component<TextInputProps> {
  /**
   * iOSかつreact native0.54.2以降でTextInputでonChangeTextを使うと日本語変換ができなくなる
   * http://watanabeyu.blogspot.com/2018/04/react-native0542textinputonchangetext.html
   * @param nextProps 
   * @param nextState 
   */
  shouldComponentUpdate(nextProps: TextInputProps){
    // input valueが変更された場合はコンポーネントを更新させない
    if (Platform.OS !== 'ios') { return true }

    return this.props.item.value === nextProps.item.value
  }

  render() {
    const {
      item,
      label,
      onChange,
      secureTextEntry,
      textContentType,
      keyboardType,
      maxLength,
    } = this.props
    return (
      <Item stackedLabel error={item.isDirty && !item.validate(item.value)}>
        <Label>{label}</Label>
        <Input
          onChangeText={value => onChange({ ...item, value, isDirty: true })}
          value={item.value}
          secureTextEntry={secureTextEntry}
          textContentType={textContentType || 'none'}
          keyboardType={keyboardType || 'default'}
          blurOnSubmit={true}
          maxLength={maxLength || 100}
        />
      </Item>
    )
  }
}

export interface InputDate {
  value: Date
  validate(value: Date): boolean
  isDirty?: boolean
}

interface DateInputProps {
  label: string
  onChange(item: InputDate)
  item: InputDate
  androidMode?: 'spinner'|'calendar'
}

export const DateInput = (props: DateInputProps) => (
  <Item stackedLabel error={props.item.isDirty && !props.item.validate(props.item.value)}>
    <Label>{props.label}</Label>
    <DatePicker
      defaultDate={props.item.value}
      minimumDate={subYears(new Date(), 10)}
      maximumDate={new Date()}
      locale={'ja'}
      timeZoneOffsetInMinutes={undefined}
      modalTransparent={false}
      animationType={"fade"}
      androidMode={props.androidMode || 'spinner'}
      placeHolderText={formatFromDate(props.item.value, 'YYYY年MMMDo') || '選択する'}
      textStyle={{ color: '#333' }}
      placeHolderTextStyle={{ color: '#d3d3d3' }}
      onDateChange={value => props.onChange({ ...props.item, value, isDirty: true })}
      formatChosenDate={date => formatFromDate(date, 'YYYY年MMMDo')}
    />
  </Item>
)
