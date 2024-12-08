import { ethers } from 'ethers';

export default function isEmpty(value: any): boolean {
  if (value === null || value === undefined) {
    return true;
  }
  if (typeof value === 'string' || Array.isArray(value)) {
    return value.length === 0;
  }
  if (value instanceof Map || value instanceof Set) {
    return value.size === 0;
  }
  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }
  return false;
}

export function toChecksumAddress(address: string | null): string | null {
  if (address === null) return null;
  let checksumAddress: string | null;

  try {
    checksumAddress = ethers.getAddress(address);
  } catch {
    checksumAddress = null;
  }

  return checksumAddress;
}

export function compareAddresses(addresses: (string | undefined)[]) {
  if (isEmpty(addresses)) return false;
  const checksums = addresses.map((addr) => toChecksumAddress(addr || '0x0'));
  return checksums.every((addr) => addr === checksums[0]);
}
