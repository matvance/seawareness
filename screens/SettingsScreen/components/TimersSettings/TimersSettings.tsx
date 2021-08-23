import React from 'react';
import { Text, View } from 'react-native';
import { Input } from '../../../../styles';

const TimersSettings: React.FC = () => {
  return (
    <>
      <View style={{ marginTop: 20, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ flexGrow: 1, fontSize: 18 }}>Communication timer</Text>
        <Input keyboardType={'numeric'} style={{ flexBasis: 80 }} placeholder={'mins'} />
      </View>
      <View style={{ marginTop: 20, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ flexGrow: 1, fontSize: 18 }}>Measurement timer</Text>
        <Input keyboardType={'numeric'} style={{ flexBasis: 80 }} placeholder={'mins'} />
      </View>
      <View style={{ marginTop: 20, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ flexGrow: 1, fontSize: 18 }}>Soft alarm threshold</Text>
        <Input keyboardType={'numeric'} style={{ flexBasis: 80 }} placeholder={'mins'} />
      </View>
    </>
  );
};

export default TimersSettings;
