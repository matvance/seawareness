import React, { useState, useContext } from 'react';

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
  const { initPermit } = useContext(PermitContext);
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

    const permitLogId = await logs.addPermitLog({
      personInCharge,
      location,
      safetyParameters: measurements,
      timers,
      vesselName
    });

    await initPermit(checkedNames, personInCharge, standbyPerson, permitLogId);

    await logs.addLog(permitLogId, { type: 'measurements', measurements: measurementValues, timestamp: new Date().getTime() });
    await logs.addLog(permitLogId, { type: 'preentry-preparations', standbyPerson, timestamp: new Date().getTime() });
    // navigation.navigate('PermitScreen');
  };

  const onChangeMeasuresStatus = (isVaild: boolean, measurementValues: MeasurementValue[]) => {
    setFormValid(isVaild);
    setMeasurementValues(measurementValues);
  };

  return (
    <ScreenTemplate>
      <ScreenHeading onBackward={navigation.goBack}>Measurements</ScreenHeading>
      <MeasurementsTable onChange={onChangeMeasuresStatus} />

      {isFormValid && <Button title={'Start permit'} onPress={toggleConfirmModal} marginTop={50} />}
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
