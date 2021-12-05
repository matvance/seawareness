import React, { createContext, useEffect, useRef, useState } from 'react';

import { writeStorage } from '../storage';
import LogsStorage from '../storage/logs.storage';
import { ScheduledAlarms } from '../utils/foreground-service';

export interface SelectedCrewMember {
  name: string;
  isInside: boolean;
  lastAction: Date;
}

export interface ActivePermitData {
  crew: SelectedCrewMember[];
  personInCharge: string;
  standbyPerson: string;
  logId: number;
  initTime: Date;
}

interface ContextValues {
  readonly initTime: Date | null;
  readonly crew: SelectedCrewMember[];
  readonly standbyPerson: string;
  readonly logId: number;
  readonly personInCharge: string;

  setCrew: React.Dispatch<React.SetStateAction<SelectedCrewMember[]>>;
  setStandbyPerson: React.Dispatch<React.SetStateAction<string>>;
  reinitPermitFromStorage: ({ crew, personInCharge, standbyPerson, logId, initTime }: ActivePermitData) => Promise<void>;
  saveScheduledAlarms: (scheduledAlarms: ScheduledAlarms) => Promise<void>;

  addMemberToCrew: (newMember: string) => void;
  initPermit: (selectedCrew: string[], personInCharge: string, standbyPerson: string, logId: number) => Promise<void>;
  stopPermit: () => Promise<void>;
}

const noAccessAlert = () => console.log('PermitContext unreachable at this point');

const defaultValues: ContextValues = {
  initTime: new Date(),
  crew: [],
  standbyPerson: '',
  logId: 0,
  personInCharge: '',

  setCrew: noAccessAlert,
  setStandbyPerson: noAccessAlert,

  addMemberToCrew: noAccessAlert,
  initPermit: async () => noAccessAlert(),
  stopPermit: async () => noAccessAlert(),
  reinitPermitFromStorage: async () => noAccessAlert(),
  saveScheduledAlarms: async () => noAccessAlert()
};

const PermitContext = createContext<ContextValues>(defaultValues);

export const PermitContextProvider: React.FC = ({ children }) => {
  const [initTime, setInitTime] = useState<Date | null>(null);
  const [crew, setCrew] = useState<SelectedCrewMember[]>([]);
  const [standbyPerson, setStandbyPerson] = useState<string>('');
  const [personInCharge, setPersonInCharge] = useState<string>('');
  const [logId, setLogId] = useState<number>(0);
  const logs = useRef<LogsStorage | null>(null);

  const initPermit = async (selectedCrew: string[], personInCharge: string, standbyPerson: string, logId: number) => {
    const initTime = new Date();
    await setInitTime(initTime);

    await setLogId(logId);

    const selectedMasters = personInCharge === standbyPerson ? [personInCharge] : [personInCharge, standbyPerson];
    const crew = selectedCrew.concat(selectedMasters).map((name) => ({
      name,
      isInside: false,
      lastAction: new Date()
    }));

    await setCrew(crew);

    await setStandbyPerson(standbyPerson);
    await setPersonInCharge(personInCharge);

    logs.current = new LogsStorage();
    await logs.current.init();
    await writeStorage('active_permit', { crew, personInCharge, standbyPerson, logId, initTime });
  };

  const reinitPermitFromStorage = async ({ crew, personInCharge, standbyPerson, logId, initTime }: ActivePermitData) => {
    await setInitTime(initTime);
    await setLogId(logId);
    await setCrew(crew);
    await setStandbyPerson(standbyPerson);
    await setPersonInCharge(personInCharge);

    logs.current = new LogsStorage();
    await logs.current.init();
  };

  const addMemberToCrew = (newMember: string) => {
    setCrew((prevCrew) => [
      ...prevCrew,
      {
        name: newMember,
        isInside: false,
        lastAction: new Date()
      }
    ]);
  };

  const saveScheduledAlarms = async (scheduledAlarms: ScheduledAlarms) => {
    await writeStorage('scheduled_alarms', scheduledAlarms);
  };

  const stopPermit = async () => {
    await writeStorage('active_permit', null);
    await writeStorage('scheduled_alarms', null);
    /** TODO: Write logs on end permit */
    await setInitTime(null);
  };

  useEffect(() => {
    if (initTime) {
      writeStorage('active_permit', { crew, personInCharge, standbyPerson, logId, initTime: new Date(initTime) });
    }
  });

  return (
    <PermitContext.Provider
      value={{
        initTime,
        initPermit,
        crew,
        setCrew,
        stopPermit,
        standbyPerson,
        setStandbyPerson,
        logId,
        addMemberToCrew,
        personInCharge,
        reinitPermitFromStorage,
        saveScheduledAlarms
      }}
    >
      {children}
    </PermitContext.Provider>
  );
};

export default PermitContext;
