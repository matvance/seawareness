import React, { useState, useEffect, ReactText } from 'react';

import { ConfirmModal, Select } from '../../../components';
import { SelectedCrewMember } from '../../../contexts/permit.context';

interface Props {
  crew: SelectedCrewMember[];
  standbyPerson: string;
  onChangeStandbyPerson: (newPerson: string) => void;
}

const StandbyPerson: React.FC<Props> = ({ crew, standbyPerson, onChangeStandbyPerson }) => {
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [newStandbyPerson, setNewStandbyPerson] = useState<string | null>(null);

  const filteredCrew = crew.filter(({ isInside }) => !isInside);
  const standbyPersonOptions = filteredCrew.map(({ name }) => ({
    value: name,
    label: name
  }));

  useEffect(() => {
    setNewStandbyPerson(null);
  }, [crew, standbyPerson]);

  const onChangeSelectValue = (newValue: ReactText) => {
    if (newValue !== standbyPerson) {
      setNewStandbyPerson(newValue as string);
      setConfirmModalOpen(true);
    }
  };

  const onConfirmNewStandbyPerson = () => {
    setConfirmModalOpen(false);
    newStandbyPerson && onChangeStandbyPerson(newStandbyPerson);
  };

  const onCancelNewStandbyPerson = () => {
    setNewStandbyPerson(null);
    setConfirmModalOpen(false);
  };

  return (
    <>
      <Select
        marginTop={50}
        label={'Standby person'}
        options={standbyPersonOptions}
        selectedValue={standbyPerson}
        onValueChange={onChangeSelectValue}
      />
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onConfirm={onConfirmNewStandbyPerson}
        onCancel={onCancelNewStandbyPerson}
        text={`Do you really want to changge standby person to ${newStandbyPerson}?`}
      />
    </>
  );
};

export default StandbyPerson;
