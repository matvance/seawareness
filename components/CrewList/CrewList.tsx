import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { UserLabel, UserItem } from './CrewList.styles';

interface Props {
  names: string[];
  height?: string | number;
  marginTop?: string | number;
}

const CrewList: React.FC<Props> = ({ names = [], height = '50%', marginTop = 100 }) => {
  return (
    <ScrollView style={{ marginTop, height }}>
      {names.map((name) => (
        <UserItem key={name}>
          <UserLabel>{name}</UserLabel>
          <TouchableOpacity>
            <Feather name={'minus-circle'} size={24} />
          </TouchableOpacity>
        </UserItem>
      ))}
    </ScrollView>
  );
};

export default CrewList;
