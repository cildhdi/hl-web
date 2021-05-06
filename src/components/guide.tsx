import { Button, Checkbox, message, Modal, Steps } from 'antd';
import React, { useEffect } from 'react';
import { useAsyncFn, useCounter, useDebounce, useLocalStorage } from 'react-use';

import picAlllowWebApp from '../assets/allow-web-app.png';
import picResumeTracking from '../assets/resume-tracking.png';
import { useGuideShow } from '../hooks/use-guide-show';
import { useLeapController } from '../hooks/use-leap-controller';

type StepSubTitle = React.FC<{
  stepIndex: number;
}>;

enum StepEnum {
  Install = 0,
  Device = 1,
  Finish = 2,
}

const StepInstallSoftware: StepSubTitle = ({ stepIndex }) => {
  const [{ loading }, onNextStep] = useAsyncFn(async () => {
    useLeapController.data?.resetLeapController();
    await new Promise((r) => setTimeout(r, 2000));
    if (!useLeapController.data?.serviceConnected) {
      message.error('未连接成功，请重新检查此步骤');
    }
  }, []);

  return (
    <div className="mb-5">
      {stepIndex > StepEnum.Install ? (
        <div>已完成</div>
      ) : (
        <>
          点击
          <Button
            type="link"
            href="https://developer.leapmotion.com/sdk-leap-motion-controller/"
            target="_blank"
          >
            此链接
          </Button>
          前往官网选择下载适合您系统的 Leap Motion Controller 软件并安装。
          <br />
          启动软件并进入“设置 &gt; 常规”，勾选“允许Web应用程序”。
          <br />
          <img
            src={picAlllowWebApp}
            width="300px"
            alt="勾选“允许Web应用程序”"
            className="mb-3"
          />
          <br />
          <Button type="primary" onClick={onNextStep} loading={loading}>
            我已完成，下一步
          </Button>
        </>
      )}
    </div>
  );
};

const StepConnectDevice: StepSubTitle = ({ stepIndex }) => {
  return (
    <div className="mb-5">
      {stepIndex > StepEnum.Device ? (
        '已完成'
      ) : (
        <div className="flex">
          <div className="flex-1 mr-2">
            将您的的 Leap Motion
            设备连接到此电脑并稍候一段时间，当我们检测到设备连接时，会自动进行到下一步。
            如果长时间没有进行到下一步，请检查是否暂停了设备跟踪。
          </div>
          <img
            src={picResumeTracking}
            width="100px"
            alt="勾选“允许Web应用程序”"
            className="mb-3"
          />
        </div>
      )}
    </div>
  );
};

const Guides: React.FC = () => {
  const { serviceConnected, deviceStreaming } = useLeapController((model) => [
    model.serviceConnected,
    model.deviceStreaming,
  ]);
  const [stepIndex, { set }] = useCounter(
    StepEnum.Install,
    StepEnum.Finish,
    StepEnum.Install
  );

  useEffect(() => {
    if (deviceStreaming) {
      set(StepEnum.Finish);
    } else if (serviceConnected) {
      set(StepEnum.Device);
    } else {
      set(StepEnum.Install);
    }
  }, [serviceConnected, deviceStreaming, set]);

  return (
    <Steps direction="vertical" current={stepIndex}>
      <Steps.Step
        title="启动 Leap Motion Controller 软件"
        subTitle={<StepInstallSoftware stepIndex={stepIndex} />}
      />
      <Steps.Step
        title="连接 Leap Motion 设备"
        subTitle={<StepConnectDevice stepIndex={stepIndex} />}
      />
      <Steps.Step title="完成连接" />
    </Steps>
  );
};

export const GuideModal: React.FC = () => {
  const { deviceStreaming, serviceConnected } = useLeapController();

  const [autoShowGuide, setAutoShowGuide] = useLocalStorage(
    'autoShowGuide',
    true
  );

  const [showGuide, setShowGuide] = useGuideShow();

  useDebounce(
    () => {
      if (autoShowGuide) {
        setShowGuide(!(deviceStreaming && serviceConnected));
      }
    },
    1000,
    [!(deviceStreaming && serviceConnected), autoShowGuide]
  );

  return (
    <Modal
      visible={showGuide}
      closable={false}
      maskClosable={false}
      centered
      destroyOnClose
      title="设备连接引导"
      footer={
        <div>
          <Checkbox
            className="mr-3"
            checked={!autoShowGuide}
            onClick={() => setAutoShowGuide(!autoShowGuide)}
          >
            以后未连接时不再自动弹出
          </Checkbox>
          <Button onClick={() => setShowGuide(false)} type="primary" danger>
            关闭
          </Button>
        </div>
      }
    >
      <Guides />
    </Modal>
  );
};
