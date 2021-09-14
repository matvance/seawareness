import styled from 'styled-components/native';

export const UserLabel = styled.Text`
  font-size: 18px;
  flex-grow: 1;
  margin-right: 24px;
  width: 85%;
  padding: 24px 0;
`;

export const TouchableUserLabel = styled.TouchableOpacity`
  flex-grow: 1;
  margin-left: 12px;
  width: 85%;
`;

export const UserItem = styled.View`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: #dedede;
`;
