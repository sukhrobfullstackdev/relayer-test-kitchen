import { getMagicAdminInstance } from '@/lib/magic-admin';
import { type NextApiRequest, type NextApiResponse } from 'next';

const mAdmin = getMagicAdminInstance();

export default async function validate(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const didToken = mAdmin.utils.parseAuthorizationHeader(
      req.headers.authorization!,
    );

    await mAdmin.token.validate(didToken);
    res.status(200).json({ authenticated: true });
  } catch (error: any) {
    res.status(500).json({ error: error.data[0] });
  }
}
