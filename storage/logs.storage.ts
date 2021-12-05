import { readStorage, writeStorage } from './index';
import { MeasurementObjectType, TimerObjectType } from '../contexts/app.context';
import { MeasurementValue } from '../components/MeasurementsTable/MeasurementsTable';
import { SwitchPosition } from '../screens/PermitScreen/components/EnteringCrew';

interface CommonLog {
  timestamp: number;
}

interface MeasurementLog extends CommonLog {
  type: 'measurements';
  measurements: (MeasurementValue & { title?: string })[];
}

interface PreentryPreparationsLog extends CommonLog {
  type: 'preentry-preparations';
  standbyPerson: string;
}
interface StandbyPersonChangeLog extends CommonLog {
  type: 'standby-person-change';
  standbyPerson: string;
}
interface CommunicationCheckLog extends CommonLog {
  type: 'communication-check';
}
interface ChangePosition extends CommonLog {
  type: 'change-position';
  positions: SwitchPosition[];
}

export type Log = MeasurementLog | PreentryPreparationsLog | StandbyPersonChangeLog | CommunicationCheckLog | ChangePosition;

interface PermitParams {
  vesselName: string;
  location: string;
  timers: TimerObjectType[];
  safetyParameters: MeasurementObjectType[];
  personInCharge: string;
}

export interface PermitLogObject extends PermitParams {
  id: number;
  logs: Log[];
  closeTimestamp?: number;
  startTimestamp: number;
}

class LogsStorage {
  public permitLogs: PermitLogObject[] = [];
  // public pdfInterface: PdfInterfaceType = new PDFInterface();

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
    // console.log('writing', this.permitLogs);
    await writeStorage('logs', this.permitLogs);
    await this.fetchLogsData();
  };

  public init = async () => {
    await this.fetchLogsData();
  };

  public addPermitLog = async (permitParams: PermitParams): Promise<number> => {
    const id = this.permitLogs.length + 1;
    this.permitLogs = [...this.permitLogs, { ...permitParams, logs: [], id, startTimestamp: new Date().getTime() }];

    await this.saveLogsData();
    return id;
  };

  public addLog = async (permitLogId: number, log: Log) => {
    // console.log(JSON.stringify({ permitLogId, log }, null, 2));

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
    // console.log(this.permitLogs);
  };

  // public printPdf = async (permitLogId: number) => {
  //   await this.fetchLogsData();
  //   const permitLog = this.permitLogs.find(({ id }) => id === permitLogId);
  //   console.log(this.permitLogs);
  //   if (permitLog) {
  //     this.pdfInterface.generatePdf(permitLog);
  //   }
  // };
}

export default LogsStorage;
