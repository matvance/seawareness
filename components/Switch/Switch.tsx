import React from 'react';
import { Switch, View } from 'react-native';

import { colors, Paragraph } from '../../styles';

interface Props {
  value: boolean;
  onValueChange: (newValue: boolean) => void;
  withLabels?: boolean;
  boldActiveLabel?: boolean;
  disabled?: boolean;
}

const Switcher: React.FC<Props> = ({ value, onValueChange, withLabels, boldActiveLabel, disabled }) => {
  return (
    <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
      {withLabels && (
        <Paragraph style={{ marginRight: 15, opacity: disabled ? 0.3 : 1 }} bold={boldActiveLabel && !value}>
          OUT
        </Paragraph>
      )}
      <Switch
        style={{ scaleX: 1.5, scaleY: 1.5, opacity: disabled ? 0.3 : 1 }}
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={value ? colors.primaryAccent : '#eee'}
        onValueChange={onValueChange}
        value={value}
        disabled={true}
      />
      {withLabels && (
        <Paragraph style={{ marginLeft: 15, opacity: disabled ? 0.3 : 1 }} bold={boldActiveLabel && value}>
          IN
        </Paragraph>
      )}
    </View>
  );
};

export default Switcher;
