import React, { useContext, useState, useEffect } from 'react';
import { View } from 'react-native';

import { AppContext } from '../../contexts';
import { Input, Paragraph } from '../../styles';

import { MeasurementItem, MeasurementLabel, InputWrapper } from './MeasurementsTable.styles';

interface MeasurementValue {
  id: number;
  value: number;
  isTooLow: boolean;
  isTooHigh: boolean;
  isEmpty: boolean;
}

interface Props {
  onChange: (isValid: boolean) => void;
}

const MeasurementsTable: React.FC<Props> = ({ onChange }) => {
  const { measurements } = useContext(AppContext);
  const [measurementValues, setMeasurementValues] = useState<MeasurementValue[]>([]);

  useEffect(() => {
    const invalidMeasures = measurementValues.filter(({ isTooLow, isTooHigh, isEmpty }) => isTooLow || isTooHigh || isEmpty);
    const notAllBeenMeasured = measurementValues.length !== measurements.length;

    onChange(!invalidMeasures.length && !notAllBeenMeasured);
  }, [measurementValues]);

  const onChangeInput = (measurementId: number) => (value: React.ReactText) => {
    const measurement = measurements.find(({ id }) => measurementId === id);
    if (!measurement) return;

    const { maxValue, minValue } = measurement;
    let newValue;

    if (measurementValues?.find(({ id }) => measurementId === id)) {
      newValue = measurementValues?.map((measurement) =>
        measurementId === measurement.id
          ? {
              id: measurement.id,
              value: value as number,
              isEmpty: !value,
              isTooLow: minValue === null ? false : value < minValue,
              isTooHigh: maxValue === null ? false : value > maxValue
            }
          : measurement
      );
    } else {
      newValue = [
        ...measurementValues,
        {
          id: measurementId,
          value: value as number,
          isEmpty: !value,
          isTooLow: minValue === null ? false : value < minValue,
          isTooHigh: maxValue === null ? false : value > maxValue
        }
      ];
    }

    setMeasurementValues(newValue);
  };

  const getErrorMessage = (measurementId: number) => {
    const measurementValue = measurementValues.find(({ id }) => id === measurementId);

    if (!measurementValue) return;

    if (measurementValue.isTooHigh) return 'The value is above the permissible range';
    if (measurementValue.isTooLow) return 'The value is below the permissible range';
  };

  const isLastInput = (index: number): boolean => index === measurements.length - 1;

  return (
    <View style={{ marginTop: 50 }}>
      {measurements.map((measurement, index) => {
        const errorMessage = getErrorMessage(measurement.id);
        return (
          <MeasurementItem key={measurement.id} style={{ borderBottomWidth: isLastInput(index) ? 0 : 1 }}>
            <View style={{ width: '100%' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MeasurementLabel>{measurement.title}</MeasurementLabel>
                <InputWrapper>
                  <Input keyboardType={'numeric'} onChangeText={onChangeInput(measurement.id)} />
                </InputWrapper>
              </View>
              {errorMessage && (
                <Paragraph isError marginBottom={12} marginTop={0}>
                  {errorMessage}
                </Paragraph>
              )}
            </View>
          </MeasurementItem>
        );
      })}
    </View>
  );
};

export default MeasurementsTable;
