import { Buffer } from 'buffer';
import { ParticleAuthCorePlugin } from 'react-native-particle-auth-core';
import type { CommonResp, SignData } from './Models';

export async function getAddress(): Promise<string> {
  return await ParticleAuthCorePlugin.evmGetAddress();
}

export function personalSign(message: string): Promise<CommonResp<SignData>> {
  let serializedMessage: string;

  if (isHexString(message)) {
    serializedMessage = message;
  } else {
    serializedMessage = '0x' + Buffer.from(message).toString('hex');
  }

  return new Promise((resolve) => {
    ParticleAuthCorePlugin.evmPersonalSign(
      serializedMessage,
      (result: string) => {
        resolve(JSON.parse(result));
      }
    );
  });
}

export function personalSignUnique(
  message: string
): Promise<CommonResp<SignData>> {
  let serializedMessage: string;

  if (isHexString(message)) {
    serializedMessage = message;
  } else {
    serializedMessage = '0x' + Buffer.from(message).toString('hex');
  }

  return new Promise((resolve) => {
    ParticleAuthCorePlugin.evmPersonalSignUnique(
      serializedMessage,
      (result: string) => {
        resolve(JSON.parse(result));
      }
    );
  });
}

export function signTypedData(message: string): Promise<CommonResp<SignData>> {
  let serializedMessage: string;

  if (isHexString(message)) {
    serializedMessage = message;
  } else {
    serializedMessage = '0x' + Buffer.from(message).toString('hex');
  }

  return new Promise((resolve) => {
    ParticleAuthCorePlugin.evmSignTypedData(
      serializedMessage,
      (result: string) => {
        resolve(JSON.parse(result));
      }
    );
  });
}

export function signTypedDataUnique(
  message: string
): Promise<CommonResp<SignData>> {
  let serializedMessage: string;

  if (isHexString(message)) {
    serializedMessage = message;
  } else {
    serializedMessage = '0x' + Buffer.from(message).toString('hex');
  }

  return new Promise((resolve) => {
    ParticleAuthCorePlugin.evmSignTypedDataUnique(
      serializedMessage,
      (result: string) => {
        resolve(JSON.parse(result));
      }
    );
  });
}

export function sendTransaction(transaction: string): Promise<any> {
  return new Promise((resolve) => {
    ParticleAuthCorePlugin.evmSendTransaction(transaction, (result: string) => {
      resolve(JSON.parse(result));
    });
  });
}

function isHexString(str: string): boolean {
  const regex = /^0x[0-9a-fA-F]*$/;
  return regex.test(str);
}
