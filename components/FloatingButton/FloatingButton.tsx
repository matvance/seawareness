import React from 'react';

import { FloatingButtonWrapper } from './floating-button.styles';

interface Props {
  onPress?: () => void;
}

const FloatingButton: React.FC<Props> = ({ onPress, children }) => {
  return <FloatingButtonWrapper onPress={onPress}>{children}</FloatingButtonWrapper>;
};

export default FloatingButton;
