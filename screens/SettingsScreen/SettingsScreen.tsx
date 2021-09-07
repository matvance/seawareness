import React, { useContext } from 'react';
import { View, Text } from 'react-native';

import TimersSettings from './components/TimersSettings/TimersSettings';
import MeasurementsSettings from './components/MeasurementsSettings/MeasurementsSettings';
import { Button, ScreenTemplate, ScreenHeading } from '../../components';
import { __clearStorage } from '../../storage';
import { AppContext } from '../../contexts';
import { Input } from '../../styles';

export default function SettingsScreen() {
  const { vesselName, setVesselName } = useContext(AppContext);

  const clearStorage = () => {
    __clearStorage().then((resp) => console.log('[DEBUG] storage cleared!'));
  };

  const updateVesselName = (value: React.ReactText) => setVesselName(value as string);

  return (
    <ScreenTemplate>
      <ScreenHeading>Settings</ScreenHeading>

      <Text style={{ fontSize: 18, marginTop: 50, marginBottom: 8 }}>Vessel's name</Text>
      <Input defaultValue={vesselName} onChangeText={updateVesselName} />

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
