import React from 'react';

import { ScreenHeading, ScreenHeadingSubtitle, ScreenWrapper } from '../styles';

import { Button } from '../components';
import { __clearStorage, readStorage } from '../storage';

export default function SettingsScreen() {
  const clearStorage = () => {
    __clearStorage().then((resp) => console.log('[DEBUG] storage cleared!'));
  };

  const readIsInitialized = () => {
    readStorage('is_app_initialized').then((resp) => console.log('is_app_initialized', resp));
  };

  return (
    <ScreenWrapper>
      <ScreenHeading>Settings</ScreenHeading>
      <ScreenHeadingSubtitle>
        <Button title={'CLEAR THE STORAGE'} onPress={clearStorage} />
        <Button title={'READ IS APP INITIALIZED'} onPress={readIsInitialized} />
      </ScreenHeadingSubtitle>
    </ScreenWrapper>
  );
}
