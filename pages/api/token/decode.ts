import { getMagicAdminInstance } from '@/lib/magic-admin';
import { type NextApiRequest, type NextApiResponse } from 'next';

const mAdmin = getMagicAdminInstance();

export default async function decode(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const didToken = mAdmin.utils.parseAuthorizationHeader(
      req.headers.authorization!,
    );

    const [proof, claim] = mAdmin.token.decode(didToken);
    res.status(200).json({ proof, claim });
  } catch (error: any) {
    res.status(500).json({ error: error.data[0] });
  }
}
