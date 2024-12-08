import { getMagicAdminInstance } from '@/lib/magic-admin';
import { type NextApiRequest, type NextApiResponse } from 'next';

const mAdmin = getMagicAdminInstance();

export default async function logoutByToken(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const didToken = mAdmin.utils.parseAuthorizationHeader(
      req.headers.authorization!,
    );

    await mAdmin.users.logoutByToken(didToken);
    res.status(200).json({ message: 'Logout successful.' });
  } catch (error: any) {
    res.status(500).json({ error: error.data[0] });
  }
}
