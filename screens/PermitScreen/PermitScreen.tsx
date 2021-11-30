import React, { useContext, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';

import { DateTime } from 'luxon';

import StandbyPerson from './components/StandbyPerson';
import StopPermit from './components/StopPermit';
import EnteringCrew from './components/EnteringCrew';
import { Button, ScreenHeading, ScreenTemplate } from '../../components';
import { parseTimeDifference } from './permit-screen.utils';
import { PermitContext } from '../../contexts';
import { SelectedCrewMember } from '../../contexts/permit.context';
import LogsStorage from '../../storage/logs.storage';

import { Paragraph } from '../../styles';
import { RowWrapper } from './PermitScreen.styles';
import ForegroundServiceInterface from '../../utils/foreground-service';

interface Props {
  navigation: {
    navigate: (route: string, params?: any) => void;
  };
}

const PermitScreen: React.FC<Props> = ({ navigation }) => {
  const { initTime, crew, setCrew, stopPermit, standbyPerson, setStandbyPerson, logId } = useContext(PermitContext);
  const [refresh, setRefresh] = useState(new Date());
  const foregroundService = useRef<ForegroundServiceInterface | null>(null);

  useEffect(() => {
    const refresh = setInterval(() => setRefresh(new Date()), 1000);
    return () => clearInterval(refresh);
  }, []);

  const initForegroundService = () =>
    (foregroundService.current = new ForegroundServiceInterface({
      onResumeApplication: () => console.log('I HAVE BEEN RESUMED')
    }));

  useEffect(() => {
    initForegroundService();
  }, []);

  const onNewCrewMembers = (crewMembers: SelectedCrewMember[]) => setCrew(crewMembers);
  const onChangeStandbyPerson = async (newStandbyPerson: string) => {
    setStandbyPerson(newStandbyPerson);

    const logs = new LogsStorage();
    await logs.init();
    await logs.addLog(logId, { type: 'standby-person-change', standbyPerson: newStandbyPerson, timestamp: new Date().getTime() });
  };
  const onStopPermit = async () => {
    await stopPermit();
    await foregroundService?.current?.stopForegroundService();
    await navigation.navigate('SetupPermit');
  };

  if (!initTime) {
    return (
      <ScreenTemplate>
        <ScreenHeading>Error</ScreenHeading>
      </ScreenTemplate>
    );
  }

  const isAnybodyIn = !!crew.find(({ isInside }) => isInside);

  return (
    <ScreenTemplate>
      <ScreenHeading>Work in progress</ScreenHeading>

      <RowWrapper marginTop={30}>
        <View style={{ flexBasis: '60%' }}>
          <Paragraph>Work started</Paragraph>
          <Paragraph bold>{DateTime.fromJSDate(initTime).toFormat('dd LLLL, HH:mm')}</Paragraph>
        </View>
        <View style={{ flexBasis: '40%' }}>
          <Paragraph>Duration</Paragraph>
          <Paragraph bold>{parseTimeDifference(initTime)}</Paragraph>
        </View>
      </RowWrapper>

      <RowWrapper marginTop={50}>
        <View style={{ flexBasis: '60%' }}>
          <Paragraph>Communication timer</Paragraph>
          <Paragraph bold>14:47</Paragraph>
        </View>
        <View style={{ flexBasis: '40%' }}>
          <Button title={'Check now'} onPress={() => {}} />
        </View>
      </RowWrapper>

      <RowWrapper marginTop={20}>
        <View style={{ flexBasis: '60%' }}>
          <Paragraph>Measurement timer</Paragraph>
          <Paragraph bold>10:11</Paragraph>
        </View>
        <View style={{ flexBasis: '40%' }}>
          <Button title={'Check now'} onPress={() => {}} />
        </View>
      </RowWrapper>

      <StandbyPerson crew={crew} standbyPerson={standbyPerson} onChangeStandbyPerson={onChangeStandbyPerson} />
      <EnteringCrew crew={crew} standbyPerson={standbyPerson} onNewCrewMembers={onNewCrewMembers} />
      <StopPermit onStopPermit={onStopPermit} isAnybodyIn={isAnybodyIn} />
    </ScreenTemplate>
  );
};

export default PermitScreen;
