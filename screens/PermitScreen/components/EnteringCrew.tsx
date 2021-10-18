import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Button, ConfirmModal, ScreenHeading, Switch } from '../../../components';
import { parseTimeDifference } from '../permit-screen.utils';
import { SelectedCrewMember } from '../../../contexts/permit.context';

import { RowWrapper } from '../PermitScreen.styles';
import { Paragraph } from '../../../styles';

interface Props {
  crew: SelectedCrewMember[];
  onNewCrewMembers: (newCrewMembers: SelectedCrewMember[]) => void;
  standbyPerson: string;
}

interface SwitchPosition {
  memberName: string;
  switchPosition: boolean;
}

const EnteringCrew: React.FC<Props> = ({ crew, onNewCrewMembers, standbyPerson }) => {
  const [newSwitchPositions, setNewSwitchPositions] = useState<SwitchPosition[]>([]);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const togleConfirmModalOpen = () => setConfirmModalOpen(!isConfirmModalOpen);

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

  const onNewValuesConfirm = () => {
    setConfirmModalOpen(false);
    onNewCrewMembers(
      crew.map(({ name, isInside, lastAction }) => {
        const certainSwitchPosition = newSwitchPositions.find(({ memberName }) => memberName === name);
        return {
          name,
          isInside: typeof certainSwitchPosition === 'undefined' ? isInside : certainSwitchPosition.switchPosition,
          lastAction: typeof certainSwitchPosition === 'undefined' ? lastAction : new Date()
        };
      })
    );
  };

  useEffect(() => {
    setNewSwitchPositions([]);
  }, [crew]);

  return (
    <>
      <ScreenHeading subheading marginTop={50}>
        Entering crew
      </ScreenHeading>

      {crew.map(({ name, lastAction, isInside }, index) => (
        <RowWrapper marginTop={index === 0 ? 30 : 10} key={name}>
          <View style={{ flexBasis: '60%' }}>
            <Paragraph bold={getSwitchPosition(name) !== isInside}>{name}</Paragraph>
            {isInside ? <Paragraph bold>{parseTimeDifference(lastAction)} in</Paragraph> : <Paragraph bold>out</Paragraph>}
          </View>
          <View style={{ flexBasis: '40%' }}>
            <Switch
              value={getSwitchPosition(name)}
              onValueChange={changeSwitchPosition(name)}
              withLabels
              boldActiveLabel={getSwitchPosition(name) !== isInside}
              disabled={name === standbyPerson}
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
            <Button title={'Save changes'} onPress={togleConfirmModalOpen} />
          </View>
        </RowWrapper>
      )}

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onConfirm={onNewValuesConfirm}
        onCancel={togleConfirmModalOpen}
        text={`${newSwitchPositions.length} crew members state will be changed. Are you sure?`}
      />
    </>
  );
};

export default EnteringCrew;
