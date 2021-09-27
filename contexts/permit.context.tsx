import React, { createContext, useState } from 'react';

import { readStorage } from '../storage';

export interface SelectedCrewMember {
  name: string;
  isInside: boolean;
  lastAction: Date;
}

interface ContextValues {
  readonly initTime: Date | null;
  readonly crew: SelectedCrewMember[];

  setCrew: React.Dispatch<React.SetStateAction<SelectedCrewMember[]>>;

  initPermit: (selectedCrew: string[], personInCharge: string, standbyPerson: string) => void;
  stopPermit: () => Promise<void>;
}

const defaultValues: ContextValues = {
  initTime: new Date(),
  crew: [],

  setCrew: () => console.log('PermitContext unreachable at this point'),

  initPermit: () => console.log('PermitContext unreachable at this point'),
  stopPermit: async () => console.log('PermitContext unreachable at this point')
};

const PermitContext = createContext<ContextValues>(defaultValues);

export const PermitContextProvider: React.FC = ({ children }) => {
  const [initTime, setInitTime] = useState<Date | null>(null);
  const [crew, setCrew] = useState<SelectedCrewMember[]>([]);

  const initPermit = async (selectedCrew: string[], personInCharge: string, standbyPerson: string) => {
    setInitTime(new Date());
    const timers = await readStorage('timers');

    setCrew(
      selectedCrew.concat(personInCharge, standbyPerson).map((name) => ({
        name,
        isInside: false,
        lastAction: new Date()
      }))
    );
  };

  const stopPermit = async () => {
    /** TODO: Write logs on end permit */
    await setInitTime(null);
  };

  return <PermitContext.Provider value={{ initTime, initPermit, crew, setCrew, stopPermit }}>{children}</PermitContext.Provider>;
};

export default PermitContext;
