import { getMagicAdminInstance } from '@/lib/magic-admin';
import { type NextApiRequest, type NextApiResponse } from 'next';

const mAdmin = getMagicAdminInstance();

export default async function getMetadataByToken(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const didToken = mAdmin.utils.parseAuthorizationHeader(
      req.headers.authorization!,
    );

    const metadata = await mAdmin.users.getMetadataByToken(didToken);
    res.status(200).json({ metadata });
  } catch (error: any) {
    res.status(500).json({ error: error.data[0] });
  }
}
