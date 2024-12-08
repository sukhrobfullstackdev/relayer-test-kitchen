import { type MethodConfig } from '@/components/method-group/method-group';
import { getMagicInstance } from '@/lib/magic';

export const groupName = 'NFT';
export const methods: MethodConfig[] = [
  {
    name: 'Purchase',
    description: 'Initiates an NFT Purchase flow',
    args: [
      { name: 'Name', default: 'The NFT Name' },
      { name: 'Blockchain Nft Id', default: '149939960' },
      { name: 'Contract Address', default: '0xe269be5ac12bad24' },
      {
        name: 'Image Url',
        default:
          'https://cdn.shopify.com/s/files/1/0568/1132/3597/files/HWNFT_S4_modular-grid_584x800b.jpg?v=1669157307',
      },
      { name: 'Network', default: 'flow' },
      { name: 'Platform', default: 'mattel' },
      { name: 'Type', default: 'nft_secondary' },
      { name: 'First Name', default: 'fname' },
      { name: 'Last Name', default: 'lname' },
      { name: 'Date Of Birth', default: '2000-01-01' }, // YYYY-MM-DD
      { name: 'Email Address', default: 'foobar-low-risk@sardine.ai' },
      { name: 'Phone', default: '+19254485826' },
      { name: 'Street 1', default: '123 main st' },
      { name: 'Street 2', default: '' },
      { name: 'City', default: 'irvine' },
      { name: 'Region Code', default: 'CA' },
      { name: 'Postal Code', default: '02747' },
      { name: 'Country Code', default: 'US' },
    ],
    func: async (
      name: string,
      blockchainNftId: string,
      contractAddress: string,
      imageUrl: string,
      network: string,
      platform: string,
      type: string,
      firstName: string,
      lastName: string,
      dateOfBirth: string,
      emailAddress: string,
      phone: string,
      street1: string,
      street2: string,
      city: string,
      regionCode: string,
      postalCode: string,
      countryCode: string,
    ) => {
      try {
        const res = await getMagicInstance().nft.purchase({
          nft: {
            name,
            blockchainNftId,
            contractAddress,
            imageUrl,
            network,
            platform,
            type,
          },
          identityPrefill: {
            firstName,
            lastName,
            dateOfBirth,
            emailAddress,
            phone,
            address: {
              street1,
              street2,
              city,
              regionCode,
              postalCode,
              countryCode,
            },
          },
        });
        console.log(res);
      } catch (error) {
        console.log('NFT Purchase error: ', error);
      }
    },
  },
  {
    name: 'Checkout ⚠️ Sepolia and Production API Key Required',
    description: 'This method requires a Sepolia and Production API Key.',
    args: [
      {
        name: 'contractId',
        default: '1e719eaa-990e-41cf-b2e0-a4eb3d5d1312',
      },
      { name: 'tokenId', default: '2' },
      { name: 'name', default: 'Portal' },
      {
        name: 'imageUrl',
        default:
          'https://nft-cdn.alchemy.com/matic-mumbai/5d55353a3f95997ce7b33bc08c6832ed',
      },
      { name: 'quantity', default: 1 },
      {
        name: 'walletAddress',
        default: '',
      },
    ],
    func: async (
      contractId: string,
      tokenId: string,
      name: string,
      imageUrl: string,
      quantity: number,
      walletAddress: string,
    ) => {
      try {
        const res = await getMagicInstance().nft.checkout({
          contractId,
          tokenId,
          name,
          imageUrl,
          quantity,
          walletAddress,
          isCryptoCheckoutEnabled: true,
        });
        console.log(res);
      } catch (error) {
        console.log('NFT Purchase error: ', error);
      }
    },
  },
  {
    name: 'Transfer ⚠️ Sepolia and Production API Key Required',
    description: 'This method transfers an NFT to a recipient.',
    args: [
      {
        name: 'contractAddress',
        default: '0xe7445861c5e532cad5101e81caeb61830727dc58',
      },
      { name: 'tokenId', default: '2' },
      { name: 'quantity', default: 1 },
      {
        name: 'recipient',
        default: '',
      },
    ],
    func: async (
      contractAddress: string,
      tokenId: string,
      quantity: number,
      recipient: string,
    ) => {
      try {
        console.log('START');
        const res = await getMagicInstance().nft.transfer({
          contractAddress,
          tokenId,
          quantity,
          recipient,
        });
        console.log(res);
      } catch (error) {
        console.log('NFT Transfer error: ', error);
      }
    },
  },
];
