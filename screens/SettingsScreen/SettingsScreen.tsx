import React, { useContext } from 'react';
import { View, Text } from 'react-native';

import { ScreenHeading } from '../../styles';

import TimersSettings from './components/TimersSettings/TimersSettings';
import { Button, ScreenTemplate, Input } from '../../components';
import { __clearStorage, readStorage } from '../../storage';
import MeasurementsSettings from './components/MeasurementsSettings/MeasurementsSettings';
import { AppContext } from '../../contexts';

export default function SettingsScreen() {
  const { timers } = useContext(AppContext);

  const clearStorage = () => {
    __clearStorage().then((resp) => console.log('[DEBUG] storage cleared!'));
  };

  const printStorage = async () => {
    console.log({
      timers: await readStorage('@seawareness/timers'),
      crewMembers: await readStorage('crew_members'),
      timersContext: timers
    });
  };

  return (
    <ScreenTemplate>
      <ScreenHeading>Settings</ScreenHeading>

      <Input label={"Vessel's name"} marginTop={50} />

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
      <View style={{ marginTop: 20 }}>
        <Button title={'Read the AsyncStorage'} onPress={printStorage} />
      </View>
    </ScreenTemplate>
  );
}
