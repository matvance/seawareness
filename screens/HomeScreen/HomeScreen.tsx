import React, { useState, useContext, useEffect } from 'react';
import { Text } from 'react-native';

import { Button, ScreenTemplate, Select, ScreenHeading } from '../../components';
import { AppContext } from '../../contexts';

import { CrewSelectsWrapper } from './HomeScreen.styles';
import { Input, Paragraph } from '../../styles';

interface Props {
  navigation: {
    navigate: (route: string, params?: any) => void;
  };
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { crewMembers } = useContext(AppContext);

  const [standbyPerson, setStandbyPerson] = useState<string>();
  const [personInCharge, setPersonInCharge] = useState<string>();
  const [location, setLocation] = useState<string>();

  const selectOptions = crewMembers.map((memberName) => ({
    label: memberName,
    value: memberName
  }));

  useEffect(() => {
    setStandbyPerson(crewMembers[0]);
    setPersonInCharge(crewMembers[1]);
  }, [crewMembers]);

  const handleStandbyPersonChange = (itemValue: React.ReactText) => setStandbyPerson(itemValue as string);
  const handlePersonInChargeChange = (itemValue: React.ReactText) => setPersonInCharge(itemValue as string);
  const handleLocationChange = (itemValue: React.ReactText) => setLocation(itemValue as string);
  const redirectToCrewScreen = () => navigation.navigate('Crew');
  const goForward = () => navigation.navigate('SetupPermitCrew', { location, standbyPerson, personInCharge });

  return (
    <ScreenTemplate>
      <ScreenHeading>Start your work</ScreenHeading>

      {crewMembers.length >= 2 ? (
        <>
          <CrewSelectsWrapper>
            <Select
              label={'Standby person'}
              options={selectOptions}
              selectedValue={standbyPerson}
              onValueChange={handleStandbyPersonChange}
            />
            <Select
              label={'Person in charge'}
              marginTop={36}
              options={selectOptions}
              selectedValue={personInCharge}
              onValueChange={handlePersonInChargeChange}
            />
          </CrewSelectsWrapper>

          <Paragraph marginTop={40} marginBottom={8}>
            Location
          </Paragraph>
          <Input defaultValue={location} onChangeText={handleLocationChange} />

          {location && <Button title={'Next'} onPress={goForward} marginTop={50} />}
        </>
      ) : (
        <>
          <Paragraph isError marginTop={50}>
            You need to have at least 2 crew members to start permit
          </Paragraph>
          <Button title={'Add crew members'} onPress={redirectToCrewScreen} marginTop={50} />
        </>
      )}
    </ScreenTemplate>
  );
};

export default HomeScreen;
