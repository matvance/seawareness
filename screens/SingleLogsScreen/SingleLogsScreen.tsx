import React from 'react';
import { Feather } from '@expo/vector-icons';

import { FloatingButton, ScreenHeading, ScreenTemplate } from '../../components';
import { PermitLogObject } from '../../storage/logs.storage';
import { parseDateToDateWithMonth, parseTimestampToTime } from '../LogsScreen/logs-screen.utils';
import { generatePdf } from '../../utils/pdf';

import { Paragraph } from '../../styles';

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

  const printLogs = () => generatePdf(log);

  return (
    <>
      <ScreenTemplate>
        <ScreenHeading onBackward={navigation.goBack}>{heading}</ScreenHeading>
        {/*<Text>{JSON.stringify(log, null, 4)}</Text>*/}
        <Paragraph marginTop={50}>Vessel name: {log.vesselName}</Paragraph>
        <Paragraph>Location: {log.location}</Paragraph>
        <Paragraph>Person in charge: {log.personInCharge}</Paragraph>
        <Paragraph marginTop={20}>Action logs count: {log.logs.length}</Paragraph>
      </ScreenTemplate>

      <FloatingButton onPress={printLogs}>
        <Feather name={'download'} size={24} />
      </FloatingButton>
    </>
  );
};

export default SingleLogsScreen;
