import { Buffer } from 'buffer';
import type { CommonResp, CommonError } from './Models';
import { ParticleAuthCorePlugin } from './index';
// import { AAFeeMode } from '@particle-network/rn-base';
import { AAFeeMode } from '@particle-network/rn-base';
export async function getAddress(): Promise<string> {
  return await ParticleAuthCorePlugin.evmGetAddress();
}

export function personalSign(message: string): Promise<string> {
  let serializedMessage: string;
  if (isHexString(message)) {
    serializedMessage = message;
  } else {
    serializedMessage = '0x' + Buffer.from(message).toString('hex');
  }

  return new Promise((resolve, reject) => {
    ParticleAuthCorePlugin.evmPersonalSign(serializedMessage, (result: string) => {
      const parsedResult: CommonResp<string> = JSON.parse(result);
      if (parsedResult.status) {
        resolve(parsedResult.data as string);
      } else {
        reject(parsedResult.data as CommonError);
      }
    });
  });
}

export function personalSignUnique(
  message: string
): Promise<string> {
  let serializedMessage: string;

  if (isHexString(message)) {
    serializedMessage = message;
  } else {
    serializedMessage = '0x' + Buffer.from(message).toString('hex');
  }

  return new Promise((resolve, reject) => {
    ParticleAuthCorePlugin.evmPersonalSignUnique(serializedMessage, (result: string) => {
      const parsedResult: CommonResp<string> = JSON.parse(result);
      if (parsedResult.status) {
        resolve(parsedResult.data as string);
      } else {
        reject(parsedResult.data as CommonError);
      }
    });
  });
}

export function signTypedData(message: string): Promise<string> {
  let serializedMessage: string;

  if (isHexString(message)) {
    serializedMessage = message;
  } else {
    serializedMessage = '0x' + Buffer.from(message).toString('hex');
  }

  return new Promise((resolve, reject) => {
    ParticleAuthCorePlugin.evmSignTypedData(serializedMessage, (result: string) => {
      const parsedResult: CommonResp<string> = JSON.parse(result);
      if (parsedResult.status) {
        resolve(parsedResult.data as string);
      } else {
        reject(parsedResult.data as CommonError);
      }
    }
    );
  });
}

export function signTypedDataUnique(
  message: string
): Promise<string> {
  let serializedMessage: string;

  if (isHexString(message)) {
    serializedMessage = message;
  } else {
    serializedMessage = '0x' + Buffer.from(message).toString('hex');
  }

  return new Promise((resolve, reject) => {
    ParticleAuthCorePlugin.evmSignTypedDataUnique(serializedMessage, (result: string) => {
      const parsedResult: CommonResp<string> = JSON.parse(result);
      if (parsedResult.status) {
        resolve(parsedResult.data as string);
      } else {
        reject(parsedResult.data as CommonError);
      }
    });
  });
}

export function sendTransaction(transaction: string, feeMode?: AAFeeMode): Promise<string> {
  let obj;
  if (feeMode) {
    obj = {
      transaction: transaction,
      fee_mode: {
        option: feeMode?.getOption(),
        fee_quote: feeMode?.getFeeQuote(),
        token_paymaster_address: feeMode?.getTokenPaymasterAddress(),
        whole_fee_quote: feeMode?.getWholeFeeQuote(),
      },
    };
  } else {
    obj = {
      transaction: transaction,
    };
  }
  const json = JSON.stringify(obj);
  return new Promise((resolve, reject) => {
    ParticleAuthCorePlugin.evmSendTransaction(json, (result: string) => {
      const parsedResult: CommonResp<string> = JSON.parse(result);
      if (parsedResult.status) {
        resolve(parsedResult.data as string);
      } else {
        reject(parsedResult.data as CommonError);
      }
    });
  });
}

/**
 * Batch send transactions, works with particle aa service
 * @param transactions Transactions that you want user to sign and send
 * @param feeMode Optional, default is native
 * @returns Result, signature or error
 */
export async function batchSendTransactions(transactions: string[], feeMode?: AAFeeMode): Promise<string> {
  const obj = {
    transactions: transactions,
    fee_mode: {
      option: feeMode?.getOption(),
      fee_quote: feeMode?.getFeeQuote(),
      token_paymaster_address: feeMode?.getTokenPaymasterAddress(),
      whole_fee_quote: feeMode?.getWholeFeeQuote(),
    },
  };
  const json = JSON.stringify(obj);
  return new Promise((resolve, reject) => {
    ParticleAuthCorePlugin.evmBatchSendTransactions(json, (result: string) => {
      const parsedResult: CommonResp<string> = JSON.parse(result);
      if (parsedResult.status) {
        resolve(parsedResult.data as string);
      } else {
        reject(parsedResult.data as CommonError);
      }
    });
  });
}


function isHexString(str: string): boolean {
  const regex = /^0x[0-9a-fA-F]*$/;
  return regex.test(str);
}
