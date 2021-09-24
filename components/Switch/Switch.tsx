import React from 'react';
import { Switch, View } from 'react-native';

import { colors, Paragraph } from '../../styles';

interface Props {
  value: boolean;
  onValueChange: (newValue: boolean) => void;
  withLabels?: boolean;
}

const Switcher: React.FC<Props> = ({ value, onValueChange, withLabels }) => {
  return (
    <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
      {withLabels && <Paragraph style={{ marginRight: 15 }}>OUT</Paragraph>}
      <Switch
        style={{ scaleX: 1.5, scaleY: 1.5 }}
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={value ? colors.primaryAccent : '#eee'}
        onValueChange={onValueChange}
        value={value}
      />
      {withLabels && <Paragraph style={{ marginLeft: 15 }}>IN</Paragraph>}
    </View>
  );
};

export default Switcher;
