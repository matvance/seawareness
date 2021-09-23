import React from 'react';
import SwipeButton from 'rn-swipe-button';
import { View } from 'react-native';

import { colors } from '../../styles';

interface Props {
  onConfirm: () => void;
  marginTop?: number;
}

const SwipeConfirm: React.FC<Props> = ({ onConfirm, marginTop = 0 }) => (
  <View style={{ marginTop, width: '100%' }}>
    <SwipeButton
      width={'100%'}
      title={'Swipe to confirm'}
      titleColor={'#a0a0a0'}
      titleFontSize={18}
      titleStyles={{ right: 48 }}
      height={70}
      railBackgroundColor={colors.swiper.background}
      railFillBackgroundColor={colors.swiper.background}
      railFillBorderColor={colors.primaryAccent}
      swipeSuccessThreshold={90}
      railBorderColor={colors.swiper.border}
      thumbIconBackgroundColor={colors.primaryAccent}
      thumbIconBorderColor={colors.primaryAccent}
      onSwipeSuccess={onConfirm}
    />
  </View>
);

export default SwipeConfirm;
