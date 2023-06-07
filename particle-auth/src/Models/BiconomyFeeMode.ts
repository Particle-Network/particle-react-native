export interface BiconomyFeeMode {
    option: 'auto' | 'gasless' | 'custom';
    feeQuote?: any;
}

/**
 * Auto fee mode
 * @returns Auto fee mode, use native to pay gas fee.
 */
export function auto(): BiconomyFeeMode {
    return { option: 'auto' };
}

/**
 * Gasless fee mode
 * @returns Gasless fee mode, user dont need to pay gas fee.
 */
export function gasless(): BiconomyFeeMode {
    return { option: 'gasless' };
}

/**
 * Custom fee mode
 * @returns Custom fee mode, works with particle-biconomy rpcGetFeeQuotes method, pick one token or native to pay gas fee.
 */
export function custom(feeQuote: any): BiconomyFeeMode {
    return { option: 'custom', feeQuote };
}
