import { getMagicAdminInstance } from '@/lib/magic-admin';
import { type NextApiRequest, type NextApiResponse } from 'next';

const mAdmin = getMagicAdminInstance();

export default async function getMetadataByPublicAddress(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { publicAddress } = req.body;

    const metadata =
      await mAdmin.users.getMetadataByPublicAddress(publicAddress);
    res.status(200).json({ metadata });
  } catch (error: any) {
    res.status(500).json({ error: error.data[0] });
  }
}
