import React, { useContext, useState } from 'react';
import { Text, View } from 'react-native';
import { useDebouncedCallback } from 'use-debounce';

import MeasurementInput from './components/MeasurementInput/MeasurementInput';
import { SaveableInput } from '../../../../components';
import { AppContext } from '../../../../contexts';
import { Paragraph } from '../../../../styles';

const MeasurementsSettings: React.FC = () => {
  const { measurements, setMeasurements } = useContext(AppContext);
  const [inputErrors, setInputErrors] = useState<{ measurementId: number; message: string }[]>([]);

  // console.log(JSON.stringify(measurements, null, 2));

  const changeMeasurement = (measurementId: number) => (minOrMax: 'min' | 'max', value: number) => {
    const certainMeasurement = measurements.find(({ id }) => id === measurementId);

    if (!certainMeasurement) return;

    const { minValue, maxValue } = certainMeasurement;

    switch (minOrMax) {
      case 'min':
        if (typeof maxValue === 'number' && value > maxValue) {
          return setInputErrors([
            ...inputErrors,
            { measurementId: certainMeasurement.id, message: 'Min value cannot be greater than max' }
          ]);
        }
        break;
      case 'max':
        if (typeof minValue === 'number' && value < minValue) {
          return setInputErrors([
            ...inputErrors,
            { measurementId: certainMeasurement.id, message: 'Max value cannot be lower than min' }
          ]);
        }
    }

    setInputErrors(inputErrors.filter((error) => error.measurementId !== measurementId));

    setMeasurements(
      measurements.map((measurement) =>
        measurement.id === measurementId ? { ...certainMeasurement, [minOrMax + 'Value']: value } : measurement
      )
    );
  };

  const getErrorIfExists = (measurementId: number): string =>
    inputErrors.find((error) => error.measurementId === measurementId)?.message || '';

  const deleteMeasurement = (measurementId: number) => () =>
    setMeasurements(measurements.filter(({ id }) => id !== measurementId));

  const addMeasurement = (title: string) => {
    if (title.length < 2) return;

    setMeasurements([
      ...measurements,
      {
        id: measurements.length + 1,
        title,
        minValue: null,
        maxValue: null
      }
    ]);

    return true;
  };

  return (
    <>
      {!!measurements.length ? (
        <View style={{ marginTop: 20 }}>
          <View
            style={{ marginTop: 20, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}
          >
            <Text style={{ fontSize: 18, width: 80, marginRight: 20 }}>Min</Text>
            <Text style={{ fontSize: 18, width: 80, marginRight: 24 }}>Max</Text>
          </View>
        </View>
      ) : null}
      {measurements.map(({ id, ...rest }) => {
        const errorMessage = getErrorIfExists(id);
        return (
          <>
            <MeasurementInput key={id} onChange={changeMeasurement(id)} onDelete={deleteMeasurement(id)} {...rest} />
            {errorMessage ? <Paragraph isError>{errorMessage}</Paragraph> : null}
          </>
        );
      })}
      <SaveableInput onSubmit={addMeasurement} placeholder={'Measurement name (unit)'} marginTop={20} />
    </>
  );
};

export default MeasurementsSettings;
