import { AuthRequiredMessageResponse } from '../../lib/core/index.ts';
import { send } from './send.ts';
import { Socket } from './socket.ts';

let authedSessions: number[] = [];

export const handleAuth = (
  socket: Socket,
  message: AuthRequiredMessageResponse,
  token: string,
  version: string,
  sessionNumber: number,
) => {
  socket.on('close', () => {
    authedSessions = [];
  });
  if (
    message.access_token === token &&
    !authedSessions.includes(sessionNumber)
  ) {
    send(socket, {
      type: 'auth_ok',
      ha_version: version,
    });
    authedSessions.push(sessionNumber);
  } else {
    send(socket, {
      type: 'auth_invalid',
      message: 'invalid password',
    });
    socket.close();
  }
};
