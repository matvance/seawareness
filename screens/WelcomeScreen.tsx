import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import type { NativeSyntheticEvent, TextInputChangeEventData } from 'react-native';
import { Feather } from '@expo/vector-icons';

import CrewList from '../components/CrewList/CrewList';

import { ScreenHeading, ScreenHeadingSubtitle, ScreenWrapper, Input } from '../styles';

export default function WelcomeScreen() {
  const [nameInputValue, setNameInputValue] = useState<string>('');
  const [names, setNames] = useState<string[]>(['Testowy Janusz', 'Testowa Barbara']);

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
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          alignItems: 'center',
          position: 'absolute',
          bottom: 0,
          padding: 24,
          backgroundColor: '#fafafa'
        }}
      >
        <Input
          style={{ flexGrow: 1, marginRight: 20 }}
          placeholder={'Name and surname'}
          value={nameInputValue}
          onChange={handleInputChange}
        />
        <TouchableOpacity onPress={handleNameSubmit}>
          <Feather name={'plus-circle'} size={24} />
        </TouchableOpacity>
      </View>
    </>
  );
}
