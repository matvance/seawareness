import React, { useState, useContext } from 'react';

import { Button, ScreenTemplate, Select } from '../../components';
import { AppContext } from '../../contexts';

import { CrewSelectsWrapper } from './HomeScreen.styles';
import { ScreenHeading, Paragraph } from '../../styles';

export default function HomeScreen({ navigation }) {
  const { crewMembers } = useContext(AppContext);

  const selectOptions = crewMembers.map((memberName) => ({
    label: memberName,
    value: memberName
  }));

  const [standbyPerson, setStandbyPerson] = useState<string | undefined>(selectOptions[0]?.value);
  const [personInCharge, setPersonInCharge] = useState<string | undefined>(selectOptions[1]?.value);

  const handleStandbyPersonChange = (itemValue: React.ReactText) => setStandbyPerson(itemValue as string);
  const handlePersonInChargeChange = (itemValue: React.ReactText) => setPersonInCharge(itemValue as string);
  const redirectToCrewScreen = () => navigation.navigate('Crew');

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
          <Button title={'Start permit'} onPress={() => {}} marginTop={50} />
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
}
