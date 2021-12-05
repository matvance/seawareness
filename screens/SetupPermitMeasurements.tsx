import React, { useState, useContext, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import LogsStorage from '../storage/logs.storage';
import { Button, ScreenTemplate, ScreenHeading, MeasurementsTable, ConfirmModal } from '../components';
import { PermitContext, AppContext } from '../contexts';
import { MeasurementValue } from '../components/MeasurementsTable/MeasurementsTable';

interface Props {
  navigation: {
    navigate: (route: string) => void;
    goBack: () => void;
  };

  route: {
    params: {
      location: string;
      standbyPerson: string;
      personInCharge: string;
      checkedNames: string[];
    };
  };
}

const SetupPermitMeasurements: React.FC<Props> = ({ navigation, route }) => {
  const { initPermit, initTime } = useContext(PermitContext);
  const { vesselName, measurements, timers } = useContext(AppContext);

  const [isFormValid, setFormValid] = useState(false);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [measurementValues, setMeasurementValues] = useState<MeasurementValue[]>([]);

  const toggleConfirmModal = () => setConfirmModalOpen(!isConfirmModalOpen);

  const startPermit = async () => {
    setConfirmModalOpen(false);

    const { checkedNames, standbyPerson, personInCharge, location } = route.params;

    const logs = new LogsStorage();
    await logs.init();

    const permit = {
      personInCharge,
      location,
      safetyParameters: measurements,
      timers,
      vesselName
    };

    const permitLogId = await logs.addPermitLog(permit);

    const measurementValuesWithTitles = measurementValues.map((value) => ({
      ...value,
      title: measurements.find(({ id }) => value.id === id)?.title
    }));

    await logs.addLog(permitLogId, {
      type: 'measurements',
      measurements: measurementValuesWithTitles,
      timestamp: new Date().getTime()
    });
    await logs.addLog(permitLogId, { type: 'preentry-preparations', standbyPerson, timestamp: new Date().getTime() });

    await initPermit(checkedNames, personInCharge, standbyPerson, permitLogId);

    navigation.navigate('PermitScreen');
  };

  const onChangeMeasuresStatus = (isVaild: boolean, measurementValues: MeasurementValue[]) => {
    setFormValid(isVaild);
    setMeasurementValues(measurementValues);
  };

  const goToPermitScreenIfActive = () => (initTime ? navigation.navigate('PermitScreen') : undefined);

  useEffect(goToPermitScreenIfActive, [initTime]);
  useFocusEffect(goToPermitScreenIfActive);

  return (
    <ScreenTemplate>
      <ScreenHeading onBackward={navigation.goBack}>Measurements</ScreenHeading>
      <MeasurementsTable onChange={onChangeMeasuresStatus} />

      {isFormValid ? <Button title={'Start permit'} onPress={toggleConfirmModal} marginTop={50} /> : null}
      <ConfirmModal
        onConfirm={startPermit}
        isOpen={isConfirmModalOpen}
        onCancel={toggleConfirmModal}
        text={'Pre-entry preparations and checks completed.'}
      />
    </ScreenTemplate>
  );
};

export default SetupPermitMeasurements;
