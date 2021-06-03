import { createModel } from 'hox';
import { useCallback, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { v4 as uuid } from 'uuid';

import { ROOM_SERVER } from '../config';

const generateToken = () => `hld://${uuid()}`;

export const useSocketIo = createModel(() => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [token, setToken] = useState(generateToken);
  const [serverConnected, setServerConnected] = useState(false);
  const [clientConnected, setClientConnected] = useState(false);

  useEffect(() => {
    if (token) {
      setSocket((prevSocket) => {
        if (prevSocket?.connected) {
          prevSocket?.disconnect();
        }

        const nextSocket = io(ROOM_SERVER, {
          query: {
            token,
            ctype: 'device',
          },
          transports: ['websocket', 'polling'],
        });
        nextSocket.connect();

        setClientConnected(false);
        setServerConnected(false);

        nextSocket.on('connect', () => setServerConnected(true));
        nextSocket.on('disconnect', () => setServerConnected(false));
        nextSocket.on('hl_client_enter', () => setClientConnected(true));
        nextSocket.on('hl_client_leave', () => setClientConnected(false));

        return nextSocket;
      });
    }
  }, [token]);

  const refreshToken = useCallback(() => {
    setToken(generateToken());
  }, []);

  return { socket, token, clientConnected, serverConnected, refreshToken };
});
