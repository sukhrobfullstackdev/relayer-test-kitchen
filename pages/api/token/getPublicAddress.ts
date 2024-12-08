import { getMagicAdminInstance } from '@/lib/magic-admin';
import { type NextApiRequest, type NextApiResponse } from 'next';

const mAdmin = getMagicAdminInstance();

export default async function getPublicAddress(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const didToken = mAdmin.utils.parseAuthorizationHeader(
      req.headers.authorization!,
    );

    const publicAddress = mAdmin.token.getPublicAddress(didToken);
    res.status(200).json({ publicAddress });
  } catch (error: any) {
    res.status(500).json({ error: error.data[0] });
  }
}
