import { readStorage, writeStorage } from './index';
import { MeasurementObjectType, TimerObjectType } from '../contexts/app.context';
import { MeasurementValue } from '../components/MeasurementsTable/MeasurementsTable';

interface CommonLog {
  timestamp: number;
}

interface MeasurementLog extends CommonLog {
  type: 'measurements';
  measurements: MeasurementValue[];
}

interface PreentryPreparationsLog extends CommonLog {
  type: 'preentry-preparations';
  standbyPerson: string;
}

type Log = MeasurementLog | PreentryPreparationsLog;

interface PermitParams {
  vesselName: string;
  location: string;
  timers: TimerObjectType[];
  safetyParameters: MeasurementObjectType[];
  personInCharge: string;
}

interface PermitLogObject extends PermitParams {
  id: number;
  logs: Log[];
  closeTimestamp?: number;
  startTimestamp: number;
}

class LogsStorage {
  permitLogs: PermitLogObject[] = [];

  constructor() {
    this.fetchLogsData();
  }

  private fetchLogsData = async () => {
    let storage = await readStorage('logs');
    if (storage === null) {
      await writeStorage('logs', []);
      this.permitLogs = [];
    } else {
      this.permitLogs = storage;
    }
  };

  private saveLogsData = async () => {
    await writeStorage('logs', this.permitLogs);
    await this.fetchLogsData();
  };

  public addPermitLog = async (permitParams: PermitParams): Promise<number> => {
    const id = this.permitLogs.length + 1;
    this.permitLogs.push({ ...permitParams, logs: [], id, startTimestamp: new Date().getTime() });

    await this.saveLogsData();
    return id;
  };

  public addLog = async (permitLogId: number, log: Log) => {
    this.permitLogs.find(({ id }) => id === permitLogId)?.logs.push(log);
    await this.saveLogsData();
  };

  public closePermitLog = async (logId: number) => {
    this.permitLogs = this.permitLogs.map((log) =>
      log.id === logId
        ? {
            ...log,
            closeTimestamp: new Date().getTime()
          }
        : log
    );

    await this.saveLogsData();
  };

  /** DEBUG */
  public _printLogs = async () => {
    await this.fetchLogsData();
    console.log(this.permitLogs);
  };
}

export default LogsStorage;
