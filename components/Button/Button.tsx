import React from 'react';
import { TouchableOpacity } from 'react-native';

import { ButtonBody, ButtonText } from './Button.styles';

interface Props {
  title: string;
  onPress: () => void;
  marginTop?: number;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<Props> = ({ title, onPress, marginTop = 0, variant = 'primary' }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={{ marginTop }}>
      <ButtonBody variant={variant}>
        <ButtonText variant={variant}>{title}</ButtonText>
      </ButtonBody>
    </TouchableOpacity>
  );
};

export default Button;
