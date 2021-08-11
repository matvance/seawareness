import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { ScreenHeading, ScreenHeadingSubtitle, ScreenWrapper, Input } from '../styles';
import CrewList from '../components/CrewList/CrewList';

export default function HomeScreen() {
  return (
    <>
      <ScreenWrapper>
        <ScreenHeading>Welcome</ScreenHeading>
        <ScreenHeadingSubtitle>
          To start using application you need to enter at least 2 crew members. You will be able to change the list at any time.
        </ScreenHeadingSubtitle>

        <CrewList names={['Testowy Janusz', 'Testowa Barbara']} />
      </ScreenWrapper>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          alignItems: 'center',
          position: 'absolute',
          bottom: 24,
          paddingHorizontal: 24
        }}
      >
        <Input style={{ flexGrow: 1, marginRight: 20 }} placeholder={'Name and surname'} />
        <TouchableOpacity>
          <Feather name={'plus-circle'} size={24} />
        </TouchableOpacity>
      </View>
    </>
  );
}
