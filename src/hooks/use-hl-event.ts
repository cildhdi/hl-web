import { useCallback, useEffect } from 'react';

import { useSocketIo } from './use-socket-io';

export const useEvent = (event: string, callback: (payload: any) => void) => {
  const { socket } = useSocketIo();

  useEffect(() => {
    const listener = (rawData?: any) => {
      if (rawData?.event === event) {
        callback(rawData.payload);
      }
    };
    socket?.on('hl_event', listener);
    return () => {
      socket?.off('hl_event', listener);
    };
  }, [socket, event, callback]);
};

export const useEmit = () => {
  const { socket } = useSocketIo();

  return useCallback(
    (event: string, payload?: any) =>
      socket?.emit('hl_event', {
        event,
        payload,
      }),
    [socket]
  );
};
