import React, { useState } from 'react';
import { View } from 'react-native';

import { Button, ScreenHeading, Switch } from '../../../components';
import { parseTimeDifference } from '../permit-screen.utils';
import { SelectedCrewMember } from '../../../contexts/permit.context';

import { RowWrapper } from '../PermitScreen.styles';
import { Paragraph } from '../../../styles';

interface Props {
  crew: SelectedCrewMember[];
}

interface SwitchPosition {
  memberName: string;
  switchPosition: boolean;
}

const EnteringCrew: React.FC<Props> = ({ crew }) => {
  const [newSwitchPositions, setNewSwitchPositions] = useState<SwitchPosition[]>([]);

  const getSwitchPosition = (nameOfMember: string) => {
    const certainSwitchPosition = newSwitchPositions.find(({ memberName }) => memberName === nameOfMember);
    if (!!certainSwitchPosition) {
      return certainSwitchPosition.switchPosition;
    } else {
      return crew.find(({ name }) => name === nameOfMember)?.isInside || false;
    }
  };
  const changeSwitchPosition = (nameOfMember: string) => () => {
    const certainSwitchPosition = newSwitchPositions.find(({ memberName }) => memberName === nameOfMember);
    const certainCrewMember = crew.find(({ name }) => name === nameOfMember);

    if (!!certainSwitchPosition) {
      setNewSwitchPositions(newSwitchPositions.filter(({ memberName }) => memberName !== nameOfMember));
    } else if (!!certainCrewMember) {
      setNewSwitchPositions([
        ...newSwitchPositions,
        {
          memberName: certainCrewMember.name,
          switchPosition: !certainCrewMember.isInside
        }
      ]);
    }
  };
  const resetSwitchPositions = () => setNewSwitchPositions([]);

  return (
    <>
      <ScreenHeading subheading marginTop={50}>
        Entering crew
      </ScreenHeading>

      {crew.map(({ name, lastAction, isInside }) => (
        <RowWrapper marginTop={30} key={name}>
          <View style={{ flexBasis: '60%' }}>
            <Paragraph>{name}</Paragraph>
            <Paragraph bold>
              {parseTimeDifference(lastAction)} {isInside ? 'in' : 'out'}
            </Paragraph>
          </View>
          <View style={{ flexBasis: '40%' }}>
            <Switch
              value={getSwitchPosition(name)}
              onValueChange={changeSwitchPosition(name)}
              withLabels
              boldActiveLabel={getSwitchPosition(name) !== isInside}
            />
          </View>
        </RowWrapper>
      ))}

      {!!newSwitchPositions.length && (
        <RowWrapper marginTop={30}>
          <View style={{ flexBasis: '50%', paddingRight: 20 }}>
            <Button title={'Reset'} onPress={resetSwitchPositions} variant={'secondary'} />
          </View>
          <View style={{ flexBasis: '50%' }}>
            <Button title={'Save changes'} onPress={() => {}} />
          </View>
        </RowWrapper>
      )}
    </>
  );
};

export default EnteringCrew;
