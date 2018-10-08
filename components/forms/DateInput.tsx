import React from 'react'
import {
  Item,
  Label,
  DatePicker,
} from 'native-base'
import formatFromDate from '../../lib/utils/formatFromDate'
import subYears from 'date-fns/sub_years'

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

export default (props: DateInputProps) => (
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
