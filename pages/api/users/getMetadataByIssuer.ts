import { getMagicAdminInstance } from '@/lib/magic-admin';
import { type NextApiRequest, type NextApiResponse } from 'next';

const mAdmin = getMagicAdminInstance();

export default async function getMetadataByIssuer(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { issuer } = req.body;

    const metadata = await mAdmin.users.getMetadataByIssuer(issuer);
    res.status(200).json({ metadata });
  } catch (error: any) {
    res.status(500).json({ error: error.data[0] });
  }
}
