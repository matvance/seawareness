import React from 'react';
import { Text } from 'react-native';

import { FloatingButton, ScreenHeading, ScreenTemplate } from '../../components';
import { PermitLogObject } from '../../storage/logs.storage';
import { parseDateToDateWithMonth, parseTimestampToTime } from '../LogsScreen/logs-screen.utils';
import { Feather } from '@expo/vector-icons';

interface Props {
  navigation: {
    navigate: (route: string) => void;
    goBack: () => void;
  };
  route: {
    params: {
      log: PermitLogObject;
    };
  };
}

const SingleLogsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { log } = route.params;

  const heading = parseDateToDateWithMonth(new Date(log.startTimestamp)) + ', ' + parseTimestampToTime(log.startTimestamp);

  return (
    <>
      <ScreenTemplate>
        <ScreenHeading onBackward={navigation.goBack}>{heading}</ScreenHeading>
        <Text>{JSON.stringify(log, null, 4)}</Text>
      </ScreenTemplate>

      <FloatingButton>
        <Feather name={'download'} size={24} />
      </FloatingButton>
    </>
  );
};

export default SingleLogsScreen;
