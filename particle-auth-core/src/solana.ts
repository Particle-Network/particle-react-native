import { ParticleAuthCorePlugin } from './index';
import type { CommonResp } from './Models';

export async function getAddress(): Promise<string> {
  return await ParticleAuthCorePlugin.solanaGetAddress();
}

export async function signMessage(
  message: string
): Promise<CommonResp<string>> {
  return new Promise((resolve) => {
    ParticleAuthCorePlugin.solanaSignMessage(message, (result: string) => {
      resolve(JSON.parse(result));
    });
  });
}

export async function signTransaction(
  transaction: string
): Promise<CommonResp<string>> {
  return new Promise((resolve) => {
    ParticleAuthCorePlugin.solanaSignTransaction(
      transaction,
      (result: string) => {
        resolve(JSON.parse(result));
      }
    );
  });
}

export async function signAllTransactions(
  transactions: string[]
): Promise<CommonResp<string>> {
  const json = JSON.stringify(transactions);
  return new Promise((resolve) => {
    ParticleAuthCorePlugin.solanaSignAllTransactions(json, (result: string) => {
      resolve(JSON.parse(result));
    });
  });
}

export async function signAndSendTransaction(
  transaction: string
): Promise<CommonResp<string>> {
  return new Promise((resolve) => {
    ParticleAuthCorePlugin.solanaSignAndSendTransaction(
      transaction,
      (result: string) => {
        resolve(JSON.parse(result));
      }
    );
  });
}
