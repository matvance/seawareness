import styled, { css } from 'styled-components/native';

import { colors } from './theme';

export const ScreenHeadingSubtitle = styled.Text`
  font-size: 18px;
  line-height: 28px;
  margin-top: 50px;
`;

const Paragraph = styled.Text<{ isError?: boolean; marginTop?: number; marginBottom?: number; center?: boolean; bold?: boolean }>`
  font-size: 18px;
  line-height: 28px;
  color: #000;

  ${({ isError }) =>
    isError &&
    css`
      color: ${colors.errorParagraph};
    `}

  ${({ center }) =>
    center &&
    css`
      text-align: center;
    `}
  
  ${({ bold }) =>
    bold &&
    css`
      font-weight: bold;
    `}

  ${({ marginTop }) =>
    css`
      margin-top: ${marginTop + 'px'};
    `}
  ${({ marginBottom }) =>
    css`
      margin-bottom: ${marginBottom + 'px'};
    `}
`;
Paragraph.defaultProps = {
  marginTop: 0,
  marginBottom: 0
};

export { Paragraph };
