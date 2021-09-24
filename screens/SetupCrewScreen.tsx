import React, { useState, useContext } from 'react';
import { View } from 'react-native';

import { AppContext } from '../contexts';
import { CrewList, Button, SaveableInput, ScreenTemplate, ScreenHeading } from '../components';
import { readStorage, writeStorage } from '../storage';

import { ScreenHeadingSubtitle, FixedToBottom } from '../styles';

interface Props {
  navigation: {
    navigate: (route: string) => void;
    goBack: () => void;
  };
}

const SetupCrewScreen: React.FC<Props> = ({ navigation }) => {
  const { crewMembers, setCrewMembers } = useContext(AppContext);

  const submitName = (value: string) => {
    const isAlreadySaved = crewMembers?.indexOf(value) !== -1;

    if (value.length >= 2 && !isAlreadySaved) {
      setCrewMembers([...crewMembers, value]);
      return true;
    }
    return false;
  };

  const saveMembers = async () => {
    await writeStorage('is_app_initialized', true);
    navigation.navigate('Permit');
  };
  const goBackward = () => navigation.goBack();
  const deleteName = (name: string) => {
    setCrewMembers(crewMembers.filter((item) => item !== name));
  };

  const shouldShowButton = crewMembers?.length >= 2;

  return (
    <>
      <ScreenTemplate extraPaddingBottom={120}>
        <ScreenHeading onBackward={goBackward}>Crew list</ScreenHeading>
        <ScreenHeadingSubtitle>
          Before you start using the application, the initial set-up needs to be completed
        </ScreenHeadingSubtitle>

        <CrewList names={crewMembers} onDelete={deleteName} />
      </ScreenTemplate>
      <FixedToBottom>
        <SaveableInput onSubmit={submitName} placeholder={'Name, surname and rank'} />
        {shouldShowButton && (
          <View style={{ marginTop: 24 }}>
            <Button title={'Save'} onPress={saveMembers} />
          </View>
        )}
      </FixedToBottom>
    </>
  );
};

export default SetupCrewScreen;
