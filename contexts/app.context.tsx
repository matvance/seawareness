import React, { createContext, useState, useEffect } from 'react';

import { readStorage, writeStorage } from '../storage';

interface TimerObjectType {
  id: number;
  title: string;
  interval: number;
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

  timers: TimerObjectType[];
  setTimers: React.Dispatch<React.SetStateAction<TimerObjectType[]>>;

  measurements: MeasurementObjectType[];
  setMeasurements: React.Dispatch<React.SetStateAction<MeasurementObjectType[]>>;
}

const defaultValues: AppContextType = {
  crewMembers: [],
  setCrewMembers: () => {},

  timers: [],
  setTimers: () => {},

  measurements: [],
  setMeasurements: () => {}
};

const AppContext = createContext<AppContextType>(defaultValues);

export const AppContextProvider: React.FC = ({ children }) => {
  const [crewMembers, setCrewMembers] = useState<string[]>([]);
  const [timers, setTimers] = useState<TimerObjectType[]>([]);
  const [measurements, setMeasurements] = useState<MeasurementObjectType[]>([]);
  const [storageHasBeenRead, setStorageHasBeenRead] = useState<boolean>(false);

  useEffect(() => {
    (async function () {
      await setCrewMembers(await readStorage('crew_members'));
      await setTimers(await readStorage('timers'));
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

  return (
    <AppContext.Provider value={{ crewMembers, setCrewMembers, timers, setTimers, measurements, setMeasurements }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
