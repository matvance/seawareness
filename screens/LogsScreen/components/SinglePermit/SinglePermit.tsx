import React from 'react';

import { parseDateToDateWithMonth, parseTimestampToTime } from '../../logs-screen.utils';

import { LogItem } from '../../LogsScreen.styles';
import { Paragraph } from '../../../../styles';
import { PermitLogObject } from '../../../../storage/logs.storage';
import { TouchableNativeFeedback } from 'react-native';

interface Props {
  log: PermitLogObject;
  showDate?: boolean;
}

const SinglePermit: React.FC<Props> = ({ log, showDate }) => {
  const { id, startTimestamp } = log;

  return (
    <TouchableNativeFeedback>
      <LogItem key={id}>
        <Paragraph>
          {parseTimestampToTime(startTimestamp)} {showDate && ', ' + parseDateToDateWithMonth(new Date(startTimestamp))}
        </Paragraph>
      </LogItem>
    </TouchableNativeFeedback>
  );
};

export default SinglePermit;
