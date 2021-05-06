import fetch from 'node-fetch';

import { VercelRequest, VercelResponse } from '@vercel/node';

export default async (request: VercelRequest, response: VercelResponse) => {
  const body = JSON.parse(request.body ?? '{}');
  const proxyResponse = await fetch(body.addr, {
    body: request.body,
    method: 'post',
  });
  response.status(200).json(await proxyResponse.json());
};
