import styled, { css } from 'styled-components/native';

const StyledHeading = styled.Text<{ subheading?: boolean; marginTop?: number }>`
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
StyledHeading.defaultProps = {
  marginTop: 0
};
export { StyledHeading };
