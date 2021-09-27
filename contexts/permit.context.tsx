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
  readonly standbyPerson: string;

  setCrew: React.Dispatch<React.SetStateAction<SelectedCrewMember[]>>;
  setStandbyPerson: React.Dispatch<React.SetStateAction<string>>;

  initPermit: (selectedCrew: string[], personInCharge: string, standbyPerson: string) => void;
  stopPermit: () => Promise<void>;
}

const noAccessAlert = () => console.log('PermitContext unreachable at this point');

const defaultValues: ContextValues = {
  initTime: new Date(),
  crew: [],
  standbyPerson: '',

  setCrew: noAccessAlert,
  setStandbyPerson: noAccessAlert,

  initPermit: noAccessAlert,
  stopPermit: async () => noAccessAlert()
};

const PermitContext = createContext<ContextValues>(defaultValues);

export const PermitContextProvider: React.FC = ({ children }) => {
  const [initTime, setInitTime] = useState<Date | null>(null);
  const [crew, setCrew] = useState<SelectedCrewMember[]>([]);
  const [standbyPerson, setStandbyPerson] = useState<string>('');

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

    setStandbyPerson(standbyPerson);
  };

  const stopPermit = async () => {
    /** TODO: Write logs on end permit */
    await setInitTime(null);
  };

  return (
    <PermitContext.Provider value={{ initTime, initPermit, crew, setCrew, stopPermit, standbyPerson, setStandbyPerson }}>
      {children}
    </PermitContext.Provider>
  );
};

export default PermitContext;
