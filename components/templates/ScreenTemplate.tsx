import React from 'react';

import { ScreenBody, ScreenWrapper } from '../../styles';

interface Props {
  extraPaddingBottom?: number;
}

const ScreenTemplate: React.FC<Props> = ({ children, extraPaddingBottom = 0 }) => {
  return (
    <ScreenWrapper>
      <ScreenBody extraPaddingBottom={extraPaddingBottom}>{children}</ScreenBody>
    </ScreenWrapper>
  );
};

export default ScreenTemplate;
