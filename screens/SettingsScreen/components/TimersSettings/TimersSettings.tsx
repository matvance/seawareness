import React, { useContext } from 'react';
import { Text, View } from 'react-native';

import { AppContext } from '../../../../contexts';

import { Input } from '../../../../styles';

const TimersSettings: React.FC = () => {
  const { timers, setTimers } = useContext(AppContext);

  const handleTimerChange = (timerName: string) => (value: React.ReactText) => {
    console.log(timerName, value);
  };

  return (
    <>
      <View style={{ marginTop: 20, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ flexGrow: 1, fontSize: 18 }}>Communication timer</Text>
        <Input
          keyboardType={'numeric'}
          style={{ flexBasis: 80 }}
          placeholder={'mins'}
          defaultValue={timers.communication + ''}
          // onChangeText={handleTimerChange('communication')}
        />
      </View>
      <View style={{ marginTop: 10, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ flexGrow: 1, fontSize: 18 }}>Measurement timer</Text>
        <Input keyboardType={'numeric'} style={{ flexBasis: 80 }} placeholder={'mins'} defaultValue={timers.measurement + ''} />
      </View>
      <View style={{ marginTop: 10, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ flexGrow: 1, fontSize: 18 }}>Soft alarm threshold</Text>
        <Input
          keyboardType={'numeric'}
          style={{ flexBasis: 80 }}
          placeholder={'mins'}
          defaultValue={timers.softAlarmThreshold + ''}
        />
      </View>
    </>
  );
};

export default TimersSettings;
