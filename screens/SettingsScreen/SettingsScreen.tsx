import React from 'react';
import { View, Text } from 'react-native';

import { ScreenHeading } from '../../styles';

import TimersSettings from './components/TimersSettings/TimersSettings';
import { Button, ScreenTemplate } from '../../components';
import { __clearStorage } from '../../storage';
import MeasurementsSettings from './components/MeasurementsSettings/MeasurementsSettings';

export default function SettingsScreen() {
  const clearStorage = () => {
    __clearStorage().then((resp) => console.log('[DEBUG] storage cleared!'));
  };

  return (
    <ScreenTemplate>
      <ScreenHeading>Settings</ScreenHeading>

      <ScreenHeading subheading marginTop={50}>
        Timers
      </ScreenHeading>
      <TimersSettings />

      <ScreenHeading subheading marginTop={50}>
        Measurements
      </ScreenHeading>
      <MeasurementsSettings />

      <ScreenHeading subheading marginTop={250}>
        Debugging only buttons
      </ScreenHeading>
      <Text style={{ marginTop: 10 }}>Will be gone in production version</Text>
      <View style={{ marginTop: 20 }}>
        <Button title={'Clear the AsyncStorage'} onPress={clearStorage} />
      </View>
    </ScreenTemplate>
  );
}
