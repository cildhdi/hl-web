/** @jsxImportSource @emotion/react */

import { Alert, Button } from 'antd';
import React from 'react';
import { useToggle } from 'react-use';

import { css } from '@emotion/react';

import { useCollect } from '../hooks/use-collect';
import { useGuideShow } from '../hooks/use-guide-show';
import { useLeapController } from '../hooks/use-leap-controller';
import { TestsCasesModal } from './test-cases';

const ConnectStatus: React.FC = () => {
  const [, setGuideShow] = useGuideShow();
  const {
    deviceStreaming,
    serviceConnected,
    paused,
  } = useLeapController((model) => [
    model.deviceStreaming,
    model.serviceConnected,
    model.paused,
  ]);
  const connectStatus = deviceStreaming && serviceConnected;
  
  return (
    <Alert
      showIcon
      className="cursor-pointer"
      type={connectStatus ? (paused ? 'warning' : 'success') : 'error'}
      message={
        connectStatus
          ? paused
            ? '设备已暂停，请点击本页面继续'
            : '设备连接正常'
          : '设备连接异常，点击处理'
      }
      onClick={() => setGuideShow(true)}
    />
  );
};

const RecoControl: React.FC = () => {
  const { collect, toggleCollect } = useCollect();

  return (
    <div>
      <Button onClick={() => toggleCollect()}>
        {collect ? '暂停' : '开始'}
      </Button>
    </div>
  );
};

const TestCase: React.FC = () => {
  const [showTests, toggleShowTests] = useToggle(false);

  return (
    <div>
      <Button onClick={() => toggleShowTests(true)}>测试用例</Button>
      <TestsCasesModal visible={showTests} onClose={toggleShowTests} />
    </div>
  );
};

export const ControlPanel: React.FC = React.memo(() => {
  return (
    <div
      className="p-4 py-9"
      css={css`
        width: 350px;
      `}
    >
      <ConnectStatus />
      <RecoControl />
      <TestCase />
    </div>
  );
});
