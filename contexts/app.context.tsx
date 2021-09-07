import React, { createContext, useState, useEffect } from 'react';

import { initialValues, readStorage, setupInitialValues, writeStorage } from '../storage';

export interface TimerObjectType {
  id: number;
  title: string;
  interval: number;
}

export interface MeasurementObjectType {
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

  vesselName: string;
  setVesselName: React.Dispatch<React.SetStateAction<string>>;

  setInitialValues: () => void;
}

const defaultValues: AppContextType = {
  crewMembers: [],
  setCrewMembers: () => {},

  timers: [],
  setTimers: () => {},

  measurements: [],
  setMeasurements: () => {},

  vesselName: '',
  setVesselName: () => {},

  setInitialValues: () => {}
};

const AppContext = createContext<AppContextType>(defaultValues);

export const AppContextProvider: React.FC = ({ children }) => {
  const [crewMembers, setCrewMembers] = useState<string[]>([]);
  const [vesselName, setVesselName] = useState<string>('');
  const [timers, setTimers] = useState<TimerObjectType[]>([]);
  const [measurements, setMeasurements] = useState<MeasurementObjectType[]>([]);
  const [storageHasBeenRead, setStorageHasBeenRead] = useState<boolean>(false);

  const setInitialValues = async () => {
    await setupInitialValues();
    setTimers(initialValues.timers);
    setMeasurements(initialValues.measurements);
  };

  useEffect(() => {
    (async function () {
      await setCrewMembers(await readStorage('crew_members'));
      await setTimers(await readStorage('timers'));
      await setMeasurements(await readStorage('measurements'));
      await setVesselName(await readStorage('vessel_name'));
      await setStorageHasBeenRead(true);
    })();
  }, []);

  useEffect(() => {
    if (!storageHasBeenRead) return;
    (async function () {
      await writeStorage('crew_members', crewMembers);
      await writeStorage('timers', timers);
      await writeStorage('measurements', measurements);
      await writeStorage('vessel_name', vesselName);
    })();
  });

  return (
    <AppContext.Provider
      value={{
        crewMembers,
        setCrewMembers,
        timers,
        setTimers,
        measurements,
        setMeasurements,
        setInitialValues,
        vesselName,
        setVesselName
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
