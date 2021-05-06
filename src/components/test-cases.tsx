/** @jsxImportSource @emotion/react */

import { Button, List, message, Modal, Spin } from 'antd';
import { noop } from 'lodash-es';
import React, { useMemo, useState } from 'react';
import { useAsync, useAsyncFn } from 'react-use';

import { css } from '@emotion/react';

import { fetchTestCases, reco, TestItem } from '../util/service';

const ShowCase: React.FC<{ testCases: TestItem[] }> = ({ testCases }) => {
  const [selectedItem, setSelectedItem] = useState<TestItem>();
  const memoizedItem = useMemo(() => {
    if (!selectedItem) {
      return undefined;
    }
    return {
      shape: JSON.stringify(selectedItem.shape).substr(0, 1000) + '...',
      track: JSON.stringify(selectedItem.track).substr(0, 1000) + '...',
    };
  }, [selectedItem]);

  return (
    <div
      className="flex overflow-auto"
      css={css`
        height: 500px;
      `}
    >
      <div
        className="overflow-auto mr-2"
        css={css`
          width: 200px;
        `}
      >
        <List
          dataSource={testCases}
          renderItem={(item) => (
            <List.Item
              onClick={() => setSelectedItem(item)}
              className="hover:bg-gray-50 cursor-pointer"
            >
              <List.Item.Meta className="pl-2" title={item.label} />
            </List.Item>
          )}
        />
      </div>
      <div className="flex-1 overflow-auto pr-3">
        {memoizedItem && selectedItem ? (
          <List
            header={
              <div className="font-medium flex">
                <div className="flex-1">标签：{selectedItem.label}</div>
                <RunTestButton testItem={selectedItem} />
              </div>
            }
          >
            <List.Item>
              <List.Item.Meta title="Shape" description={memoizedItem.shape} />
            </List.Item>
            <List.Item>
              <List.Item.Meta title="Track" description={memoizedItem.track} />
            </List.Item>
          </List>
        ) : null}
      </div>
    </div>
  );
};

export const TestsCasesModal: React.FC<{
  visible?: boolean;
  onClose?: () => void;
}> = ({ visible, onClose = noop }) => {
  const { loading, error, value } = useAsync(fetchTestCases);

  return (
    <Modal
      title="测试用例"
      visible={visible}
      footer={null}
      onCancel={onClose}
      centered
      destroyOnClose
      width={600}
    >
      {loading || error ? (
        <div
          className="flex items-center justify-center"
          css={css`
            height: 500px;
          `}
        >
          <Spin tip="加载测试用例中..." />
        </div>
      ) : (
        value && <ShowCase testCases={value} />
      )}
    </Modal>
  );
};

const RunTestButton: React.FC<{ testItem: TestItem }> = ({ testItem }) => {
  const [{ loading }, runTest] = useAsyncFn(async () => {
    try {
      message.success((await reco(testItem)).data);
    } catch (error) {
      message.error('识别接口出错');
    }
  }, [testItem]);

  return (
    <Button type="primary" size="small" loading={loading} onClick={runTest}>
      执行此测试
    </Button>
  );
};
