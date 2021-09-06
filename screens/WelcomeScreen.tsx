import React, { useState, useContext } from 'react';
import { View } from 'react-native';

import { AppContext } from '../contexts';
import { CrewList, Button, SaveableInput, ScreenTemplate } from '../components';
import { writeStorage } from '../storage';

import { ScreenHeading, ScreenHeadingSubtitle, FixedToBottom } from '../styles';

interface Props {
  navigation: {
    navigate: (route: string) => void;
  };
}

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const { setCrewMembers, setMeasurements, setTimers } = useContext(AppContext);
  const [names, setNames] = useState<string[]>([]);

  const handleNameSubmit = (value: string) => {
    const isAlreadySaved = names.indexOf(value) !== -1;

    if (value.length >= 2 && !isAlreadySaved) {
      setNames([...names, value]);
      return true;
    }
    return false;
  };

  const handleNameDelete = (name: string) => {
    setNames(names.filter((item) => item !== name));
  };

  const onSave = async () => {
    await writeStorage('is_app_initialized', true);

    setCrewMembers(names);
    setMeasurements([
      {
        id: 1,
        title: 'O2',
        minValue: 20.6,
        maxValue: null
      }
    ]);
    setTimers([
      {
        id: 1,
        title: 'Communication timer',
        interval: 15
      },
      {
        id: 2,
        title: 'Measurements timer',
        interval: 25
      },
      {
        id: 3,
        title: 'Soft alarm threshold',
        interval: 3
      }
    ]);

    await navigation.navigate('Main');
  };

  const shouldShowButton = names.length >= 2;

  return (
    <>
      <ScreenTemplate extraPaddingBottom={120}>
        <ScreenHeading>Welcome</ScreenHeading>
        <ScreenHeadingSubtitle>
          To start using application you need to enter at least 2 crew members. You will be able to change the list at any time.
        </ScreenHeadingSubtitle>

        <CrewList names={names} onDelete={handleNameDelete} />
      </ScreenTemplate>
      <FixedToBottom>
        <SaveableInput onSubmit={handleNameSubmit} placeholder={'Name, surname and rank'} />
        {shouldShowButton && (
          <View style={{ marginTop: 24 }}>
            <Button title={'Save'} onPress={onSave} />
          </View>
        )}
      </FixedToBottom>
    </>
  );
};

export default WelcomeScreen;
