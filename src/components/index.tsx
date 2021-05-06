import { Divider } from 'antd';
import React from 'react';

import { useLeapController } from '../hooks/use-leap-controller';
import { ControlPanel } from './control-panel';
import { WaitForConnection } from './preview';
import htmlLeapPreview from './threejs-bones.html';

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
          {true ? (
            <iframe srcDoc={htmlLeapPreview} className="w-full h-full" />
          ) : (
            <WaitForConnection />
          )}
        </div>
      </div>
    </>
  );
};
