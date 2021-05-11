import { Alert } from 'antd';
import React from 'react';

import { useGuideShow } from '../../hooks/use-guide-show';
import { useLeapController } from '../../hooks/use-leap-controller';
import { GuideModal } from '../guide';

export const ConnectStatus: React.FC = () => {
  const [, setGuideShow] = useGuideShow();
  const { deviceStreaming, serviceConnected, paused } = useLeapController(
    (model) => [model.deviceStreaming, model.serviceConnected, model.paused]
  );
  const connectStatus = deviceStreaming && serviceConnected;

  return (
    <>
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
      <GuideModal />
    </>
  );
};
