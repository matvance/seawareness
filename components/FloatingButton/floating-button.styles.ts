import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';

export const FloatingButtonWrapper = styled(TouchableOpacity)`
  border-radius: 1000px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  position: absolute;
  bottom: 20px;
  right: 20px;
  border: 1px solid #e1e1e1;
`;
