import { createModel } from 'hox';
import { useCallback, useEffect, useState } from 'react';
import { useDeepCompareEffect } from 'react-use';

import { useEmit, useEvent } from './use-hl-event';
import { useSocketIo } from './use-socket-io';

interface SyncValue<T> {
  origin: 'local' | 'remote';
  value: T;
}

export const createSyncValue = <T>(name: string, defaultValue: T) => {
  const event = `sync_value_${name}`;
  const useSyncValue = createModel(() => {
    const [syncValue, setSyncValue] = useState<SyncValue<T>>({
      origin: 'remote',
      value: defaultValue,
    });

    useEvent(event, (payload: T) => {
      setSyncValue({
        origin: 'remote',
        value: payload,
      });
      console.log(`[sync] recive: ${name}`, payload);
    });

    const emitValue = useEmit();
    useDeepCompareEffect(() => {
      if (syncValue.origin === 'local') {
        emitValue(event, syncValue.value);
        console.log(`[sync] send: ${name}`, syncValue.value);
      }
    }, [syncValue]);

    const { socket } = useSocketIo();

    useEffect(() => {
      const listener = () => {
        emitValue(event, useSyncValue.data?.[0]);
        console.log(`[sync] new client emit: ${name}`, useSyncValue.data?.[0]);
      };
      socket?.on('hl_client_enter', listener);
      return () => {
        socket?.off('hl_client_enter', listener);
      };
    }, [socket, emitValue]);

    const value = syncValue.value;
    const setValue = useCallback((v: T) => {
      setSyncValue({
        origin: 'local',
        value: v,
      });
    }, []);

    return [value, setValue] as const;
  });
  return useSyncValue;
};

export const useSync = {
  Count: createSyncValue('Count', 0),
  StartStopDisabled: createSyncValue('StartStopDisabled', true),
  Collect: createSyncValue('Collect', false),
  Delay: createSyncValue('Delay', 2),
  UploadDisabled: createSyncValue('UploadDisabled', true),
};
