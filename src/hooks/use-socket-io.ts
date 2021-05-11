import { createModel } from 'hox';
import { useCallback, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { v4 as uuid } from 'uuid';

import { SERVER } from '../config';

const testRoom = 'test_room_id';

export const useSocketIo = createModel(() => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [token, setToken] = useState(() => testRoom);
  const [clientConnected, setClientConnected] = useState(false);

  useEffect(() => {
    if (token) {
      setSocket((prevSocket) => {
        if (prevSocket?.connected) {
          prevSocket?.disconnect();
        }

        const nextSocket = io(SERVER, {
          query: {
            token,
            ctype: 'device',
          },
          transports: ['websocket', 'polling'],
        });
        nextSocket.connect();

        setClientConnected(false);

        nextSocket.on('hl_client_enter', () => setClientConnected(true));
        nextSocket.on('hl_client_leave', () => setClientConnected(false));
        nextSocket.onAny(console.log);

        return nextSocket;
      });
    }
  }, [token]);

  const refreshToken = useCallback(() => {
    setToken(uuid());
  }, []);

  return { socket, token, clientConnected, refreshToken };
});
