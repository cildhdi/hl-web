import { createModel } from 'hox';
import { useCallback, useEffect } from 'react';
import { useList, useLocalStorage, useUpdateEffect } from 'react-use';

import { framesToShapeTrack } from '../util/frame';

export interface RecoHistoryItem {
  result: string;
  param?: ReturnType<typeof framesToShapeTrack>;
  timestamp: string;
}

export const useRecoHistory = createModel(() => {
  const [history, historyActions] = useList<RecoHistoryItem>([]);
  const [storageHistory, setStorageHistory] = useLocalStorage<
    RecoHistoryItem[]
  >('recoHistoryItem', []);

  // 挂载时从存储读取
  useEffect(() => {
    if (storageHistory) {
      historyActions.set(storageHistory);
    }
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  // 后续更新时写入存储
  useUpdateEffect(() => {
    setStorageHistory(history);
  }, [history]);

  const addHistory = useCallback(
    (item: Omit<RecoHistoryItem, 'timestamp'>) => {
      historyActions.insertAt(
        0,
        Object.assign({}, item, { timestamp: new Date().toLocaleString() })
      );
    },
    [historyActions]
  );

  return { history, addHistory };
});
