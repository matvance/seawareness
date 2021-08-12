import styled from 'styled-components/native';

import { colors } from '../../styles';

export const ButtonBody = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 48px;
  border-radius: 8px;
  background-color: ${colors.primaryAccent};
`;

export const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  text-align: center;
  width: 100%;
`;
