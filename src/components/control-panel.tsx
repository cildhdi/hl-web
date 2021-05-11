/** @jsxImportSource @emotion/react */

import { Divider } from 'antd';
import React from 'react';

import { css } from '@emotion/react';

import { ClientPannel } from './panels/client-pannel';
import { ConnectStatus } from './panels/connect-status';
import { RecoControl } from './panels/reco-controll';
import { Settings } from './panels/setting';
import { TestCase } from './panels/test-case';

export const ControlPanel: React.FC = React.memo(() => {
  return (
    <div
      className="py-9 px-7 overflow-y-auto"
      css={css`
        width: 350px;
        min-width: 350px;
      `}
    >
      <div className="text-lg font-bold pb-5">
        基于深度学习的手语识别交互系统
      </div>
      <ConnectStatus />
      <ClientPannel />
      <RecoControl />
      <Divider />
      <Settings />
      <Divider />
      <TestCase />
    </div>
  );
});
