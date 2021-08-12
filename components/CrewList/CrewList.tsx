import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { UserLabel, UserItem } from './CrewList.styles';
import { colors } from '../../styles';

interface Props {
  names: string[];
  marginTop?: string | number;
  onDelete: (name: string) => void;
}

const CrewList: React.FC<Props> = ({ names = [], marginTop = 24, onDelete }) => {
  const handleDeletion = (name: string) => () => onDelete(name);

  return (
    <View style={{ marginTop }}>
      {names.map((name, index) => {
        const isLastItem = index === names.length - 1;

        return (
          <UserItem key={name} style={{ borderBottomWidth: isLastItem ? 0 : 1 }}>
            <UserLabel>{name}</UserLabel>
            <TouchableOpacity onPress={handleDeletion(name)}>
              <Feather name={'minus-circle'} color={colors.deletion} size={24} />
            </TouchableOpacity>
          </UserItem>
        );
      })}
    </View>
  );
};

export default CrewList;
