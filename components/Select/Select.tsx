import React from 'react';
import { View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import type { PickerProps } from '@react-native-picker/picker';

import { Label, Wrapper } from './Select.styles';

type Option = {
  label: string;
  value: string | number;
};

interface Props extends PickerProps {
  options: Option[];

  label?: string;
  marginTop?: number;
  selectedValue?: any;
}

const Select: React.FC<Props> = ({ label, marginTop = 0, options, selectedValue, onValueChange }) => {
  return (
    <View style={{ marginTop }}>
      {label && <Label>{label}</Label>}
      <Wrapper>
        <Picker {...{ selectedValue, onValueChange, mode: 'dropdown' }}>
          {options.map(({ label, value }) => (
            <Picker.Item label={label} value={value} key={value} />
          ))}
        </Picker>
      </Wrapper>
    </View>
  );
};

export default Select;
