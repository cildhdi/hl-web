import React, { useEffect, useState } from 'react';

import { useLeapController } from '../hooks/use-leap-controller';
import { Frame, framesToShapeTrack } from '../util/frame';

export const DeviceInfo: React.FC = React.memo(() => {
  const { listenFrame } = useLeapController((model) => [model.listenFrame]);
  const [frame, setFrame] = useState<Frame>();
  useEffect(() => listenFrame(setFrame), [listenFrame]);

  return null;
});
