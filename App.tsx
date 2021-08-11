import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { getNavigatorScreenOptions } from './App.config';
import { HomeScreen, LogsScreen, CrewScreen, SettingsScreen, WelcomeScreen } from './screens';

const { Navigator, Screen } = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <Navigator initialRouteName='Welcome' screenOptions={getNavigatorScreenOptions}>
        <Screen name={'Welcome'} component={WelcomeScreen} options={{ headerShown: false }} />
        <Screen name={'Logs'} component={LogsScreen} options={{ headerShown: false }} />
        <Screen name={'Crew'} component={CrewScreen} options={{ headerShown: false }} />
        <Screen name={'Settings'} component={SettingsScreen} options={{ headerShown: false }} />
      </Navigator>
    </NavigationContainer>
  );
}

export default App;
