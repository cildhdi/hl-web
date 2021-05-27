import { useThrottleFn } from 'ahooks';
import { message } from 'antd';
import { useCallback, useEffect, useRef } from 'react';
import { useAsyncFn, useLatest, useUpdate } from 'react-use';
import { v4 as uuidV4 } from 'uuid';

import { useLeapController } from '../hooks/use-leap-controller';
import { Frame, framesToShapeTrack } from '../util/frame';
import { reco } from '../util/service';
import { sleep } from '../util/sleep';
import { useSync } from './create-sync-value';
import { useRecoHistory } from './use-reco-history';

export const useCollect = () => {
  const { listenFrame } = useLeapController((model) => [model.listenFrame]);
  const [collect, setCollect] = useSync.Collect();
  const latestCollect = useLatest(collect);
  const frames = useRef<Frame[]>([]);
  const forceUpdate = useUpdate();
  const { run: throttledForceUpdate } = useThrottleFn(forceUpdate, {
    wait: 500,
  });
  const { addHistory } = useRecoHistory((model) => [model.addHistory]);

  useEffect(
    () =>
      listenFrame((frame) => {
        if (frame.hands.length && latestCollect.current) {
          frames.current.push(frame);
          throttledForceUpdate();
        }
      }),
    [listenFrame] //eslint-disable-line react-hooks/exhaustive-deps
  );

  const startCollectSyncState = useAsyncFn(async () => {
    if (!latestCollect.current) {
      frames.current = [];
      const key = uuidV4();
      const waitTime = useSync.Delay.data?.[0] ?? 2;

      for (let index = waitTime; index > 0; index--) {
        message.loading({
          content: `手势采集将在 ${index} 秒后开始，请准备`,
          duration: 0,
          key,
        });
        await sleep(1000);
      }
      message.destroy(key);
      setCollect(true);
    }
  }, []);

  const uploadToReco = useCallback(() => {
    const key = uuidV4();
    message.loading({
      content: '识别中',
      duration: 0,
      key,
    });
    const param = framesToShapeTrack(frames.current);
    reco(param)
      .then(({ data }) => {
        message.success({
          content: data,
          key,
        });
        addHistory({
          result: data,
        });
      })
      .catch((error) => {
        console.error(error);
        message.error({
          content: '识别出错',
          key,
        });
      });
  }, [addHistory]);

  const stopCollect = useCallback(async () => {
    if (latestCollect.current) {
      setCollect(false);
    }
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  return {
    collect,
    latestCollect,
    frames,
    startCollectSyncState,
    stopCollect,
    uploadToReco,
  };
};
