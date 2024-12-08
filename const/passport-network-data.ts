import { type PassportNetworkOptionsFields } from '@/contexts/PassportNetworkOptionsContext';
import {
  baseSepolia,
  newtonSepolia,
  polygonAmoy,
  sepolia,
} from 'magic-passport/networks';
import { type Network } from 'magic-passport/types';

export type DefaultFieldValues = {
  [K in keyof PassportNetworkOptionsFields]: PassportNetworkOptionsFields[K] extends
    | string
    | number
    ? PassportNetworkOptionsFields[K][]
    : never;
};

export const PassportNetworkIdToData: {
  [networkId: number]: {
    networkOption: Network;
    name: string;
    defaultFieldValues: DefaultFieldValues;
  };
} = {
  11_155_111: {
    networkOption: sepolia,
    name: 'Eth Sepolia',
    defaultFieldValues: {
      recipientAddress: ['0x39E7c1330E83a429f7cF2a367A4c6E6eC6E86f1E'],
      senderAddress: ['0x70997970c51812dc3a010c7d01b50e0d17dc79c8'],
      tokenId: [123],
      contractUSDCAddress: ['0x2B56a3d102e392511d7aC7845429AD766984cA9b'],
      vishalStorageContractAddress: [
        '0x2B56a3d102e392511d7aC7845429AD766984cA9b',
      ],
      payableNFTAddress: ['0x96AFB0E4B43CcE09dFB95e97e5B43f51007e8Bb9'],
      nonPayableNFTAddress: ['0xC9cf8D1a5c4b03fdAc4BbbFf5Af8fa5ac4E7899E'],
    },
  },
  84532: {
    networkOption: baseSepolia,
    name: 'Base Sepolia',
    defaultFieldValues: {
      recipientAddress: ['0x39E7c1330E83a429f7cF2a367A4c6E6eC6E86f1E'],
      senderAddress: ['0x70997970c51812dc3a010c7d01b50e0d17dc79c8'],
      tokenId: [123],
      contractUSDCAddress: ['0x2B56a3d102e392511d7aC7845429AD766984cA9b'],
      vishalStorageContractAddress: [
        '0x54c1287bf98698fC409465557230B83eA3e5a3f2',
      ],
      payableNFTAddress: ['0x03c81e35E909855C32cCDb55bB5763976b70CA1c'],
      nonPayableNFTAddress: ['0x06fD8F382984545AFee974BeBA1FDd2468Df2987'],
    },
  },
  80002: {
    networkOption: polygonAmoy,
    name: 'Polygon Amoy',
    defaultFieldValues: {
      recipientAddress: [''],
      senderAddress: [''],
      tokenId: [123],
      contractUSDCAddress: ['0x2B56a3d102e392511d7aC7845429AD766984cA9b'],
      vishalStorageContractAddress: [''],
      payableNFTAddress: [''],
      nonPayableNFTAddress: [''],
    },
  },
  720380884: {
    networkOption: newtonSepolia,
    name: 'Newton Sepolia',
    defaultFieldValues: {
      recipientAddress: ['0x39E7c1330E83a429f7cF2a367A4c6E6eC6E86f1E'],
      senderAddress: ['0x70997970c51812dc3a010c7d01b50e0d17dc79c8'],
      tokenId: [123],
      contractUSDCAddress: ['0x2B56a3d102e392511d7aC7845429AD766984cA9b'],
      vishalStorageContractAddress: [''],
      payableNFTAddress: [''],
      nonPayableNFTAddress: [''],
    },
  },
};
