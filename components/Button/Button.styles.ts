import styled, { css } from 'styled-components/native';

import { colors } from '../../styles';

export const ButtonBody = styled.View<{ variant?: 'primary' | 'secondary'; disabled: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 48px;
  border-radius: 8px;
  padding: 12px 24px;
  background-color: ${colors.primaryAccent};

  ${({ variant }) => {
    switch (variant) {
      case 'secondary':
        return css`
          background-color: #fff;
          border: 1px solid #808080;
        `;
    }
  }}

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.7;
    `}
`;

export const ButtonText = styled.Text<{ variant?: 'primary' | 'secondary' }>`
  color: #fff;
  font-size: 16px;
  text-align: center;
  width: 100%;

  ${({ variant }) => {
    switch (variant) {
      case 'secondary':
        return css`
          color: #808080;
        `;
    }
  }}
`;
