import notifee, { EventDetail, EventType } from '@notifee/react-native';
import Sound from 'react-native-sound';
import { Notification } from '@notifee/react-native';
import Torch from 'react-native-torch';

import { getAlarmNotificationConfig, getPersistentNotificationConfig } from './foreground-service.utils';

interface ForegroundServiceInterfaceConfig {
  onScheduleAlarm: (callback: (alarmType: AlarmType, when: number) => void) => void;
  onStopAlarm: (callback: (alarmType: AlarmType | 'all', keepService: boolean) => void) => void;
  onStopPermit: (callback: () => void) => void;
  scheduledAlarms?: ScheduledAlarms;
}
export type AlarmType = 'measurements' | 'communication';

export type ScheduledAlarms = {
  [key in AlarmType]: {
    nextAlarmTime?: number;
    alarmTimeout?: ReturnType<typeof setTimeout>;
  };
};

class ForegroundServiceInterface {
  channelId?: string;
  torchlightOn = false;
  isAlarmPlaying = false;
  notification?: Notification;

  scheduledAlarms: ScheduledAlarms = { communication: {}, measurements: {} };

  constructor({ onScheduleAlarm, onStopAlarm, scheduledAlarms, onStopPermit }: ForegroundServiceInterfaceConfig) {
    if (scheduledAlarms) this.scheduledAlarms = scheduledAlarms;
    this.stopForegroundService().then(() => {
      notifee.registerForegroundService((notification) => {
        return new Promise(() => {
          this.notification = notification;
          const alarmSound = this.getAlarmSound();
          let torchlightBlinkingInterface: { torchlightBlinkingInterval: ReturnType<typeof setInterval> | null } = {
            torchlightBlinkingInterval: null
          };

          onStopPermit(async () => {
            await notifee.displayNotification(
              getPersistentNotificationConfig(this.channelId || 'default', this.notification, true)
            );
            await notifee.stopForegroundService();
          });

          onScheduleAlarm((alarmType: AlarmType, when: number) => {
            if (!this.isAlarmPlaying) {
              const now = new Date().getTime();
              this.scheduledAlarms[alarmType].nextAlarmTime = when;
              if (this.scheduledAlarms[alarmType].alarmTimeout) {
                clearTimeout(this.scheduledAlarms[alarmType].alarmTimeout as NodeJS.Timeout);
              }
              this.scheduledAlarms[alarmType].alarmTimeout = setTimeout(() => {
                this.startAlarm(alarmType, alarmSound);
              }, when - now);
            }
          });
          onStopAlarm(async (alarmType: AlarmType | 'all', keepService: boolean) => await this.stopAlarm(alarmType, keepService));

          notifee.onForegroundEvent(this.handleEvent(alarmSound, torchlightBlinkingInterface));
          notifee.onBackgroundEvent(this.handleEvent(alarmSound, torchlightBlinkingInterface));
        });
      });
      this.showPersistentNotification();
    });
  }

  async startAlarm(alarmType: AlarmType, alarmSound: Sound) {
    if (!alarmSound) return console.error('There is no alarmSound provided');
    if (!this.notification || this.isAlarmPlaying) return;
    delete this.scheduledAlarms[alarmType].alarmTimeout;

    // this.startTorchBlinking();
    alarmSound.play();
    this.isAlarmPlaying = true;

    await notifee.displayNotification(getAlarmNotificationConfig(this.notification));
  }

  async stopAlarm(alarmType: AlarmType | 'all', keepNotification = true) {
    if (!this.notification || !this.channelId) return;

    if (alarmType === 'all') {
      delete this.scheduledAlarms['communication'].nextAlarmTime;
      delete this.scheduledAlarms['measurements'].nextAlarmTime;
    } else {
      delete this.scheduledAlarms[alarmType].nextAlarmTime;
    }

    if (keepNotification) notifee.displayNotification(getPersistentNotificationConfig(this.channelId, this.notification, true));
  }

  startTorchBlinking() {
    return setInterval(() => {
      Torch.switchState(!this.torchlightOn);
      this.torchlightOn = !this.torchlightOn;
    }, 300);
  }

  stopTorchBlinking(torchlightBlinkingInterval: ReturnType<typeof setInterval> | null) {
    if (torchlightBlinkingInterval) {
      clearInterval(torchlightBlinkingInterval);
      torchlightBlinkingInterval = null;
      Torch.switchState(false);
    }
  }

  async stopForegroundService() {
    await notifee.stopForegroundService();
    if (this.scheduledAlarms['communication'].alarmTimeout) clearTimeout(this.scheduledAlarms['communication'].alarmTimeout);
    if (this.scheduledAlarms['measurements'].alarmTimeout) clearTimeout(this.scheduledAlarms['measurements'].alarmTimeout);
  }

  async showPersistentNotification() {
    // Create channel for Notifications
    this.channelId = await notifee.createChannel({
      id: 'default',
      name: 'Alarms and persist notification'
    });

    await notifee.displayNotification(getPersistentNotificationConfig(this.channelId, this.notification));
  }

  // Handle notification arrive and click events
  handleEvent(
    alarmSound?: Sound,
    torchlightBlinkingInterface?: { torchlightBlinkingInterval: ReturnType<typeof setInterval> | null }
  ) {
    return async ({ type, detail }: { type: EventType; detail: EventDetail }) => {
      // Start alarm notification
      if (type === EventType.DELIVERED && detail.notification?.data?.type === 'alarm') {
        if (torchlightBlinkingInterface) {
          torchlightBlinkingInterface.torchlightBlinkingInterval = this.startTorchBlinking();
        }
      }

      // Stop alarm notification
      if (alarmSound && type === EventType.DELIVERED && detail.notification?.data?.stopAlarm === 'true') {
        alarmSound.stop();
        if (torchlightBlinkingInterface?.torchlightBlinkingInterval) {
          this.stopTorchBlinking(torchlightBlinkingInterface.torchlightBlinkingInterval);
          torchlightBlinkingInterface.torchlightBlinkingInterval = null;
          this.isAlarmPlaying = false;
        }
      }
    };

    // Conditions
    // const isAlarmNotificationDelivery =
    //   detail.notification?.data?.type === 'alarm' && alarmSound && type === EventType.DELIVERED;
    // const isAlarmNotificationPress = detail.notification?.data?.type === 'alarm' && alarmSound && type === EventType.PRESS;
    // const isNotificationPress = type === EventType.PRESS;
    // // End Conditions
    //
    // if (isAlarmNotificationDelivery && alarmSound) {
    //   this.setVolume(0.5);
    //   alarmSound.play();
    // }
    //
    // if (isAlarmNotificationPress) {
    //   this.setVolume(0.1);
    // }
  }

  getAlarmSound(): Sound {
    Sound.setCategory('Alarm');
    const sound = new Sound('alarm.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        return console.log('failed to load the sound', error);
      }

      sound.setNumberOfLoops(-1);
      sound.setVolume(0.1);
    });
    return sound;
  }
}

export default ForegroundServiceInterface;
