import { Divider } from 'antd';
import React from 'react';

import { ControlPanel } from './control-panel';
import { GuideModal } from './guide';

export const IndexPage: React.FC = () => {
  return (
    <>
      <div className="flex h-full">
        <div className="flex-1"></div>
        <Divider type="vertical" className="h-full" />
        <ControlPanel />
      </div>
      <GuideModal />
    </>
  );
};
