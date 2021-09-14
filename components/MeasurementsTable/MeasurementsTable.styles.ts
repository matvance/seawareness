import styled from 'styled-components/native';

export const MeasurementItem = styled.View`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  border-bottom-width: 1px;
  border-bottom-color: #dedede;
`;

export const MeasurementLabel = styled.Text`
  font-size: 18px;
  flex-grow: 1;
  margin-right: 24px;
  padding: 24px 0;
`;

export const InputWrapper = styled.View`
  width: 100px;
`;
