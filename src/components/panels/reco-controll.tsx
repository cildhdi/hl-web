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
  useEvent('upload', uploadToReco);
  const [, setStartStopDisabled] = useSync.StartStopDisabled();
  const [, setUploadDisabled] = useSync.UploadDisabled();
  useEffect(
    () => setStartStopDisabled(loading || !deviceStreaming),
    [loading, deviceStreaming] //eslint-disable-line react-hooks/exhaustive-deps
  );
  useEffect(
    () => setUploadDisabled(!frames.current.length || collect),
    [!frames.current.length || collect] //eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <div>
      <div className="font-light my-2">
        {collect || frames.current.length
          ? `已获取 ${frames.current.length} 帧数据`
          : '点击“开始”录制数据，结束后“上传识别”'}
      </div>
      <div>
        <Button onClick={onClick} loading={loading} disabled={!deviceStreaming}>
          {collect ? '停止' : '开始'}
        </Button>
        <Divider type="vertical" />
        <Button
          disabled={!frames.current.length || collect}
          onClick={uploadToReco}
        >
          上传识别
        </Button>
        <Divider type="vertical" />
        <HistoryModal />
      </div>
    </div>
  );
};
