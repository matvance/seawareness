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
}

const Select: React.FC<Props> = ({ label, marginTop = 0, options, selectedValue, onValueChange }) => {
  return (
    <View style={{ marginTop }}>
      {label && <Label>{label}</Label>}
      <Wrapper>
        <Picker {...{ selectedValue, onValueChange }}>
          {options.map((option) => (
            <Picker.Item {...option} key={option.value} />
          ))}
        </Picker>
      </Wrapper>
    </View>
  );
};

export default Select;
