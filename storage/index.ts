import AsyncStorage from '@react-native-async-storage/async-storage';

import { MeasurementObjectType, TimerObjectType } from '../contexts/app.context';

type StorageKey = 'crew_members' | 'is_app_initialized' | 'timers' | 'measurements' | 'vessel_name';

export const readStorage = async (key: StorageKey) => {
  try {
    const data = (await AsyncStorage.getItem(key)) || '';
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.log('[DEBUG] Error reading data from AsyncStorage', e);
  }
};

export const writeStorage = async (key: StorageKey, data: any) => {
  const stringified = JSON.stringify(data);
  try {
    if (data) {
      await AsyncStorage.setItem(key, stringified);
    } else {
      await AsyncStorage.removeItem(key);
    }
  } catch (e) {
    console.log('[DEBUG] Error writing data to AsyncStorage', e);
  }
};

interface InitialValues {
  vessel_name: string;
  crew_members: string[];
  timers: TimerObjectType[];
  measurements: MeasurementObjectType[];

  [key: string]: any;
}

export const initialValues: InitialValues = {
  vessel_name: '',
  crew_members: [],
  timers: [
    {
      id: 1,
      title: 'Communication timer',
      interval: 15
    },
    {
      id: 2,
      title: 'Measurements timer',
      interval: 25
    },
    {
      id: 3,
      title: 'Soft alarm threshold',
      interval: 3
    }
  ],
  measurements: [
    {
      id: 1,
      title: 'O2 (%)',
      minValue: 20.8,
      maxValue: null
    },
    {
      id: 2,
      title: 'CO (ppm)',
      minValue: null,
      maxValue: 10
    },
    {
      id: 3,
      title: 'CO2 (ppm)',
      minValue: null,
      maxValue: 2500
    },
    {
      id: 4,
      title: 'CH4 (ppm)',
      minValue: null,
      maxValue: 1
    },
    {
      id: 5,
      title: 'H2SO4 (ppm)',
      minValue: null,
      maxValue: 2
    }
  ]
};

export const setupInitialValues = async () => {
  try {
    await Object.keys(initialValues).map(async (key) => {
      const value = initialValues[key];
      !!value && (await AsyncStorage.setItem(key, JSON.stringify(value)));
    });
  } catch (e) {
    console.warn(e);
  }
};

export const __clearStorage = async () => {
  try {
    await AsyncStorage.setItem('vessel_name', '');
    await AsyncStorage.setItem('crew_members', '[]');
    await AsyncStorage.setItem('timers', '[]');
    await AsyncStorage.setItem('measurements', '[]');
    await AsyncStorage.setItem('is_app_initialized', 'false');
  } catch (e) {
    console.warn(e);
  }
};
