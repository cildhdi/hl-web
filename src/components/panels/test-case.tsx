import { Button } from 'antd';
import React from 'react';
import { useToggle } from 'react-use';

import { TestsCasesModal } from '../test-cases';

export const TestCase: React.FC = () => {
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
