import React, { useEffect, useMemo, useState } from 'react';

import { ScreenTemplate, ScreenHeading } from '../../components';
import LogsStorage, { PermitLogObject } from '../../storage/logs.storage';
import SinglePermit from './components/SinglePermit/SinglePermit';
import { parseDateToDateWithMonth } from './logs-screen.utils';

export default function LogsScreen() {
  const [logs, setLogs] = useState<PermitLogObject[]>([]);

  useEffect(() => {
    const logsStorage = new LogsStorage();

    logsStorage.init().then(() => {
      setLogs(logsStorage.permitLogs);
    });
  }, []);

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

  return (
    <ScreenTemplate>
      <ScreenHeading>Logs</ScreenHeading>
      {!!todayLogs.length && (
        <>
          <ScreenHeading marginTop={40} marginBottom={20} subheading>
            Today, {parseDateToDateWithMonth(new Date())}
          </ScreenHeading>
          {todayLogs.map((log) => (
            <SinglePermit key={log.id} log={log} />
          ))}
        </>
      )}
      {!!yesterdayLogs.length && (
        <>
          <ScreenHeading marginTop={40} marginBottom={20} subheading>
            Yesterday, {parseDateToDateWithMonth(yesterday)}
          </ScreenHeading>
          {yesterdayLogs.map((log) => (
            <SinglePermit key={log.id} log={log} />
          ))}
        </>
      )}
      {!!earlierLogs.length && (
        <>
          <ScreenHeading marginTop={40} marginBottom={20} subheading>
            Earlier
          </ScreenHeading>
          {earlierLogs.map((log) => (
            <SinglePermit key={log.id} log={log} showDate />
          ))}
        </>
      )}
    </ScreenTemplate>
  );
}