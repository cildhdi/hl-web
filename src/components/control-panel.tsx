/** @jsxImportSource @emotion/react */

import { Alert, Button, Checkbox, Divider, Form, Input, InputNumber, message } from 'antd';
import React from 'react';
import { useAsyncFn, useToggle } from 'react-use';
import { v4 as uuidv4 } from 'uuid';

import { css } from '@emotion/react';

import { useCollect } from '../hooks/use-collect';
import { useGuideShow } from '../hooks/use-guide-show';
import { useLeapController } from '../hooks/use-leap-controller';
import { useServer } from '../hooks/use-server';
import { useServerless } from '../hooks/use-serverless';
import { useStartDelay } from '../hooks/use-start-delay';
import { sleep } from '../util/sleep';
import { GuideModal } from './guide';
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

const RecoControl: React.FC = () => {
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

const TestCase: React.FC = () => {
  const [showTests, toggleShowTests] = useToggle(false);

  return (
    <div>
      <div className="font-semibold text-base mb-2">测试用例</div>
      <div className="font-light my-2">
        测试用例包含了一些条手语的 Shape 与 Track 数据，可以用于没有 LeapMotion
        时测试接口。
      </div>
      <Button onClick={() => toggleShowTests(true)} block>
        显示测试用例
      </Button>
      <TestsCasesModal visible={showTests} onClose={toggleShowTests} />
    </div>
  );
};

const Settings: React.FC = () => {
  const [startDelay, setStartDelay] = useStartDelay();
  const [serverless, setServerless] = useServerless();
  const [server, setServer] = useServer();

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
        <Form.Item label="识别接口">
          <Checkbox
            checked={serverless}
            onChange={() => setServerless(!serverless)}
          >
            使用 Serverless 服务
          </Checkbox>
        </Form.Item>
        {serverless ? null : (
          <Form.Item label="服务器地址">
            <Input value={server} onChange={(e) => setServer(e.target.value)} />
          </Form.Item>
        )}
      </Form>
    </div>
  );
};

export const ControlPanel: React.FC = React.memo(() => {
  return (
    <div
      className="py-9 px-7"
      css={css`
        width: 350px;
        min-width: 350px;
      `}
    >
      <div className="text-lg font-bold pb-5">
        基于深度学习的手语识别交互系统
      </div>
      <ConnectStatus />
      <Divider />
      <RecoControl />
      <Divider />
      <Settings />
      <Divider />
      <TestCase />
    </div>
  );
});
