import React, { createContext, useState, useEffect } from 'react';

import { readStorage, writeStorage } from '../storage';

interface AppContextType {
  crewMembers: string[];
  setCrewMembers: (crewMembers: string[]) => void;
}

const defaultValues: AppContextType = {
  crewMembers: [],
  setCrewMembers: () => {}
};

const AppContext = createContext<AppContextType>(defaultValues);

export const AppContextProvider: React.FC = ({ children }) => {
  const [crewMembers, setCrewMembers] = useState<string[]>([]);
  const [storageHasBeenRead, setStorageHasBeenRead] = useState<boolean>(false);

  useEffect(() => {
    readStorage('crew_members').then((members) => {
      setCrewMembers(members);
      setStorageHasBeenRead(true);
    });
  }, []);

  useEffect(() => {
    if (storageHasBeenRead) {
      writeStorage('crew_members', crewMembers);
    }
  }, [crewMembers]);

  return <AppContext.Provider value={{ crewMembers, setCrewMembers }}>{children}</AppContext.Provider>;
};

export default AppContext;
