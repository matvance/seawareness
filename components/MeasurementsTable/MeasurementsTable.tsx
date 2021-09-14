import React, { useContext } from 'react';
import { View } from 'react-native';

import { AppContext } from '../../contexts';
import { Input } from '../../styles';

import { MeasurementItem, MeasurementLabel, InputWrapper } from './MeasurementsTable.styles';

const MeasurementsTable: React.FC = () => {
  const { measurements } = useContext(AppContext);

  return (
    <View style={{ marginTop: 50 }}>
      {measurements.map(({ id, title }, index) => {
        const isLastItem = index === measurements.length - 1;
        return (
          <MeasurementItem key={id} style={{ borderBottomWidth: isLastItem ? 0 : 1 }}>
            <MeasurementLabel>{title}</MeasurementLabel>
            <InputWrapper>
              <Input keyboardType={'numeric'} />
            </InputWrapper>
          </MeasurementItem>
        );
      })}
    </View>
  );
};

export default MeasurementsTable;
