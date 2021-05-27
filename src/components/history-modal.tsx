import { Button, Modal, Table, TableColumnType } from 'antd';
import React from 'react';
import { useToggle } from 'react-use';

import { RecoHistoryItem, useRecoHistory } from '../hooks/use-reco-history';

const columns: TableColumnType<RecoHistoryItem>[] = [
  {
    title: '识别结果',
    dataIndex: 'result',
  },
  {
    title: '时间',
    dataIndex: 'timestamp',
  },
];

export const HistoryModal: React.FC = () => {
  const [visible, toggleVisible] = useToggle(false);
  const { history } = useRecoHistory((model) => [model.history]);

  return (
    <>
      <Button onClick={toggleVisible}>历史</Button>
      <Modal
        visible={visible}
        title="识别记录"
        footer={null}
        onCancel={toggleVisible}
      >
        <Table
          dataSource={history}
          columns={columns}
          rowKey="timestamp"
          pagination={{
            pageSize: 6,
          }}
        />
      </Modal>
    </>
  );
};
