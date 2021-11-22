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
  readonly logId: number;

  setCrew: React.Dispatch<React.SetStateAction<SelectedCrewMember[]>>;
  setStandbyPerson: React.Dispatch<React.SetStateAction<string>>;

  addMemberToCrew: (newMember: string) => void;
  initPermit: (selectedCrew: string[], personInCharge: string, standbyPerson: string, logId: number) => void;
  stopPermit: () => Promise<void>;
}

const noAccessAlert = () => console.log('PermitContext unreachable at this point');

const defaultValues: ContextValues = {
  initTime: new Date(),
  crew: [],
  standbyPerson: '',
  logId: 0,

  setCrew: noAccessAlert,
  setStandbyPerson: noAccessAlert,

  addMemberToCrew: noAccessAlert,
  initPermit: noAccessAlert,
  stopPermit: async () => noAccessAlert()
};

const PermitContext = createContext<ContextValues>(defaultValues);

export const PermitContextProvider: React.FC = ({ children }) => {
  const [initTime, setInitTime] = useState<Date | null>(null);
  const [crew, setCrew] = useState<SelectedCrewMember[]>([]);
  const [standbyPerson, setStandbyPerson] = useState<string>('');
  const [logId, setLogId] = useState<number>(0);

  const initPermit = async (selectedCrew: string[], personInCharge: string, standbyPerson: string, logId: number) => {
    setInitTime(new Date());
    const timers = await readStorage('timers');

    setLogId(logId);

    setCrew(
      selectedCrew.concat(personInCharge, standbyPerson).map((name) => ({
        name,
        isInside: false,
        lastAction: new Date()
      }))
    );

    setStandbyPerson(standbyPerson);
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

  const stopPermit = async () => {
    /** TODO: Write logs on end permit */
    await setInitTime(null);
  };

  return (
    <PermitContext.Provider
      value={{ initTime, initPermit, crew, setCrew, stopPermit, standbyPerson, setStandbyPerson, logId, addMemberToCrew }}
    >
      {children}
    </PermitContext.Provider>
  );
};

export default PermitContext;
