import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import { getNavigatorScreenOptions } from './App.config';
import { HomeScreen, LogsScreen, CrewScreen, SettingsScreen, WelcomeScreen } from './screens';
import { AppContextProvider } from './contexts';
import { readStorage } from './storage';

const Tab = createBottomTabNavigator();

function MainTabs({ navigation }) {
  useEffect(() => {
    readStorage('is_app_initialized')
      .then((resp) => !resp && navigation.push('Welcome'))
      .catch((e) => console.log(e));
  }, []);
  return (
    <Tab.Navigator screenOptions={getNavigatorScreenOptions}>
      <Tab.Screen name={'Permit'} component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name={'Logs'} component={LogsScreen} options={{ headerShown: false }} />
      <Tab.Screen name={'Crew'} component={CrewScreen} options={{ headerShown: false }} />
      <Tab.Screen name={'Settings'} component={SettingsScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

const Stack = createStackNavigator();

function App() {
  return (
    <AppContextProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name={'Main'} component={MainTabs} options={{ headerShown: false }} />
          <Stack.Screen name={'Welcome'} component={WelcomeScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppContextProvider>
  );
}

export default App;
