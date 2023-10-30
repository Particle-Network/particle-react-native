export type OptionType = 'native' | 'gasless' | 'token';

export class AAFeeMode {
    private option: OptionType;
    private feeQuote?: any;
    private tokenPaymasterAddress?: string;
    private wholeFeeQuote?: any;

    constructor(option: OptionType, feeQuote?: any, tokenPaymasterAddress?: string, wholeFeeQuote?: any) {
        this.option = option;
        this.feeQuote = feeQuote;
        this.tokenPaymasterAddress = tokenPaymasterAddress;
        this.wholeFeeQuote = wholeFeeQuote;
    }

    getOption(): OptionType {
        return this.option;
    }

    getFeeQuote(): any {
        return this.feeQuote;
    }

    getTokenPaymasterAddress(): string | undefined {
        return this.tokenPaymasterAddress
    }

    getWholeFeeQuote(): string {
        return this.wholeFeeQuote
    }

    /**
     * Auto fee mode
     * @returns Auto fee mode, use native to pay gas fee.
     */
    static native(wholeFeeQuote?: any): AAFeeMode {
        return new AAFeeMode('native', null, undefined, wholeFeeQuote);
    }

    /**
     * Gasless fee mode
     * @returns Gasless fee mode, user dont need to pay gas fee.
     */
    static gasless(wholeFeeQuote?: any): AAFeeMode {
        return new AAFeeMode('gasless', null, undefined, wholeFeeQuote);
    }

    /**
     * Custom fee mode
     * @returns Custom fee mode, works with particle-aa rpcGetFeeQuotes method, pick one token or native to pay gas fee.
     */
    static token(feeQuote: any, tokenPaymasterAddress?: string): AAFeeMode {
        return new AAFeeMode('token', feeQuote, tokenPaymasterAddress, null);
    }
}
