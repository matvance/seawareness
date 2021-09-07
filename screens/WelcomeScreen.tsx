import React, { useContext, useEffect } from 'react';

import { AppContext } from '../contexts';
import { Button, ScreenTemplate, ScreenHeading } from '../components';

import { ScreenHeadingSubtitle, FixedToBottom } from '../styles';

interface Props {
  navigation: {
    navigate: (route: string) => void;
  };
}

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const { setInitialValues } = useContext(AppContext);

  useEffect(() => {
    setInitialValues();
  }, []);

  const goForward = () => navigation.navigate('InitialSettings');

  return (
    <>
      <ScreenTemplate extraPaddingBottom={120}>
        <ScreenHeading>Welcome</ScreenHeading>
        <ScreenHeadingSubtitle>
          Before you start using the application, the initial set-up needs to be completed
        </ScreenHeadingSubtitle>
      </ScreenTemplate>
      <FixedToBottom>
        <Button title={'Next'} onPress={goForward} />
      </FixedToBottom>
    </>
  );
};

export default WelcomeScreen;
