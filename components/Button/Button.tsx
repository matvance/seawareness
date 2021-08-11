import React from 'react';
import { TouchableOpacity } from 'react-native';

import { ButtonBody, ButtonText } from './Button.styles';

interface Props {
  title: string;
  onPress: () => void;
}

const Button: React.FC<Props> = ({ title, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <ButtonBody>
        <ButtonText>{title}</ButtonText>
      </ButtonBody>
    </TouchableOpacity>
  );
};

export default Button;
