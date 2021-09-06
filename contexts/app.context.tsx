import React, { createContext, useState, useEffect } from 'react';

import { readStorage, writeStorage } from '../storage';

interface TimersObjectType {
  communication: number;
  measurement: number;
  softAlarmThreshold: number;

  [prop: string]: number;
}

interface MeasurementObjectType {
  id: number;
  title: string;
  minValue: number | null;
  maxValue: number | null;
}

interface AppContextType {
  crewMembers: string[];
  setCrewMembers: React.Dispatch<React.SetStateAction<string[]>>;

  timers: TimersObjectType;
  setTimers: (timers: TimersObjectType) => void;

  measurements: MeasurementObjectType[];
  setMeasurements: React.Dispatch<React.SetStateAction<MeasurementObjectType[]>>;
}

const defaultValues: AppContextType = {
  crewMembers: [],
  setCrewMembers: () => {},

  timers: {
    communication: 0,
    measurement: 0,
    softAlarmThreshold: 0
  },
  setTimers: () => {},

  measurements: [],
  setMeasurements: () => {}
};

const AppContext = createContext<AppContextType>(defaultValues);

export const AppContextProvider: React.FC = ({ children }) => {
  const [crewMembers, setCrewMembers] = useState<string[]>([]);
  const [timers, setTimersObject] = useState<TimersObjectType>(defaultValues.timers);
  const [measurements, setMeasurements] = useState<MeasurementObjectType[]>([]);
  const [storageHasBeenRead, setStorageHasBeenRead] = useState<boolean>(false);
  const [refreshDate, setRefreshDate] = useState<Date>(new Date());

  useEffect(() => {
    (async function () {
      await setCrewMembers(await readStorage('crew_members'));
      await setTimersObject(await readStorage('timers'));
      await setMeasurements(await readStorage('measurements'));
      await setStorageHasBeenRead(true);
    })();
  }, []);

  useEffect(() => {
    if (!storageHasBeenRead) return;
    (async function () {
      await writeStorage('crew_members', crewMembers);
      await writeStorage('timers', timers);
      await writeStorage('measurements', measurements);
    })();
  });

  const refresh = () => setRefreshDate(new Date());

  const setTimers = (timers: TimersObjectType) => {
    setTimersObject(timers);
    refresh();
  };

  return (
    <AppContext.Provider value={{ crewMembers, setCrewMembers, timers, setTimers, measurements, setMeasurements }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
