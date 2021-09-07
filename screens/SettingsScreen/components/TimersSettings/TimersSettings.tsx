import React, { useContext } from 'react';
import { Text, View } from 'react-native';

import { AppContext } from '../../../../contexts';

import { Input } from '../../../../styles';

const TimersSettings: React.FC = () => {
  const { timers, setTimers } = useContext(AppContext);

  const handleTimerChange = (timerId: number) => (value: React.ReactText) =>
    setTimers(
      timers.map((timer) =>
        timer.id === timerId
          ? {
              ...timer,
              interval: parseInt(value as string)
            }
          : timer
      )
    );

  return (
    <>
      {timers.map(({ id, title, interval }) => (
        <View key={id} style={{ marginTop: 10, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ flexGrow: 1, fontSize: 18 }}>{title}</Text>
          <Input
            keyboardType={'numeric'}
            style={{ flexBasis: 80 }}
            placeholder={'mins'}
            defaultValue={(interval || 0).toString()}
            onChangeText={handleTimerChange(id)}
          />
        </View>
      ))}
    </>
  );
};

export default TimersSettings;
