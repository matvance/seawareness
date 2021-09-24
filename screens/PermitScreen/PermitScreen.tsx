import React, { useState } from 'react';
import { View } from 'react-native';

import { ScreenTemplate, ScreenHeading, Button, Select, Switch } from '../../components';

import { Paragraph } from '../../styles';
import { RowWrapper } from './PermitScreen.styles';

interface Props {
  navigation: {
    navigate: (route: string, params?: any) => void;
  };
}

const PermitScreen: React.FC<Props> = ({ navigation }) => {
  const [toggle, setToggle] = useState(false);

  return (
    <ScreenTemplate>
      <ScreenHeading>Work in progress</ScreenHeading>

      <RowWrapper marginTop={30}>
        <View style={{ flexBasis: '60%' }}>
          <Paragraph>Work started</Paragraph>
          <Paragraph bold>1 June, 20:18</Paragraph>
        </View>
        <View style={{ flexBasis: '40%' }}>
          <Paragraph>Duration</Paragraph>
          <Paragraph bold>36:51</Paragraph>
        </View>
      </RowWrapper>

      <RowWrapper marginTop={50}>
        <View style={{ flexBasis: '60%' }}>
          <Paragraph>Communication timer</Paragraph>
          <Paragraph bold>14:47</Paragraph>
        </View>
        <View style={{ flexBasis: '40%' }}>
          <Button title={'Check now'} onPress={() => {}} />
        </View>
      </RowWrapper>

      <RowWrapper marginTop={20}>
        <View style={{ flexBasis: '60%' }}>
          <Paragraph>Measurement timer</Paragraph>
          <Paragraph bold>10:11</Paragraph>
        </View>
        <View style={{ flexBasis: '40%' }}>
          <Button title={'Check now'} onPress={() => {}} />
        </View>
      </RowWrapper>

      <Select
        marginTop={50}
        label={'Standby person'}
        options={[{ label: 'TEST', value: 'TEST' }]}
        selectedValue={'TEST'}
        onValueChange={() => {}}
      />

      <ScreenHeading subheading marginTop={50}>
        Entering crew
      </ScreenHeading>

      <RowWrapper marginTop={30}>
        <View style={{ flexBasis: '60%' }}>
          <Paragraph>AB F. Wisniewski</Paragraph>
          <Paragraph bold>12:52 in</Paragraph>
        </View>
        <View style={{ flexBasis: '40%' }}>
          <Switch value={toggle} onValueChange={setToggle} withLabels />
        </View>
      </RowWrapper>
      <RowWrapper marginTop={10}>
        <View style={{ flexBasis: '60%' }}>
          <Paragraph>AB F. Wisniewski</Paragraph>
          <Paragraph bold>12:52 in</Paragraph>
        </View>
        <View style={{ flexBasis: '40%' }}>
          <Switch value={toggle} onValueChange={setToggle} withLabels />
        </View>
      </RowWrapper>

      <RowWrapper marginTop={30}>
        <View style={{ flexBasis: '50%' }}></View>
        <View style={{ flexBasis: '50%' }}>
          <Button title={'Save changes'} onPress={() => {}} />
        </View>
      </RowWrapper>

      <Button title={'Stop permit'} variant={'secondary'} marginTop={100} onPress={() => {}} />
    </ScreenTemplate>
  );
};

export default PermitScreen;
