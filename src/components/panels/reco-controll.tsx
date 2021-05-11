import { Button, message } from 'antd';
import React from 'react';
import { useAsyncFn } from 'react-use';
import { v4 as uuidv4 } from 'uuid';

import { useCollect } from '../../hooks/use-collect';
import { useLeapController } from '../../hooks/use-leap-controller';
import { useStartDelay } from '../../hooks/use-start-delay';
import { sleep } from '../../util/sleep';

export const RecoControl: React.FC = () => {
  const { collect, toggleCollect, frames } = useCollect();
  const { deviceStreaming } = useLeapController((model) => [
    model.deviceStreaming,
  ]);

  const [{ loading }, start] = useAsyncFn(async () => {
    const key = uuidv4();
    const waitTime = useStartDelay.data?.[0] ?? 2;

    for (let index = waitTime; index > 0; index--) {
      message.loading({
        content: `手势采集将在 ${index} 秒后开始，请准备`,
        duration: 0,
        key,
      });
      await sleep(1000);
    }
    message.destroy(key);
    toggleCollect(true);
  }, []);

  return (
    <div>
      <div className="font-light my-2">
        已获取 {frames.current.length} 帧数据
      </div>
      <Button
        onClick={collect ? () => toggleCollect(false) : start}
        type="primary"
        block
        loading={loading}
        disabled={!deviceStreaming}
      >
        {collect ? '停止' : '开始'}
      </Button>
    </div>
  );
};
