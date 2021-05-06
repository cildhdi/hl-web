import { Divider } from 'antd';
import React from 'react';

import { useLeapController } from '../hooks/use-leap-controller';
import { ControlPanel } from './control-panel';
import { Preview } from './preview';
import { WaitForConnection } from './wait-for-connect';

export const IndexPage: React.FC = () => {
  const { deviceStreaming } = useLeapController((model) => [
    model.deviceStreaming,
  ]);

  return (
    <>
      <div className="flex h-full">
        <ControlPanel />
        <Divider type="vertical" className="h-full" />
        <div className="flex-1">
          {deviceStreaming ? <Preview /> : <WaitForConnection />}
        </div>
      </div>
    </>
  );
};
