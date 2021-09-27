import { DateTime } from 'luxon';

export const parseTimeDifference = (date?: Date): string => {
  if (!date) return '';

  const parsedInitTime = DateTime.fromJSDate(date);
  const timeDifference = parsedInitTime?.diffNow(['hours', 'minutes', 'seconds']).toObject();

  const parseNumber = (x?: number) => {
    if (!x) return 0;
    return Math.floor(Math.abs(x));
  };

  const hour = parseNumber(timeDifference.hours);
  const minute = parseNumber(timeDifference.minutes);
  const second = parseNumber(timeDifference.seconds);

  let time;
  if (hour) {
    time = DateTime.fromObject({ hour, minute, second }).toFormat('HH:mm:ss');
  } else {
    time = DateTime.fromObject({ hour, minute, second }).toFormat('mm:ss');
  }

  return time;
};
