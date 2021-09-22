import styled, { css } from 'styled-components/native';

import { colors } from './theme';

export const Input = styled.TextInput.attrs({ placeholderTextColor: '#676767' })<{ hasError?: boolean }>`
  border-radius: 8px;
  background-color: #e5e5e5;
  color: #212121;
  padding: 12px 12px;
  font-size: 16px;
  height: 48px;

  ${({ hasError }) =>
    hasError &&
    css`
      border: 2px solid ${colors.errorParagraph};
    `}
`;
