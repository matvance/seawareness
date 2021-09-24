import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, CheckBox } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { UserLabel, UserItem, TouchableUserLabel } from './CrewList.styles';
import { colors } from '../../styles';

interface Props {
  names: string[];
  marginTop?: string | number;
  onDelete?: (name: string) => void;
  onChangeChecked?: (checkedMembers: string[]) => void;
}

const CrewList: React.FC<Props> = ({ names = [], marginTop = 24, onDelete, onChangeChecked }) => {
  const [checkedNames, setCheckedNames] = useState<string[]>([]);

  const handleDeletion = (name: string) => () => onDelete && onDelete(name);
  const handleCheck = (name: string) => (checked: boolean) =>
    checked
      ? setCheckedNames(checkedNames.concat(name))
      : setCheckedNames(checkedNames.filter((memberName) => memberName !== name));
  const toggleCheck = (name: string) => () => handleCheck(name)(!isNameChecked(name));
  const isNameChecked = (name: string): boolean => checkedNames.indexOf(name) > -1;

  useEffect(() => {
    onChangeChecked && onChangeChecked(checkedNames);
  }, [checkedNames]);

  return (
    <View style={{ marginTop }}>
      {names &&
        names.map((name, index) => {
          const isLastItem = index === names.length - 1;

          return (
            <UserItem key={name} style={{ borderBottomWidth: isLastItem ? 0 : 1 }}>
              {onChangeChecked && (
                <CheckBox onValueChange={handleCheck(name)} value={isNameChecked(name)} style={{ transform: [{ scale: 1.2 }] }} />
              )}
              {onChangeChecked ? (
                <TouchableUserLabel onPress={toggleCheck(name)}>
                  <UserLabel>{name}</UserLabel>
                </TouchableUserLabel>
              ) : (
                <UserLabel>{name}</UserLabel>
              )}

              {onDelete && (
                <TouchableOpacity style={{ flexBasis: 24, width: 24 }} onPress={handleDeletion(name)}>
                  <Feather name={'minus-circle'} color={colors.deletion} size={24} />
                </TouchableOpacity>
              )}
            </UserItem>
          );
        })}
    </View>
  );
};

export default CrewList;
