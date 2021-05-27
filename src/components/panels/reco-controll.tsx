import { Button, Divider } from 'antd';
import React, { useCallback, useEffect } from 'react';

import { useSync } from '../../hooks/create-sync-value';
import { useCollect } from '../../hooks/use-collect';
import { useEvent } from '../../hooks/use-hl-event';
import { useLeapController } from '../../hooks/use-leap-controller';
import { HistoryModal } from '../history-modal';

export const RecoControl: React.FC = () => {
  const {
    collect,
    latestCollect,
    frames,
    startCollectSyncState: [{ loading }, startCollect],
    stopCollect,
    uploadToReco,
  } = useCollect();
  const { deviceStreaming } = useLeapController((model) => [
    model.deviceStreaming,
  ]);

  const onClick = useCallback(
    () => (latestCollect.current ? stopCollect : startCollect)(),
    [latestCollect, startCollect, stopCollect]
  );

  useEvent('reco_btn', onClick);
  const [, setDisabled] = useSync.Disabled();
  useEffect(
    () => setDisabled(loading || !deviceStreaming),
    [loading, deviceStreaming] //eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <div>
      <div className="font-light my-2">
        已获取 {frames.current.length} 帧数据
      </div>
      <div>
        <Button onClick={onClick} loading={loading} disabled={!deviceStreaming}>
          {collect ? '停止' : '开始'}
        </Button>
        <Divider type="vertical" />
        <Button disabled={!frames.current.length} onClick={uploadToReco}>
          上传识别
        </Button>
        <Divider type="vertical" />
        <HistoryModal />
      </div>
    </div>
  );
};
