import { AndroidCategory, AndroidColor, AndroidImportance, Notification } from '@notifee/react-native';

export const getAlarmNotificationConfig = (notification: Notification) => ({
  ...notification,
  id: notification?.id,
  title: 'Application needs your attention',
  body: 'You have to take action inside the application!',
  data: { type: 'alarm' },
  android: {
    ...notification?.android,
    category: AndroidCategory.CALL,
    fullScreenAction: {
      launchActivity: 'default',
      id: 'default'
    },
    color: AndroidColor.RED,
    colorized: true
  }
});

export const getPersistentNotificationConfig = (channelId: string, notification?: Notification, stopAlarm = false) =>
  notification
    ? {
        ...notification,
        id: notification?.id,
        title: 'Permit is open',
        body: 'Click to open the application.',
        data: { stopAlarm: stopAlarm.toString() },
        android: {
          ...notification?.android,
          category: AndroidCategory.SERVICE,
          importance: AndroidImportance.HIGH,
          pressAction: {
            launchActivity: 'default',
            id: 'default'
          },
          channelId,
          asForegroundService: true
        }
      }
    : {
        title: 'Permit is open',
        body: 'You have currently open permit.',
        android: {
          category: AndroidCategory.SERVICE,
          importance: AndroidImportance.HIGH,
          pressAction: {
            launchActivity: 'default',
            id: 'default'
          },
          channelId,
          asForegroundService: true
        }
      };
