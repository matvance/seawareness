import React, { useState, useContext } from 'react';

import { Button, ScreenTemplate, ScreenHeading, MeasurementsTable, ConfirmModal } from '../components';
import { AppContext, PermitContext } from '../contexts';

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
  const [isFormValid, setFormValid] = useState(false);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const toggleConfirmModal = () => setConfirmModalOpen(!isConfirmModalOpen);

  const startPermit = async () => {
    //  TODO: Save measurements to logs and start a session
    setConfirmModalOpen(false);

    const { checkedNames, standbyPerson, personInCharge } = route.params;
    await initPermit(checkedNames, personInCharge, standbyPerson);

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
