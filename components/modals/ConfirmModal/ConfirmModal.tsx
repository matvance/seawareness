import React from 'react';
import { Modal, View } from 'react-native';

import { Paragraph } from '../../../styles';
import { ModalBackdrop } from './confirm-modal.styles';
import { Button, SwipeConfirm } from '../../../components';

interface Props {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  text?: string;
}

/**
 * TODO: Style better the modal
 * TODO: Make a Modal template from this (for future use and todays redability)
 */

const ConfirmModal: React.FC<Props> = ({ isOpen, onConfirm, onCancel, text }) => (
  <Modal animationType='fade' transparent={true} visible={isOpen} onRequestClose={onCancel}>
    <ModalBackdrop>
      <View
        style={{
          display: 'flex',
          margin: 20,
          backgroundColor: 'white',
          borderRadius: 20,
          padding: 20,
          width: '90%',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5
        }}
      >
        {text && <Paragraph center>{text}</Paragraph>}
        <SwipeConfirm onConfirm={onConfirm} marginTop={50} />
        <Button title={'Cancel'} onPress={onCancel} variant={'secondary'} marginTop={50} />
      </View>
    </ModalBackdrop>
  </Modal>
);

export default ConfirmModal;
