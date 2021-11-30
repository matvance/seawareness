import React from 'react';
import { Modal, View } from 'react-native';

import { Button, SwipeConfirm } from '../../components';

import { Paragraph } from '../../styles';
import { ModalBackdrop } from '../modals/ConfirmModal/confirm-modal.styles';

const AlertActivity: React.FC = ({ children }) => {
  return (
    <Modal animationType='fade' transparent={true} visible onRequestClose={() => {}}>
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
          <Paragraph center>TEST</Paragraph>
          {children}
          <Button title={'HELLO'} onPress={() => {}} variant={'secondary'} marginTop={50} />
        </View>
      </ModalBackdrop>
    </Modal>
  );
};

export default AlertActivity;
