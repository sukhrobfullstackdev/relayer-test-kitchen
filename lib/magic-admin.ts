'use server';

import { Magic } from '@magic-sdk/admin';

export const getMagicAdminInstance = () => {
  return new Magic(process.env.MAGIC_SECRET_KEY);
};
