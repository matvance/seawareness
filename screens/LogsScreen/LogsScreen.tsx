import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import notifee, { AndroidCategory, AndroidColor, AndroidImportance, EventType } from '@notifee/react-native';

import { ScreenTemplate, ScreenHeading } from '../../components';
import LogsStorage, { PermitLogObject } from '../../storage/logs.storage';
import SinglePermit from './components/SinglePermit/SinglePermit';
import { parseDateToDateWithMonth } from './logs-screen.utils';
import { PermitContext } from '../../contexts';

interface Props {
  navigation: {
    navigate: (route: string) => void;
    goBack: () => void;
  };
}

const LogsScreen: React.FC<Props> = ({ navigation }) => {
  const [logs, setLogs] = useState<PermitLogObject[]>([]);
  const { initPermit, stopPermit } = useContext(PermitContext);
  const [refreshDate, setRefreshDate] = useState(new Date());

  const fetchLogs = () => {
    const logsStorage = new LogsStorage();

    logsStorage.init().then(() => {
      setLogs(logsStorage.permitLogs);
    });
  };

  useEffect(() => setRefreshDate(new Date()), [stopPermit, initPermit]);
  useFocusEffect(fetchLogs);
  useEffect(fetchLogs, []);

  const todayLogs = useMemo(() => {
    const today = new Date().toDateString();
    return logs.filter(({ startTimestamp }) => new Date(startTimestamp).toDateString() === today);
  }, [logs]);

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const yesterdayLogs = useMemo(() => {
    return logs.filter(({ startTimestamp }) => new Date(startTimestamp).toDateString() === yesterday.toDateString());
  }, [logs]);

  const earlierLogs = useMemo(() => {
    return logs.filter((log) => todayLogs.indexOf(log) === -1 && yesterdayLogs.indexOf(log) === -1);
  }, [logs]);

  const goToLogs = (log: PermitLogObject) => () => navigation.navigate('LogsEntry', { log });

  return (
    <ScreenTemplate>
      <ScreenHeading>Logs</ScreenHeading>
      {!!todayLogs.length ? (
        <>
          <ScreenHeading marginTop={40} marginBottom={20} subheading>
            Today, {parseDateToDateWithMonth(new Date())}
          </ScreenHeading>
          {todayLogs.map((log) => (
            <SinglePermit key={log.id} log={log} onPress={goToLogs(log)} />
          ))}
        </>
      ) : null}
      {!!yesterdayLogs.length ? (
        <>
          <ScreenHeading marginTop={40} marginBottom={20} subheading>
            Yesterday, {parseDateToDateWithMonth(yesterday)}
          </ScreenHeading>
          {yesterdayLogs.map((log) => (
            <SinglePermit key={log.id} log={log} onPress={goToLogs(log)} />
          ))}
        </>
      ) : null}
      {!!earlierLogs.length ? (
        <>
          <ScreenHeading marginTop={40} marginBottom={20} subheading>
            Earlier
          </ScreenHeading>
          {earlierLogs.map((log) => (
            <SinglePermit key={log.id} log={log} onPress={goToLogs(log)} showDate />
          ))}
        </>
      ) : null}
    </ScreenTemplate>
  );
};

export default LogsScreen;
