import { getMagicAdminInstance } from '@/lib/magic-admin';
import { WalletType } from '@magic-sdk/admin';
import { type NextApiRequest, type NextApiResponse } from 'next';

const mAdmin = getMagicAdminInstance();

export default async function getMetadataByTokenAndWallet(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const didToken = mAdmin.utils.parseAuthorizationHeader(
      req.headers.authorization!,
    );

    const metadata = await mAdmin.users.getMetadataByTokenAndWallet(
      didToken,
      WalletType.ANY,
    );
    res.status(200).json({ metadata });
  } catch (error: any) {
    res.status(500).json({ error: error.data[0] });
  }
}
