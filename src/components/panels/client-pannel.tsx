/** @jsxImportSource @emotion/react */

import { Alert, Button, Divider } from 'antd';
import QrCode from 'qrcode.react';
import React from 'react';

import { css } from '@emotion/react';

import { useSocketIo } from '../../hooks/use-socket-io';

export const ClientPannel: React.FC = () => {
  const { token, clientConnected, refreshToken } = useSocketIo();

  return (
    <>
      <div className="my-4">
        <Alert
          showIcon
          type={clientConnected ? 'success' : 'warning'}
          message={
            clientConnected ? (
              <span>
                客户端已连接
                <Button
                  type="link"
                  danger
                  onClick={refreshToken}
                  css={css`
                    height: initial;
                  `}
                  size="small"
                >
                  断开
                </Button>
              </span>
            ) : (
              '客户端未连接'
            )
          }
        />
      </div>
      {clientConnected ? null : (
        <div className="flex">
          <QrCode value={token} />
          <div className="font-light flex-1 ml-6">
            打开
            <Button type="link" className="p-0 m-0" size="small">
              客户端
            </Button>
            扫描左侧二维码，直接控制识别与接受识别结果。
          </div>
        </div>
      )}
      <Divider />
    </>
  );
};
