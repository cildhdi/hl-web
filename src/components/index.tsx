import { Divider } from 'antd';
import React from 'react';

import { useLeapController } from '../hooks/use-leap-controller';
import { useSocketIo } from '../hooks/use-socket-io';
import { ControlPanel } from './control-panel';
import { RealtimeBone } from './realtime-bone';
import { WaitForConnection } from './wait-for-connect';

export const IndexPage: React.FC = () => {
  const { deviceStreaming } = useLeapController((model) => [
    model.deviceStreaming,
  ]);

  useSocketIo();

  return (
    <>
      <div className="flex h-full">
        <ControlPanel />
        <Divider type="vertical" className="h-full" />
        <div className="flex-1">
          {deviceStreaming ? <RealtimeBone /> : <WaitForConnection />}
        </div>
      </div>
    </>
  );
};
