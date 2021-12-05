import React, { useContext, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs(); //Ignore all log notifications

import { DateTime } from 'luxon';

import StandbyPerson from './components/StandbyPerson';
import StopPermit from './components/StopPermit';
import EnteringCrew, { SwitchPosition } from './components/EnteringCrew';
import { Button, ConfirmModal, MeasurementsModal, ScreenHeading, ScreenTemplate } from '../../components';
import { parseTimeDifference } from './permit-screen.utils';
import { AppContext, PermitContext } from '../../contexts';
import { SelectedCrewMember } from '../../contexts/permit.context';
import LogsStorage from '../../storage/logs.storage';

import { Paragraph } from '../../styles';
import { RowWrapper } from './PermitScreen.styles';
import ForegroundServiceInterface, { AlarmType, ScheduledAlarms } from '../../utils/foreground-service';
import { MeasurementValue } from '../../components/MeasurementsTable/MeasurementsTable';
import { readStorage, writeStorage } from '../../storage';

interface Props {
  navigation: {
    navigate: (route: string, params?: any) => void;
  };
}

const PermitScreen: React.FC<Props> = ({ navigation }) => {
  const { initTime, crew, setCrew, stopPermit, standbyPerson, setStandbyPerson, logId, personInCharge, saveScheduledAlarms } =
    useContext(PermitContext);
  const { timers, measurements } = useContext(AppContext);
  const [refresh, setRefresh] = useState(new Date());
  const [communicationCheckModalOpen, setCommunicationCheckModalOpen] = useState(false);
  const [measurementsModalOpen, setMeasurementsModalOpen] = useState(false);
  const logs = useRef<LogsStorage | null>(null);
  const foregroundService = useRef<ForegroundServiceInterface | null>(null);
  // subscribers
  const onScheduleAlarm = useRef<((alarmType: AlarmType, when: number) => void) | null>(null);
  const onStopAlarm = useRef<((alarmType: AlarmType | 'all', keepService: boolean) => void) | null>(null);
  const onStopPermitCb = useRef<(() => void) | null>(null);
  //

  useEffect(() => {
    const refresh = setInterval(() => setRefresh(new Date()), 1000);
    return () => clearInterval(refresh);
  }, []);

  const initForegroundService = async () => {
    const scheduledAlarms: ScheduledAlarms = await readStorage('scheduled_alarms');
    foregroundService.current = new ForegroundServiceInterface({
      onScheduleAlarm: (callback) => (onScheduleAlarm.current = callback),
      onStopAlarm: (callback) => (onStopAlarm.current = callback),
      scheduledAlarms,
      onStopPermit: (callback) => (onStopPermitCb.current = callback)
    });

    const scheduleAllAlarms = () => {
      if (onScheduleAlarm.current) {
        if (!scheduledAlarms.communication.nextAlarmTime) {
          scheduleAlarmProvider('communication')();
        }
        if (!scheduledAlarms.measurements.nextAlarmTime) {
          scheduleAlarmProvider('measurements')();
        }
      } else {
        setTimeout(() => scheduleAllAlarms(), 300);
      }
    };

    scheduleAllAlarms();
  };

  useEffect(() => {
    if (initTime && !foregroundService.current) {
      logs.current = new LogsStorage();
      logs.current.init().then(() => {
        initForegroundService();
      });
    }
  }, [initTime]);

  const onNewCrewMembers = (crewMembers: SelectedCrewMember[], switchPositionsForLogs: SwitchPosition[]) => {
    if (logs.current) {
      logs.current.addLog(logId, {
        type: 'change-position',
        positions: switchPositionsForLogs,
        timestamp: new Date().getTime()
      });
    } else {
      console.error('Logs not initialized in PermitScreen.tsx trying to changed positions of entering crew');
    }

    setCrew(crewMembers);
  };
  const onChangeStandbyPerson = async (newStandbyPerson: string) => {
    setStandbyPerson(newStandbyPerson);
    if (logs.current) {
      logs.current.addLog(logId, {
        type: 'standby-person-change',
        standbyPerson: newStandbyPerson,
        timestamp: new Date().getTime()
      });
    } else {
      console.error('Logs not initialized in PermitScreen.tsx trying to add log of changing standby person');
    }
  };
  const onStopPermit = async () => {
    await writeStorage('scheduled_alarms', null);
    await stopPermit();
    if (onStopAlarm.current) onStopAlarm.current('all', false);
    if (foregroundService.current) await foregroundService.current.stopForegroundService();
    if (onStopPermitCb.current) await onStopPermitCb.current();
    await navigation.navigate('SetupPermit');
  };
  const onCommunicationCheckConfirm = async () => {
    setCommunicationCheckModalOpen(false);

    if (logs.current) {
      await logs.current.addLog(logId, {
        type: 'communication-check',
        timestamp: new Date().getTime()
      });
    } else {
      console.error('Logs not initialized yet');
    }

    if (onStopAlarm.current) {
      await onStopAlarm.current('communication', true);
    } else {
      console.error('onStopAlarm.current not initialized or playing right now');
    }

    scheduleAlarmProvider('communication')();
  };
  const toggleCommunicationCheckModalProvider = (isOpen: boolean) => () => setCommunicationCheckModalOpen(isOpen);
  const toggleMeasurementsModalProvider = (isOpen: boolean) => () => setMeasurementsModalOpen(isOpen);
  const onSaveMeasurementsCheck = async (measurementValues: MeasurementValue[]) => {
    const measurementValuesWithTitles = measurementValues.map((value) => ({
      ...value,
      title: measurements.find(({ id }) => value.id === id)?.title
    }));

    setMeasurementsModalOpen(false);
    if (logs.current) {
      await logs.current.addLog(logId, {
        type: 'measurements',
        measurements: measurementValuesWithTitles,
        timestamp: new Date().getTime()
      });
    } else {
      console.error('Logs not initialized yet');
    }

    if (onStopAlarm.current) {
      await onStopAlarm.current('measurements', true);
    } else {
      console.error('onStopAlarm.current not initialized or playing right now');
    }

    scheduleAlarmProvider('measurements')();
  };
  const scheduleAlarmProvider = (alarmType: AlarmType) => () => {
    let timer;
    if (alarmType === 'communication') {
      timer = timers.find(({ title }) => title === 'Communication timer');
    } else {
      timer = timers.find(({ title }) => title === 'Measurements timer');
    }

    if (!onScheduleAlarm.current) return console.warn('onScheduleAlarm.current is not defined');
    if (!timer) return console.warn('timer not found in PermiScreen.tsx');
    onScheduleAlarm.current(alarmType, new Date().getTime() + timer.interval * 1000 * 60);
  };

  const parseAlarmTimeToTimeString = (alarmTime: number = 0) => {
    const now = new Date().getTime();
    if (alarmTime - now <= 0) {
      return '00:00';
    }
    return DateTime.fromJSDate(new Date(alarmTime - now)).toFormat('mm:ss');
  };

  useEffect(() => {
    if (foregroundService.current?.scheduledAlarms) saveScheduledAlarms(foregroundService.current?.scheduledAlarms);
  });

  if (!initTime) {
    return (
      <ScreenTemplate>
        <ScreenHeading>Loading..</ScreenHeading>
      </ScreenTemplate>
    );
  }

  const isAnybodyIn = !!crew.find(({ isInside }) => isInside);

  const nextCommunicationTimerAlarm =
    (foregroundService?.current?.scheduledAlarms.communication.nextAlarmTime || 0) - new Date().getTime();
  const nextMeasurementTimerAlarm =
    (foregroundService?.current?.scheduledAlarms.measurements.nextAlarmTime || 0) - new Date().getTime();

  return (
    <ScreenTemplate>
      <ScreenHeading>Work in progress</ScreenHeading>

      <RowWrapper marginTop={30}>
        <View style={{ flexBasis: '60%' }}>
          <Paragraph>Work started</Paragraph>
          <Paragraph bold>{DateTime.fromJSDate(new Date(initTime)).toFormat('dd LLLL, HH:mm')}</Paragraph>
        </View>
        <View style={{ flexBasis: '40%' }}>
          <Paragraph>Duration</Paragraph>
          <Paragraph bold>{parseTimeDifference(new Date(initTime))}</Paragraph>
        </View>
      </RowWrapper>

      <RowWrapper marginTop={50}>
        <View style={{ flexBasis: '60%' }}>
          <Paragraph>Communication timer</Paragraph>
          <Paragraph bold isError={nextCommunicationTimerAlarm <= 0}>
            {parseAlarmTimeToTimeString(foregroundService?.current?.scheduledAlarms.communication.nextAlarmTime)}
          </Paragraph>
        </View>
        <View style={{ flexBasis: '40%' }}>
          <Button title={'Check now'} onPress={toggleCommunicationCheckModalProvider(true)} />
        </View>
      </RowWrapper>

      <RowWrapper marginTop={20}>
        <View style={{ flexBasis: '60%' }}>
          <Paragraph>Measurement timer</Paragraph>
          <Paragraph bold isError={nextMeasurementTimerAlarm <= 0}>
            {parseAlarmTimeToTimeString(foregroundService?.current?.scheduledAlarms.measurements.nextAlarmTime)}
          </Paragraph>
        </View>
        <View style={{ flexBasis: '40%' }}>
          <Button title={'Check now'} onPress={toggleMeasurementsModalProvider(true)} />
        </View>
      </RowWrapper>

      <StandbyPerson crew={crew} standbyPerson={standbyPerson} onChangeStandbyPerson={onChangeStandbyPerson} />
      <EnteringCrew crew={crew} standbyPerson={standbyPerson} onNewCrewMembers={onNewCrewMembers} />
      <StopPermit onStopPermit={onStopPermit} isAnybodyIn={isAnybodyIn} />
      <MeasurementsModal
        isOpen={measurementsModalOpen}
        onSave={onSaveMeasurementsCheck}
        onCancel={toggleMeasurementsModalProvider(false)}
      />
      <ConfirmModal
        isOpen={communicationCheckModalOpen}
        onConfirm={onCommunicationCheckConfirm}
        onCancel={toggleCommunicationCheckModalProvider(false)}
        text={'I am confirming that communication check has been done properly.'}
      />
    </ScreenTemplate>
  );
};

export default PermitScreen;
