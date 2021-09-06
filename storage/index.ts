import AsyncStorage from '@react-native-async-storage/async-storage';

type StorageKey = 'crew_members' | 'is_app_initialized' | 'timers' | 'measurements';

export const readStorage = async (key: StorageKey) => {
  try {
    const data = (await AsyncStorage.getItem(key)) || '';
    return JSON.parse(data);
  } catch (e) {
    console.log('[DEBUG] Error reading data from AsyncStorage', e);
  }
};

export const writeStorage = async (key: StorageKey, data: any) => {
  const stringified = JSON.stringify(data);
  try {
    await AsyncStorage.setItem(key, stringified);
  } catch (e) {
    console.log('[DEBUG] Error writing data to AsyncStorage', e);
  }
};

export const __clearStorage = async () => {
  try {
    await AsyncStorage.setItem('crew_members', '[]');
    await AsyncStorage.setItem('is_app_initialized', 'false');
  } catch (e) {
    console.warn(e);
  }
};
