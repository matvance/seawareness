import React, { createContext, useState, useEffect } from 'react';

import { readStorage, writeStorage } from '../storage';

interface TimersObjectType {
  communication: number;
  measurement: number;
  softAlarmThreshold: number;

  [prop: string]: number;
}

interface AppContextType {
  crewMembers: string[];
  setCrewMembers: React.Dispatch<React.SetStateAction<string[]>>;

  timers: TimersObjectType;
  setTimers: (timers: TimersObjectType) => void;
}

const defaultValues: AppContextType = {
  crewMembers: [],
  setCrewMembers: () => {},

  timers: {
    communication: 0,
    measurement: 0,
    softAlarmThreshold: 0
  },
  setTimers: () => {}
};

const AppContext = createContext<AppContextType>(defaultValues);

export const AppContextProvider: React.FC = ({ children }) => {
  const [crewMembers, setCrewMembers] = useState<string[]>([]);
  const [timers, setTimersObject] = useState<TimersObjectType>(defaultValues.timers);
  const [storageHasBeenRead, setStorageHasBeenRead] = useState<boolean>(false);
  const [refreshDate, setRefreshDate] = useState<Date>(new Date());

  console.log('UPDATED', new Date());

  useEffect(() => {
    async function readStorageData() {
      try {
        setCrewMembers(await readStorage('crew_members'));
        setTimersObject(await readStorage('timers'));
        setStorageHasBeenRead(true);
      } catch (e) {
        console.log('[DEBUG] Error reading data from AsyncStorage', e);
      }
    }
    readStorageData();
  }, []);

  useEffect(() => {
    async function writeStorageData() {
      try {
        await writeStorage('crew_members', crewMembers);
        await writeStorage('timers', timers);
      } catch (e) {
        console.log('[DEBUG] Error writing data to AsyncStorage', e);
      }
    }
    if (storageHasBeenRead) {
      writeStorageData();
    }
  });

  const refresh = () => setRefreshDate(new Date());

  const setTimers = (timers: TimersObjectType) => {
    setTimersObject(timers);
    refresh();
  };

  return <AppContext.Provider value={{ crewMembers, setCrewMembers, timers, setTimers }}>{children}</AppContext.Provider>;
};

export default AppContext;
