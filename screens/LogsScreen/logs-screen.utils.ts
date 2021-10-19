export const parseTimestampToTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
};

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

export const parseDateToDateWithMonth = (date: Date): string => {
  const day = date.getDate();
  const monthIndex = date.getMonth();

  return `${day} ${monthNames[monthIndex]}`;
};
