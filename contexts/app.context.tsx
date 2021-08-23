import React, { createContext, useState, useEffect } from 'react';

import { readStorage, writeStorage } from '../storage';

interface TimersObjectType {
  communication: number;
  measurement: number;
  softAlarmThreshold: number;
}

interface AppContextType {
  crewMembers: string[];
  setCrewMembers: (crewMembers: string[]) => void;

  timers: TimersObjectType;
  setTimers: (newTimers: TimersObjectType) => void;
}

const defaultValues: AppContextType = {
  crewMembers: [],
  setCrewMembers: () => {},

  timers: {
    communication: 15,
    measurement: 20,
    softAlarmThreshold: 5
  },
  setTimers: () => {}
};

const AppContext = createContext<AppContextType>(defaultValues);

export const AppContextProvider: React.FC = ({ children }) => {
  const [crewMembers, setCrewMembers] = useState<string[]>([]);
  const [timers, setTimers] = useState<TimersObjectType>();
  const [storageHasBeenRead, setStorageHasBeenRead] = useState<boolean>(false);

  useEffect(() => {
    async function readStorageData() {
      try {
        setCrewMembers(await readStorage('crew_members'));
        setTimers(await readStorage('timers'));
        setStorageHasBeenRead(true);
      } catch (e) {
        console.log('[DEBUG] Error reading data from AsyncStorage', e);
      }
    }
    readStorageData();
  }, []);

  useEffect(() => {
    if (storageHasBeenRead) {
      writeStorage('crew_members', crewMembers);
      writeStorage('timers', timers);
    }
  }, [crewMembers, timers]);

  return <AppContext.Provider value={{ crewMembers, setCrewMembers, timers, setTimers }}>{children}</AppContext.Provider>;
};

export default AppContext;
