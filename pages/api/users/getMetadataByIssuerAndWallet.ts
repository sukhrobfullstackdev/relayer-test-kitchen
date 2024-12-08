import { getMagicAdminInstance } from '@/lib/magic-admin';
import { WalletType } from '@magic-sdk/admin';
import { type NextApiRequest, type NextApiResponse } from 'next';

const mAdmin = getMagicAdminInstance();

export default async function getMetadataByIssuerAndWallet(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { issuer } = req.body;

    const metadata = await mAdmin.users.getMetadataByIssuerAndWallet(
      issuer,
      WalletType.ANY,
    );
    res.status(200).json({ metadata });
  } catch (error: any) {
    res.status(500).json({ error: error.data[0] });
  }
}
