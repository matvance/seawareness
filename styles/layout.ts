import styled from 'styled-components/native';

export const ScreenWrapper = styled.ScrollView`
  background-color: #fafafa;
  height: auto;
`;

export const ScreenBody = styled.View<{ extraPaddingBottom: number }>`
  width: 100%;
  height: 100%;
  padding: 50px 24px ${({ extraPaddingBottom }) => extraPaddingBottom + 50}px 24px;
`;

export const FixedToBottom = styled.View`
  position: absolute;
  bottom: 0;
  padding: 24px;
  background-color: #fafafa;
  width: 100%;
`;
