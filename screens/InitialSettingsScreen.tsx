import React, { useContext } from 'react';
import { Text } from 'react-native';

import TimersSettings from './SettingsScreen/components/TimersSettings/TimersSettings';
import MeasurementsSettings from './SettingsScreen/components/MeasurementsSettings/MeasurementsSettings';
import { Button, ScreenTemplate, ScreenHeading } from '../components';
import { AppContext } from '../contexts';

import { ScreenHeadingSubtitle, FixedToBottom, Input } from '../styles';

interface Props {
  navigation: {
    navigate: (route: string) => void;
    goBack: () => void;
  };
}

const InitialSettingsScreen: React.FC<Props> = ({ navigation }) => {
  const { vesselName, setVesselName } = useContext(AppContext);

  const goBackward = () => navigation.goBack();
  const goForward = () => navigation.navigate('SetupCrew');
  const updateVesselName = (value: React.ReactText) => setVesselName(value as string);

  return (
    <>
      <ScreenTemplate extraPaddingBottom={120}>
        <ScreenHeading onBackward={goBackward}>Initial Settings</ScreenHeading>
        <ScreenHeadingSubtitle>
          Application needs some settings to be entered before initial configuration is done
        </ScreenHeadingSubtitle>

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
      </ScreenTemplate>
      <FixedToBottom>
        <Button title={'Next'} onPress={goForward} />
      </FixedToBottom>
    </>
  );
};

export default InitialSettingsScreen;
