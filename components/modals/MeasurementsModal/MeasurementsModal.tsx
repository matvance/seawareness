import React, { useState } from 'react';
import { Modal, ScrollView, View } from 'react-native';

import { ModalBackdrop } from './measurements-modal.styles';
import { Button, MeasurementsTable, SwipeConfirm } from '../../../components';
import { MeasurementValue } from '../../MeasurementsTable/MeasurementsTable';
import { Paragraph } from '../../../styles';

interface Props {
  isOpen: boolean;
  onSave: (measurementValues: MeasurementValue[]) => void;
  onCancel: () => void;
}

const MeasurementsModal = ({ isOpen, onSave, onCancel }: Props) => {
  const [isValid, setValid] = useState(false);
  const [showSwiper, setShowSwiper] = useState(false);
  const [measurements, setMeasurements] = useState<MeasurementValue[]>([]);

  const toggleShowSwiper = () => setShowSwiper((prevState) => !prevState);
  const handleSave = () => {
    setValid(false);
    setShowSwiper(false);
    onSave(measurements);
  };
  const onMeasurementsChange = (isValid: boolean, measurementValues: MeasurementValue[]) => {
    setValid(isValid);
    setMeasurements(measurementValues);
  };

  return (
    <Modal animationType='fade' transparent={true} visible={isOpen} onRequestClose={onCancel}>
      <ModalBackdrop>
        <ScrollView
          style={{
            maxHeight: '100%'
          }}
        >
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
            <Paragraph>Provide measurements</Paragraph>
            <MeasurementsTable onChange={onMeasurementsChange} />
            {showSwiper ? (
              <>
                <SwipeConfirm onConfirm={handleSave} marginTop={30} />
                <Button variant={'secondary'} onPress={toggleShowSwiper} title={'Cancel'} marginTop={30} />
              </>
            ) : (
              <Button onPress={toggleShowSwiper} title={'Confirm'} disabled={!isValid} marginTop={30} />
            )}
          </View>
        </ScrollView>
      </ModalBackdrop>
    </Modal>
  );
};

export default MeasurementsModal;
