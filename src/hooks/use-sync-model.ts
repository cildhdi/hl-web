import { createModel } from 'hox';
import { useEffect } from 'react';
import { useDeepCompareEffect, useMap, useThrottle } from 'react-use';

import { useSocketIo } from './use-socket-io';

interface SyncModel {
  collect: boolean;
  count: number; // 用于同步测试
}

const initSyncModel: SyncModel = {
  collect: false,
  count: 0,
};

export const useSyncModel = createModel(() => {
  const [syncModel, syncModelActions] = useMap<SyncModel>(initSyncModel);
  const { socket } = useSocketIo();

  const throttledSyncModel = useThrottle(syncModel, 1000);

  useDeepCompareEffect(() => {
    useSocketIo.data?.socket?.emit('hl_event', throttledSyncModel);
    console.log('[syncModel] emit', throttledSyncModel);
  }, [throttledSyncModel]);

  useEffect(() => {
    socket?.on('hl_event', (data) => {
      console.log('[syncModel] receive', data);
      syncModelActions.setAll(data);
    });
    socket?.on('hl_client_enter', () => {
      useSocketIo.data?.socket?.emit('hl_event', useSyncModel.data?.syncModel);
      console.log('[syncModel] new client emit', useSyncModel.data?.syncModel);
    });
  }, [socket]); //eslint-disable-line react-hooks/exhaustive-deps

  return { syncModel, syncModelActions };
});
