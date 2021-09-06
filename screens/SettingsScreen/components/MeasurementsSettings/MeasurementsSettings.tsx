import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { SaveableInput } from '../../../../components';

import { colors, Input } from '../../../../styles';

const MeasurementsSettings: React.FC = () => {
  return (
    <>
      <View style={{ marginTop: 20 }}>
        <View style={{ marginTop: 20, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
          <Text style={{ fontSize: 18, width: 80, marginRight: 20 }}>Min</Text>
          <Text style={{ fontSize: 18, width: 80, marginRight: 24 }}>Max</Text>
        </View>
      </View>
      <View>
        <View style={{ marginTop: 12, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ flexGrow: 1, fontSize: 18 }}>O2</Text>
          <Input keyboardType={'numeric'} style={{ flexBasis: 80, marginRight: 20 }} defaultValue={'10'} placeholder={'min'} />
          <Input keyboardType={'numeric'} style={{ flexBasis: 80, marginRight: 20 }} defaultValue={'20'} placeholder={'max'} />
          <TouchableOpacity onPress={() => {}} style={{ flexBasis: 24, width: 24 }}>
            <Feather name={'minus-circle'} size={24} color={colors.deletion} />
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <View style={{ marginTop: 12, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ flexGrow: 1, fontSize: 18 }}>CO</Text>
          <Input keyboardType={'numeric'} style={{ flexBasis: 80, marginRight: 20 }} defaultValue={'10'} placeholder={'min'} />
          <Input keyboardType={'numeric'} style={{ flexBasis: 80, marginRight: 20 }} defaultValue={'30'} placeholder={'max'} />
          <TouchableOpacity onPress={() => {}} style={{ flexBasis: 24, width: 24 }}>
            <Feather name={'minus-circle'} size={24} color={colors.deletion} />
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <View style={{ marginTop: 12, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ flexGrow: 1, fontSize: 18 }}>CO2</Text>
          <Input keyboardType={'numeric'} style={{ flexBasis: 80, marginRight: 20 }} defaultValue={'5'} placeholder={'min'} />
          <Input keyboardType={'numeric'} style={{ flexBasis: 80, marginRight: 20 }} defaultValue={'15'} placeholder={'max'} />
          <TouchableOpacity onPress={() => {}} style={{ flexBasis: 24, width: 24 }}>
            <Feather name={'minus-circle'} size={24} color={colors.deletion} />
          </TouchableOpacity>
        </View>
      </View>
      <SaveableInput onSubmit={() => {}} placeholder={'Measurement name'} marginTop={20} />
    </>
  );
};

export default MeasurementsSettings;
