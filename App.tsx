import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

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
import { AppContextProvider } from './contexts';
import { readStorage } from './storage';

const Tab = createBottomTabNavigator();
const PermitNavigator = createStackNavigator();

const PermitStack: React.FC = ({}) => {
  return (
    <PermitNavigator.Navigator>
      <PermitNavigator.Screen name={'Permit'} component={PermitScreen} options={{ headerShown: false }} />
      <PermitNavigator.Screen name={'SetupPermit'} component={HomeScreen} options={{ headerShown: false }} />
      <PermitNavigator.Screen name={'SetupPermitCrew'} component={SetupPermitCrewScreen} options={{ headerShown: false }} />
      <PermitNavigator.Screen
        name={'SetupPermitMeasurements'}
        component={SetupPermitMeasurements}
        options={{ headerShown: false }}
      />
    </PermitNavigator.Navigator>
  );
};

interface Props {
  navigation: {
    navigate: (route: string) => void;
    push: (route: string) => void;
  };
}

const MainTabs: React.FC<Props> = ({ navigation }) => {
  useEffect(() => {
    (async function () {
      const isInitialized = await readStorage('is_app_initialized');
      if (!isInitialized) navigation.push('Welcome');
    })();
  }, []);

  return (
    <Tab.Navigator screenOptions={getNavigatorScreenOptions}>
      <Tab.Screen name={'Permit'} component={PermitStack} options={{ headerShown: false }} />
      <Tab.Screen name={'Logs'} component={LogsScreen} options={{ headerShown: false }} />
      <Tab.Screen name={'Crew'} component={CrewScreen} options={{ headerShown: false }} />
      <Tab.Screen name={'Settings'} component={SettingsScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

const Stack = createStackNavigator();

function App() {
  return (
    <AppContextProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name={'Main'} component={MainTabs} options={{ headerShown: false }} />
          <Stack.Screen name={'Welcome'} component={WelcomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name={'InitialSettings'} component={InitialSettingsScreen} options={{ headerShown: false }} />
          <Stack.Screen name={'SetupCrew'} component={SetupCrewScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppContextProvider>
  );
}

export default App;
