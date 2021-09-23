import React, { useState } from 'react';

import { Button, ScreenTemplate, ScreenHeading, MeasurementsTable, ConfirmModal } from '../components';

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
  const [isFormValid, setFormValid] = useState(false);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const toggleConfirmModal = () => setConfirmModalOpen(!isConfirmModalOpen);

  const startPermit = () => {
    //  TODO: Save measurements to logs and start a session
    setConfirmModalOpen(false);
    navigation.navigate('Permit');
  };

  const onChangeMeasuresStatus = (isVaild: boolean) => {
    setFormValid(isVaild);
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
