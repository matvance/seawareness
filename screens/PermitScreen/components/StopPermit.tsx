import React, { useState } from 'react';

import { Button, ConfirmModal } from '../../../components';

interface Props {
  onStopPermit: () => void;
  isAnybodyIn: boolean;
}

const StopPermit: React.FC<Props> = ({ onStopPermit, isAnybodyIn }) => {
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const toggleConfirmModal = () => setConfirmModalOpen(!isConfirmModalOpen);

  const buttonText = isAnybodyIn ? "Parmit can't be closed until somebody is inside" : 'Close permit';

  return (
    <>
      <Button title={buttonText} variant={'secondary'} marginTop={100} onPress={toggleConfirmModal} disabled={isAnybodyIn} />
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onConfirm={onStopPermit}
        onCancel={toggleConfirmModal}
        text={'Do you really want close the permit? Permit history will be saved in the logs.'}
      />
    </>
  );
};

export default StopPermit;
