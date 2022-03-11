import { NextApiRequest, NextApiResponse } from 'next';

// const IS_PROD = process.env.NODE_ENV === 'production';
const IS_PROD = true;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
): void {
  res.setPreviewData({});
  setCookieSameSite(res, 'None');
  res.end('Preview mode enabled');
}

const setCookieSameSite = (res: NextApiResponse, value: 'None') => {
  const cookies = res.getHeader('Set-Cookie') as string[];
  res.setHeader(
    'Set-Cookie',
    cookies?.map((cookie) =>
      cookie.replace(
        'SameSite=Lax',
        `SameSite=${value}; ${IS_PROD ? 'Secure;' : ''}`
      )
    )
  );
  console.log(res.getHeaders());
};
