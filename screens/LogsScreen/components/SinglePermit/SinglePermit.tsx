import React from 'react';

import { parseDateToDateWithMonth, parseTimestampToTime } from '../../logs-screen.utils';

import { LogItem } from '../../LogsScreen.styles';
import { Paragraph } from '../../../../styles';
import { PermitLogObject } from '../../../../storage/logs.storage';
import { TouchableNativeFeedback } from 'react-native';

interface Props {
  log: PermitLogObject;
  showDate?: boolean;
  onPress?: () => void;
}

const SinglePermit: React.FC<Props> = ({ log, showDate, onPress }) => {
  const { id, startTimestamp } = log;

  return (
    <TouchableNativeFeedback onPress={onPress}>
      <LogItem key={id}>
        <Paragraph>
          {showDate && parseDateToDateWithMonth(new Date(startTimestamp)) + ', '}
          {parseTimestampToTime(startTimestamp)}
        </Paragraph>
      </LogItem>
    </TouchableNativeFeedback>
  );
};

export default SinglePermit;
