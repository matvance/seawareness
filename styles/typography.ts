import styled, { css } from 'styled-components/native';

import { colors } from '../styles';

const ScreenHeading = styled.Text<{ subheading?: boolean; marginTop?: number }>`
  font-size: 32px;

  ${({ subheading }) =>
    subheading &&
    css`
      font-size: 24px;
    `}

  ${({ marginTop }) =>
    marginTop &&
    css`
      margin-top: ${marginTop}px;
    `}
`;
ScreenHeading.defaultProps = {
  marginTop: 0
};
export { ScreenHeading };

export const ScreenHeadingSubtitle = styled.Text`
  font-size: 18px;
  line-height: 28px;
  margin-top: 50px;
`;

const Paragraph = styled.Text<{ isError?: boolean; marginTop?: number }>`
  font-size: 18px;
  line-height: 28px;

  ${({ isError }) =>
    isError &&
    css`
      color: ${colors.errorParagraph};
    `}

  ${({ marginTop }) =>
    css`
      margin-top: ${marginTop + 'px'};
    `}
`;
Paragraph.defaultProps = {
  marginTop: 0
};

export { Paragraph };
