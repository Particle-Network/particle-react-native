import { Buffer } from 'buffer';
import type { CommonResp } from './Models';
import { ParticleAuthCorePlugin } from './index';
import { AAFeeMode } from '@particle-network/rn-auth';
export async function getAddress(): Promise<string> {
  return await ParticleAuthCorePlugin.evmGetAddress();
}

export function personalSign(message: string): Promise<CommonResp<string>> {
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
): Promise<CommonResp<string>> {
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

export function signTypedData(message: string): Promise<CommonResp<string>> {
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
): Promise<CommonResp<string>> {
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

export function sendTransaction(transaction: string, feeMode?: AAFeeMode): Promise<CommonResp<string>> {
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
  return new Promise((resolve) => {
    ParticleAuthCorePlugin.evmSendTransaction(json, (result: string) => {
      resolve(JSON.parse(result));
    });
  });
}

/**
 * Batch send transactions, works with particle aa service
 * @param transactions Transactions that you want user to sign and send
 * @param feeMode Optional, default is native
 * @returns Result, signature or error
 */
export async function batchSendTransactions(transactions: string[], feeMode?: AAFeeMode): Promise<CommonResp<string>> {
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
  return new Promise((resolve) => {
    ParticleAuthCorePlugin.evmBatchSendTransactions(json, (result: string) => {
      resolve(JSON.parse(result));
    });
  });
}


function isHexString(str: string): boolean {
  const regex = /^0x[0-9a-fA-F]*$/;
  return regex.test(str);
}
