import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const getTimezones = () => {
  const timezones = [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Hong_Kong',
    'Asia/Dubai',
    'Asia/Kolkata',
    'Australia/Sydney',
    'Pacific/Auckland',
  ];
  return timezones;
};

export const formatDateInTimezone = (date: string | Date, tz: string) => {
  return dayjs(date).tz(tz).format('MMM DD, YYYY');
};

export const formatTimeInTimezone = (date: string | Date, tz: string) => {
  return dayjs(date).tz(tz).format('HH:mm');
};

export const formatDateTimeInTimezone = (date: string | Date, tz: string) => {
  return dayjs(date).tz(tz).format('MMM DD, YYYY HH:mm');
};

export const convertToUTC = (date: Date, tz: string) => {
  return dayjs(date).tz(tz).utc().toDate();
};

export const convertFromUTC = (date: Date, tz: string) => {
  return dayjs(date).utc().tz(tz);
};
