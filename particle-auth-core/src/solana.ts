import { ParticleAuthCorePlugin } from './index';
import type { CommonResp, SignData } from './Models';

export async function getAddress(): Promise<string> {
  return await ParticleAuthCorePlugin.solanaGetAddress();
}

export async function signMessage(
  message: string
): Promise<CommonResp<SignData>> {
  return new Promise((resolve) => {
    ParticleAuthCorePlugin.solanaSignMessage(message, (result: string) => {
      resolve(JSON.parse(result));
    });
  });
}

export async function signTransaction(
  transaction: string
): Promise<CommonResp<SignData>> {
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
): Promise<CommonResp<SignData>> {
  const json = JSON.stringify(transactions);
  return new Promise((resolve) => {
    ParticleAuthCorePlugin.solanaSignAllTransactions(json, (result: string) => {
      resolve(JSON.parse(result));
    });
  });
}

export async function signAndSendTransaction(
  transaction: string
): Promise<CommonResp<SignData>> {
  return new Promise((resolve) => {
    ParticleAuthCorePlugin.solanaSignAndSendTransaction(
      transaction,
      (result: string) => {
        resolve(JSON.parse(result));
      }
    );
  });
}
