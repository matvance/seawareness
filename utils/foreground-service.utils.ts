import { AndroidCategory, AndroidColor, AndroidImportance, Notification } from '@notifee/react-native';

export const getAlarmNotificationConfig = (notification: Notification) => ({
  ...notification,
  id: notification?.id,
  title: 'Measurements alarm',
  body: 'You must do the measurements.',
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

export const getPersistentNotificationConfig = (channelId: string, notification?: Notification) =>
  notification
    ? {
        ...notification,
        id: notification?.id,
        title: 'Permit is open',
        body: 'You have currently open permit.',
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
