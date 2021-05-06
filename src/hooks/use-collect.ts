import { message } from 'antd';
import { useEffect, useRef } from 'react';
import { useToggle } from 'react-use';

import { useLeapController } from '../hooks/use-leap-controller';
import { Frame, framesToShapeTrack } from '../util/frame';
import { reco } from '../util/service';

export const useCollect = () => {
  const { listenFrame } = useLeapController((model) => [model.listenFrame]);
  const [collect, toggleCollect] = useToggle(false);
  const frames = useRef<Frame[]>([]);

  useEffect(
    () =>
      listenFrame((frame) => {
        if (frame.hands.length) {
          frames.current.push(frame);
        }
      }),
    [listenFrame]
  );

  useEffect(() => {
    if (collect) {
      frames.current = [];
    } else if (frames.current.length) {
      reco(framesToShapeTrack(frames.current)).then(({ data }) =>
        message.success(data)
      );
    }
  }, [collect]);

  return {
    collect,
    toggleCollect,
  };
};
