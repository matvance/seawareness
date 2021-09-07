import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { StyledHeading } from './ScreenHeading.styles';

interface Props {
  onBackward?: () => void;
  subheading?: boolean;
  marginTop?: number;
}

const ScreenHeading: React.FC<Props> = ({ children, onBackward, subheading, marginTop = 0 }) => {
  return (
    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop }}>
      {onBackward && (
        <TouchableOpacity style={{ marginRight: 18 }} onPress={onBackward}>
          <Feather name={'arrow-left'} size={36} />
        </TouchableOpacity>
      )}
      <StyledHeading subheading={subheading}>{children}</StyledHeading>
    </View>
  );
};

export default ScreenHeading;
