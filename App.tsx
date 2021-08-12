import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import { getNavigatorScreenOptions } from './App.config';
import { HomeScreen, LogsScreen, CrewScreen, SettingsScreen, WelcomeScreen } from './screens';

const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator initialRouteName='Home' screenOptions={getNavigatorScreenOptions}>
      <Tab.Screen name={'Home'} component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name={'Logs'} component={LogsScreen} options={{ headerShown: false }} />
      <Tab.Screen name={'Crew'} component={CrewScreen} options={{ headerShown: false }} />
      <Tab.Screen name={'Settings'} component={SettingsScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Welcome'>
        <Stack.Screen name={'Welcome'} component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name={'Main'} component={MainTabs} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
