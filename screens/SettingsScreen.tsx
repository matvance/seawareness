import React from 'react';
import { View, Text } from 'react-native';

import { ScreenHeading } from '../styles';

import { Button, ScreenTemplate } from '../components';
import { __clearStorage } from '../storage';

export default function SettingsScreen() {
  const clearStorage = () => {
    __clearStorage().then((resp) => console.log('[DEBUG] storage cleared!'));
  };

  return (
    <ScreenTemplate>
      <ScreenHeading>Settings</ScreenHeading>
      <View style={{ marginTop: 50, display: 'flex', flexDirection: 'column' }}>
        <Text style={{ fontSize: 20, marginBottom: 24 }}>Debugging only buttons</Text>
        <Button title={'Clear the AsyncStorage'} onPress={clearStorage} />
      </View>
    </ScreenTemplate>
  );
}
