import { Form, InputNumber } from 'antd';
import React from 'react';

import { useSync } from '../../hooks/create-sync-value';

export const Settings: React.FC = () => {
  const [startDelay, setStartDelay] = useSync.Delay();

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
      </Form>
    </div>
  );
};
