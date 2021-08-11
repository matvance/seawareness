import styled from 'styled-components/native';

export const UserLabel = styled.Text`
  font-size: 16px;
  flex-grow: 1;
  margin-right: 24px;
`;

export const UserItem = styled.View`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  padding: 24px 0;

  &:not(:last-child) {
    border-bottom: 1px solid #dedede;
  }
`;
