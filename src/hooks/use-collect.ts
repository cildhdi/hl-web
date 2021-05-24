import { useThrottleFn } from 'ahooks';
import { message } from 'antd';
import { useEffect, useRef } from 'react';
import { useLatest, useUpdate } from 'react-use';
import { v4 as uuidV4 } from 'uuid';

import { useLeapController } from '../hooks/use-leap-controller';
import { Frame, framesToShapeTrack } from '../util/frame';
import { reco } from '../util/service';
import { useSync } from './create-sync-value';

export const useCollect = () => {
  const { listenFrame } = useLeapController((model) => [model.listenFrame]);
  const [collect, toggleCollect] = useSync.Collect();
  const lastestCollect = useLatest(collect);
  const frames = useRef<Frame[]>([]);
  const forceUpdate = useUpdate();
  const { run: throttledForceUpdate } = useThrottleFn(forceUpdate, {
    wait: 500,
  });

  useEffect(
    () =>
      listenFrame((frame) => {
        if (frame.hands.length && lastestCollect.current) {
          frames.current.push(frame);
          throttledForceUpdate();
        }
      }),
    [listenFrame] //eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    if (collect) {
      frames.current = [];
    } else if (frames.current.length) {
      const key = uuidV4();
      message.loading({
        content: '识别中',
        duration: 0,
        key,
      });
      reco(framesToShapeTrack(frames.current))
        .then(({ data }) =>
          message.success({
            content: data,
            key,
          })
        )
        .catch((error) => {
          console.error(error);
          message.error({
            content: '识别出错',
            key,
          });
        });
    }
  }, [collect]);

  return {
    collect,
    toggleCollect,
    frames,
  };
};
