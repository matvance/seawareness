import React from 'react';

import { Button, ScreenTemplate, ScreenHeading, MeasurementsTable } from '../components';

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
  const startPermit = () => {};

  /** TODO */

  return (
    <ScreenTemplate>
      <ScreenHeading onBackward={navigation.goBack}>Measurements</ScreenHeading>
      <MeasurementsTable />

      <Button title={'Start permit'} onPress={startPermit} marginTop={50} />
    </ScreenTemplate>
  );
};

export default SetupPermitMeasurements;
