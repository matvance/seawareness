import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colors, Input } from '../../../../../../styles';

interface Props {
  title: string;
  onDelete: () => void;
  minValue: number | null;
  maxValue: number | null;
  onChange: (minOrMax: 'min' | 'max', value: number) => void;
}

const MeasurementInput: React.FC<Props> = ({ title, onDelete, onChange, minValue, maxValue }) => {
  const handleChange = (minOrMax: 'min' | 'max') => (value: React.ReactText) => onChange(minOrMax, parseFloat(value as string));
  return (
    <View>
      <View style={{ marginTop: 12, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ flexGrow: 1, fontSize: 18 }}>{title}</Text>
        <Input
          keyboardType={'numeric'}
          style={{ flexBasis: 80, marginRight: 20 }}
          defaultValue={(minValue || '').toString()}
          placeholder={'min'}
          onChangeText={handleChange('min')}
        />
        <Input
          keyboardType={'numeric'}
          style={{ flexBasis: 80, marginRight: 20 }}
          defaultValue={(maxValue || '').toString()}
          placeholder={'max'}
          onChangeText={handleChange('max')}
        />
        <TouchableOpacity onPress={onDelete} style={{ flexBasis: 24, width: 24 }}>
          <Feather name={'minus-circle'} size={24} color={colors.deletion} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MeasurementInput;
