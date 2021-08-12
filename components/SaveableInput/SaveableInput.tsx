import React, { useState } from 'react';
import { NativeSyntheticEvent, TextInputChangeEventData, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { Input } from '../../styles';

interface Props {
  onSubmit: (value: string) => boolean | void;
  placeholder: string;
}

const SaveableInput: React.FC<Props> = ({ onSubmit, placeholder }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const handleInputChange = ({ nativeEvent }: NativeSyntheticEvent<TextInputChangeEventData>) => setInputValue(nativeEvent.text);

  const handleSubmit = () => {
    const shouldReset = onSubmit(inputValue);
    if (shouldReset) {
      setInputValue('');
    }
  };

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center'
      }}
    >
      <Input
        style={{ flexGrow: 1, marginRight: 20 }}
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        onSubmitEditing={handleSubmit}
        autoCompleteType={'off'}
      />
      <TouchableOpacity onPress={handleSubmit}>
        <Feather name={'plus-circle'} size={24} />
      </TouchableOpacity>
    </View>
  );
};

export default SaveableInput;
