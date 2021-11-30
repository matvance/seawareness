import React, { useContext, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import Sound from 'react-native-sound';
import Torch from 'react-native-torch';

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
import notifee, { AndroidCategory, AndroidColor, AndroidImportance, EventDetail, EventType } from '@notifee/react-native';

interface Props {
  navigation: {
    navigate: (route: string, params?: any) => void;
  };
}

// AppRegistry.registerComponent('alert-activity', () => AlertActivity);

const PermitScreen: React.FC<Props> = ({ navigation }) => {
  const { initTime, crew, setCrew, stopPermit, standbyPerson, setStandbyPerson, logId } = useContext(PermitContext);
  const [refresh, setRefresh] = useState(new Date());
  const onStopPermitCallback = useRef<() => Promise<void>>();
  const alarmInstance = useRef<Sound>();

  useEffect(() => {
    const refresh = setInterval(() => setRefresh(new Date()), 1000);
    return () => clearInterval(refresh);
  }, []);

  const onStopPermitEvent = (callback: () => Promise<void>) => {
    onStopPermitCallback.current = callback;
  };

  const dispayNotification = async () => {
    // Create a channel
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      lights: true,
      vibration: false
    });

    // const soundsList = await NotificationSounds.getNotifications('notification');
    notifee.registerForegroundService((notification) => {
      return new Promise(() => {
        //CONFIGURE ALARMS
        Sound.setCategory('Alarm');
        const alarm = new Sound('alarm.mp3', Sound.MAIN_BUNDLE, (error) => {
          if (error) {
            console.log('failed to load the sound', error);
            return;
          }
          alarmInstance.current = alarm;
          alarm.setNumberOfLoops(-1);
          alarm.setVolume(0.1);
        });

        // console.log('new notification', JSON.stringify(notification, null, 2));

        let isTorchActive = false;
        let toggleTorchIntervalActive = true;

        const handleEvent = async ({ type, detail }: { type: EventType; detail: EventDetail }) => {
          // console.log('onForegroundEvent', JSON.stringify({ type, detail }, null, 2));
          if (detail.notification?.data?.type === 'alarm' && alarmInstance.current && type === EventType.DELIVERED) {
            alarm.play();

            setInterval(() => {
              if (!toggleTorchIntervalActive) return;
              isTorchActive = !isTorchActive;
              Torch.switchState(isTorchActive);
            }, 500);
          }
          // if (type === EventType.ACTION_PRESS && detail?.pressAction && detail.pressAction.id === 'default') {
          //   notifee.stopForegroundService();
          // }
          if (
            detail.notification?.data?.type === 'alarm' &&
            alarmInstance.current &&
            [EventType.PRESS, EventType.DISMISSED].indexOf(type) !== -1
          ) {
            Torch.switchState(false);
            await alarm.stop();
            await alarm.release();
            toggleTorchIntervalActive = false;
          }
        };

        notifee.onForegroundEvent(handleEvent);
        notifee.onBackgroundEvent(handleEvent);

        setTimeout(async () => {
          // Display a notification
          await notifee.displayNotification({
            ...notification,
            id: notification.id,
            title: 'Measurements alarm',
            body: 'You must do the measurements.',
            data: { type: 'alarm' },
            android: {
              ...notification.android,
              category: AndroidCategory.CALL,
              fullScreenAction: {
                launchActivity: 'default',
                id: 'default'
              },
              color: AndroidColor.RED,
              colorized: true
            }
          });
        }, 10000);

        onStopPermitEvent(async () => {
          await notifee.stopForegroundService();
          await alarm.stop();
          await alarm.release();
        });
      });
    });

    // Display a notification
    await notifee.displayNotification({
      title: 'Permit is open',
      body: 'You have currently open permit.',
      android: {
        category: AndroidCategory.SERVICE,
        importance: AndroidImportance.HIGH,
        pressAction: {
          launchActivity: 'default',
          id: 'default'
        },
        channelId,
        asForegroundService: true
      }
    });
  };

  useEffect(() => {
    dispayNotification();
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
    alarmInstance.current && (await alarmInstance.current.stop());
    onStopPermitCallback.current && (await onStopPermitCallback.current());
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
