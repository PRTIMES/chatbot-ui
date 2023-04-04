import type { NextApiHandler } from 'next';

const handler = ((_, res) => {
  res
    .status(401)
    .setHeader('WWW-Authenticate', 'Basic realm="Secure"')
    .send('Basic Auth Required');
}) satisfies NextApiHandler;

export default handler;
