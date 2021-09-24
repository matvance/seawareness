import styled, { css } from 'styled-components/native';

export const RowWrapper = styled.View<{ marginTop?: number }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  ${({ marginTop }) =>
    marginTop &&
    css`
      margin-top: ${marginTop}px;
    `}
`;
