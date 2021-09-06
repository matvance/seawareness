import React from 'react';

import { StyledInput } from './Input.styles';
import { Paragraph } from '../../styles';

interface Props {
  label?: string;
  marginTop?: number;
}

const Input: React.FC<Props> = ({ label, marginTop = 0 }) => {
  return (
    <>
      <Paragraph marginTop={marginTop} marginBottom={12}>
        {label}
      </Paragraph>
      <StyledInput />
    </>
  );
};

export default Input;
