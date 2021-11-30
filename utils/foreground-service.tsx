import notifee, { EventDetail, EventType } from '@notifee/react-native';
import Sound from 'react-native-sound';
import { Notification } from '@notifee/react-native';
import Torch from 'react-native-torch';

import { getAlarmNotificationConfig, getPersistentNotificationConfig } from './foreground-service.utils';

interface ForegroundServiceInterfaceConfig {
  onResumeApplication: () => void;
}

class ForegroundServiceInterface {
  alarmSound?: Sound;
  channelId?: string;
  torchlightBlinkingInterval?: ReturnType<typeof setInterval>;
  torchlightOn = false;
  notification?: Notification;

  //Callbacks
  onResumeApplication?: () => void;

  constructor({ onResumeApplication }: ForegroundServiceInterfaceConfig) {
    this.onResumeApplication = onResumeApplication;

    notifee.registerForegroundService((notification) => {
      return new Promise(() => {
        this.initializeAlarmSound();
        this.notification = notification;

        notifee.onForegroundEvent(this.handleEvent);
        notifee.onBackgroundEvent(this.handleEvent);

        setTimeout(async () => {
          await this.startAlarm();
        }, 5000);

        setTimeout(async () => {
          await this.stopAlarm();
        }, 9000);
      });
    });
    this.showPersistentNotification();
  }

  async startAlarm() {
    if (!this.alarmSound || !this.notification) return;

    this.startTorchBlinking();
    this.alarmSound.play();

    await notifee.displayNotification(getAlarmNotificationConfig(this.notification));
  }

  async stopAlarm(keepNotification = true) {
    if (!this.notification || !this.channelId) return;

    if (keepNotification) notifee.displayNotification(getPersistentNotificationConfig(this.channelId, this.notification));

    if (!this.alarmSound) return;

    await this.alarmSound.stop();
    await this.alarmSound.release();
    this.stopTorchBlinking();
  }

  startTorchBlinking() {
    this.torchlightBlinkingInterval = setInterval(() => {
      Torch.switchState(!this.torchlightOn);
      this.torchlightOn = !this.torchlightOn;
    }, 300);
  }

  stopTorchBlinking() {
    if (this.torchlightBlinkingInterval) {
      clearInterval(this.torchlightBlinkingInterval);
      delete this.torchlightBlinkingInterval;
      Torch.switchState(false);
    }
  }

  async stopForegroundService() {
    await notifee.stopForegroundService();
    await this.stopAlarm(false);
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
  async handleEvent({ type, detail }: { type: EventType; detail: EventDetail }) {
    // Conditions
    const isAlarmNotificationDelivery =
      detail.notification?.data?.type === 'alarm' && this.alarmSound && type === EventType.DELIVERED;
    const isAlarmNotificationPress = detail.notification?.data?.type === 'alarm' && this.alarmSound && type === EventType.PRESS;
    // End Conditions
    const isNotificationPress = type === EventType.PRESS;

    if (isNotificationPress && this.onResumeApplication) {
      this.onResumeApplication();
      console.log(this.onResumeApplication);
    }

    if (isAlarmNotificationDelivery && this.alarmSound) {
      this.setVolume(0.5);
      this.alarmSound.play();
    }

    if (isAlarmNotificationPress) {
      await this.stopAlarm();
    }
  }

  setVolume(volume: number) {
    if (volume > 1 || volume < 0) {
      return console.error('Volume has to be lower than 1 and greater than 0.');
    }
    if (this.alarmSound) {
      this.alarmSound.setVolume(volume);
    } else {
      console.error('this.alarmSound NOT set');
    }
  }

  initializeAlarmSound() {
    Sound.setCategory('Alarm');
    this.alarmSound = new Sound('alarm.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        return console.log('failed to load the sound', error);
      }

      if (this.alarmSound) {
        this.alarmSound.setNumberOfLoops(-1);
        this.setVolume(0.1);
      }
    });
  }
}

export default ForegroundServiceInterface;
