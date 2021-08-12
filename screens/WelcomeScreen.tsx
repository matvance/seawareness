import React, { useState, useContext } from 'react';
import { View, TouchableOpacity } from 'react-native';
import type { NativeSyntheticEvent, TextInputChangeEventData } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { AppContext } from '../contexts';
import { CrewList, Button } from '../components';
import { writeStorage } from '../storage';

import { ScreenHeading, ScreenHeadingSubtitle, ScreenWrapper, Input } from '../styles';

export default function WelcomeScreen({ navigation }) {
  const { crewMembers, setCrewMembers } = useContext(AppContext);
  const [nameInputValue, setNameInputValue] = useState<string>('');
  const [names, setNames] = useState<string[]>([]);

  const handleInputChange = ({ nativeEvent }: NativeSyntheticEvent<TextInputChangeEventData>) =>
    setNameInputValue(nativeEvent.text);

  const handleNameSubmit = () => {
    const isAlreadySaved = names.indexOf(nameInputValue) !== -1;

    if (nameInputValue.length >= 2 && !isAlreadySaved) {
      setNames([...names, nameInputValue]);
      setNameInputValue('');
    }
  };

  const handleNameDelete = (name: string) => {
    setNames(names.filter((item) => item !== name));
  };

  const onSave = async () => {
    setCrewMembers(names);
    await writeStorage('is_app_initialized', true);
    await navigation.navigate('Main');
  };

  const shouldShowButton = names.length >= 2;

  return (
    <>
      <ScreenWrapper>
        <ScreenHeading>Welcome</ScreenHeading>
        <ScreenHeadingSubtitle>
          To start using application you need to enter at least 2 crew members. You will be able to change the list at any time.
        </ScreenHeadingSubtitle>

        <CrewList names={names} onDelete={handleNameDelete} />
      </ScreenWrapper>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          padding: 24,
          backgroundColor: '#fafafa',
          width: '100%'
        }}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center'
          }}
        >
          <Input
            style={{ flexGrow: 1, marginRight: 20 }}
            placeholder={'Name and surname'}
            value={nameInputValue}
            onChange={handleInputChange}
            onSubmitEditing={handleNameSubmit}
            autoCompleteType={'off'}
          />
          <TouchableOpacity onPress={handleNameSubmit}>
            <Feather name={'plus-circle'} size={24} />
          </TouchableOpacity>
        </View>
        {shouldShowButton && (
          <View style={{ marginTop: 24 }}>
            <Button title={'Save'} onPress={onSave} />
          </View>
        )}
      </View>
    </>
  );
}
