import React, { useContext, useState } from 'react';

import { Button, ScreenTemplate, ScreenHeading, CrewList } from '../../components';
import { AppContext } from '../../contexts';

interface Props {
  navigation: {
    navigate: (route: string, props?: any) => void;
    goBack: () => void;
  };
  route: {
    params: {
      location: string;
      standbyPerson: string;
      personInCharge: string;
    };
  };
}

const SetupPermiCrewScreen: React.FC<Props> = ({ navigation, route }) => {
  const { crewMembers } = useContext(AppContext);
  const [checkedNames, setCheckedNames] = useState<string[]>();

  const goForward = () => navigation.navigate('SetupPermitMeasurements', { ...route.params, checkedNames });

  // Flter our standby person and person in charge
  const { standbyPerson, personInCharge } = route.params;
  const filteredMembers = crewMembers.filter((member) => [standbyPerson, personInCharge].indexOf(member) === -1);

  return (
    <ScreenTemplate>
      <ScreenHeading onBackward={navigation.goBack}>Choose crew</ScreenHeading>

      <CrewList names={filteredMembers} onChangeChecked={setCheckedNames} />

      <Button title={'Next'} onPress={goForward} marginTop={50} />
    </ScreenTemplate>
  );
};

export default SetupPermiCrewScreen;
