import { Form, InputNumber, Switch } from 'antd';
import React from 'react';

import { useSync } from '../../hooks/create-sync-value';
import { useFrameMod } from '../../hooks/use-frame-mod';
import { useOldApi } from '../../hooks/use-old-api';

export const Settings: React.FC = () => {
  const [startDelay, setStartDelay] = useSync.Delay();
  const [frameMod, setFrameMod] = useFrameMod();
  const [old, setOld] = useOldApi();

  return (
    <div>
      <div className="font-semibold text-base mb-2">设置</div>
      <Form labelCol={{ span: 8 }}>
        <Form.Item
          label="启动延迟"
          help="设置点击“开始”按钮后开始采集手势的延迟时间（单位/秒）"
        >
          <InputNumber
            className="block w-full"
            value={startDelay}
            onChange={setStartDelay}
            min={1}
            max={10}
          />
        </Form.Item>
        <Form.Item label="使用 v1 API" help="设置是否使用旧版 API">
          <Switch checked={old} onClick={() => setOld(!old)} />
        </Form.Item>
        {old ? (
          <Form.Item label="帧间隔" help="设置每多少帧取一帧作为输入">
            <InputNumber
              className="block w-full"
              value={frameMod}
              onChange={setFrameMod}
              min={1}
              max={50}
            />
          </Form.Item>
        ) : null}
      </Form>
    </div>
  );
};
