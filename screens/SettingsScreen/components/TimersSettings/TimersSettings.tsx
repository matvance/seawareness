import React, { useContext } from 'react';
import { Text, View } from 'react-native';

import { AppContext } from '../../../../contexts';

import { Input } from '../../../../styles';

const TimersSettings: React.FC = () => {
  const { timers, setTimers } = useContext(AppContext);

  const handleTimerChange = (timerName: string) => (value: React.ReactText) => {
    let newTimers = timers;
    newTimers[timerName] = parseInt(value as string) || 0;
    setTimers(newTimers);
  };

  return (
    <>
      <View style={{ marginTop: 20, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ flexGrow: 1, fontSize: 18 }}>Communication timer</Text>
        <Input
          keyboardType={'numeric'}
          style={{ flexBasis: 80 }}
          placeholder={'mins'}
          defaultValue={timers.communication.toString()}
          onChangeText={handleTimerChange('communication')}
        />
      </View>
      <View style={{ marginTop: 10, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ flexGrow: 1, fontSize: 18 }}>Measurement timer</Text>
        <Input
          keyboardType={'numeric'}
          style={{ flexBasis: 80 }}
          placeholder={'mins'}
          defaultValue={timers.measurement.toString()}
          onChangeText={handleTimerChange('measurement')}
        />
      </View>
      <View style={{ marginTop: 10, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ flexGrow: 1, fontSize: 18 }}>Soft alarm threshold</Text>
        <Input
          keyboardType={'numeric'}
          style={{ flexBasis: 80 }}
          placeholder={'mins'}
          defaultValue={timers.softAlarmThreshold.toString()}
          onChangeText={handleTimerChange('softAlarmThreshold')}
        />
      </View>
    </>
  );
};

export default TimersSettings;
