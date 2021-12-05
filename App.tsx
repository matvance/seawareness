import React, { useEffect, useContext } from 'react';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';
import 'intl';
import 'intl/locale-data/jsonp/en';

import { getNavigatorScreenOptions } from './App.config';
import {
  HomeScreen,
  LogsScreen,
  CrewScreen,
  SettingsScreen,
  WelcomeScreen,
  InitialSettingsScreen,
  SetupCrewScreen,
  SetupPermitCrewScreen,
  SetupPermitMeasurements,
  PermitScreen
} from './screens';
import { AppContextProvider, PermitContext, PermitContextProvider } from './contexts';
import { readStorage } from './storage';
import SingleLogsScreen from './screens/SingleLogsScreen/SingleLogsScreen';

const Tab = createBottomTabNavigator();
const PermitNavigator = createStackNavigator();

const PermitStack: React.FC = () => {
  return (
    <PermitNavigator.Navigator>
      <PermitNavigator.Screen name={'SetupPermit'} component={HomeScreen} options={{ headerShown: false }} />
      <PermitNavigator.Screen name={'SetupPermitCrew'} component={SetupPermitCrewScreen} options={{ headerShown: false }} />
      <PermitNavigator.Screen
        name={'SetupPermitMeasurements'}
        component={SetupPermitMeasurements}
        options={{ headerShown: false }}
      />
      <PermitNavigator.Screen name={'PermitScreen'} component={PermitScreen} options={{ headerShown: false }} />
    </PermitNavigator.Navigator>
  );
};

const LogsNavigator = createStackNavigator();

const LogsStack = () => {
  return (
    <LogsNavigator.Navigator>
      <LogsNavigator.Screen name={'LogsOverview'} component={LogsScreen} options={{ headerShown: false }} />
      <LogsNavigator.Screen name={'LogsEntry'} component={SingleLogsScreen} options={{ headerShown: false }} />
    </LogsNavigator.Navigator>
  );
};

interface Props {
  navigation: {
    navigate: (route: string) => void;
    push: (route: string) => void;
  };
}

const MainTabs: React.FC<Props> = ({ navigation }) => {
  const { initTime, reinitPermitFromStorage } = useContext(PermitContext);

  useEffect(() => {
    (async function () {
      const isInitialized = await readStorage('is_app_initialized');
      const activePermit = await readStorage('active_permit');

      if (!isInitialized) navigation.push('Welcome');

      if (!initTime && !!activePermit) {
        await reinitPermitFromStorage(activePermit);
        navigation.navigate('PermitScreen');
      }
    })();
  }, []);

  return (
    <Tab.Navigator screenOptions={getNavigatorScreenOptions}>
      <Tab.Screen
        name={'Permit'}
        component={PermitStack}
        options={{ headerShown: false, tabBarBadge: initTime ? '' : undefined }}
      />
      <Tab.Screen name={'Logs'} component={LogsStack} options={{ headerShown: false }} />
      <Tab.Screen name={'Crew'} component={CrewScreen} options={{ headerShown: false }} />
      <Tab.Screen name={'Settings'} component={SettingsScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

const Stack = createStackNavigator();

function App() {
  return (
    <AppContextProvider>
      <StatusBar barStyle={'dark-content'} />
      <PermitContextProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name={'Main'} component={MainTabs} options={{ headerShown: false }} />
            <Stack.Screen name={'Welcome'} component={WelcomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'InitialSettings'} component={InitialSettingsScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'SetupCrew'} component={SetupCrewScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </PermitContextProvider>
    </AppContextProvider>
  );
}

export default App;
