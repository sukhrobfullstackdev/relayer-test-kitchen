import { getMagicAdminInstance } from '@/lib/magic-admin';
import { type NextApiRequest, type NextApiResponse } from 'next';

const mAdmin = getMagicAdminInstance();

export default async function logoutByIssuer(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { issuer } = req.body;

    await mAdmin.users.logoutByIssuer(issuer);
    res.status(200).json({ message: 'Logout successful.' });
  } catch (error: any) {
    res.status(500).json({ error: error.data[0] });
  }
}
