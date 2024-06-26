import { ParticleAuthCorePlugin } from './index';
import type { CommonError, CommonResp } from './Models';

export async function getAddress(): Promise<string> {
  return await ParticleAuthCorePlugin.solanaGetAddress();
}

export async function signMessage(
  message: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    ParticleAuthCorePlugin.solanaSignMessage(message, (result: string) => {
      const parsedResult: CommonResp<string> = JSON.parse(result);
      if (parsedResult.status) {
        resolve(parsedResult.data as string);
      } else {
        reject(parsedResult.data as CommonError);
      }
    });
  });
}

export async function signTransaction(
  transaction: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    ParticleAuthCorePlugin.solanaSignTransaction(transaction, (result: string) => {
      const parsedResult: CommonResp<string> = JSON.parse(result);
      if (parsedResult.status) {
        resolve(parsedResult.data as string);
      } else {
        reject(parsedResult.data as CommonError);
      }
    });
  });
}

export async function signAllTransactions(
  transactions: string[]
): Promise<string[]> {
  const json = JSON.stringify(transactions);
  return new Promise((resolve, reject) => {
    ParticleAuthCorePlugin.solanaSignAllTransactions(json, (result: string) => {
      const parsedResult: CommonResp<string[]> = JSON.parse(result);
      if (parsedResult.status) {
        resolve(parsedResult.data as string[]);
      } else {
        reject(parsedResult.data as CommonError);
      }
    });
  });
}

export async function signAndSendTransaction(
  transaction: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    ParticleAuthCorePlugin.solanaSignAndSendTransaction(transaction, (result: string) => {
      const parsedResult: CommonResp<string> = JSON.parse(result);
      if (parsedResult.status) {
        resolve(parsedResult.data as string);
      } else {
        reject(parsedResult.data as CommonError);
      }
    });
  });
}
