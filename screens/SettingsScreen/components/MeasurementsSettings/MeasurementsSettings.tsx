import React, { useContext } from 'react';
import { Text, View } from 'react-native';

import { SaveableInput } from '../../../../components';
import { AppContext } from '../../../../contexts';
import MeasurementInput from './components/MeasurementInput/MeasurementInput';

const MeasurementsSettings: React.FC = () => {
  const { measurements, setMeasurements } = useContext(AppContext);

  const changeMeasurement = (measurementId: number) => (minOrMax: 'min' | 'max', value: number) => {
    const certainMeasurement = measurements.find(({ id }) => id === measurementId);

    certainMeasurement?.id &&
      setMeasurements([
        ...measurements.filter(({ id }) => id !== measurementId),
        { ...certainMeasurement, [minOrMax + 'Value']: value ? value : null }
      ]);
  };

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
      {!!measurements.length && (
        <View style={{ marginTop: 20 }}>
          <View
            style={{ marginTop: 20, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}
          >
            <Text style={{ fontSize: 18, width: 80, marginRight: 20 }}>Min</Text>
            <Text style={{ fontSize: 18, width: 80, marginRight: 24 }}>Max</Text>
          </View>
        </View>
      )}
      {measurements.map(({ id, ...rest }) => (
        <MeasurementInput key={id} onChange={changeMeasurement(id)} onDelete={deleteMeasurement(id)} {...rest} />
      ))}
      <SaveableInput onSubmit={addMeasurement} placeholder={'Measurement name (unit)'} marginTop={20} />
    </>
  );
};

export default MeasurementsSettings;
