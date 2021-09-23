import React from 'react';

import { ScreenTemplate, ScreenHeading } from '../../components';

interface Props {
  navigation: {
    navigate: (route: string, params?: any) => void;
  };
}

const PermitScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <ScreenTemplate>
      <ScreenHeading>You are working</ScreenHeading>
    </ScreenTemplate>
  );
};

export default PermitScreen;
