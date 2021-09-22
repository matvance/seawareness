import React from 'react';
import SwipeButton from 'rn-swipe-button';

import { colors } from '../../styles';

interface Props {
  onConfirm: () => void;
}

const SwipeConfirm: React.FC<Props> = ({ onConfirm }) => (
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
);

export default SwipeConfirm;
