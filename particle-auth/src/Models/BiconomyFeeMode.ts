export type OptionType = 'auto' | 'gasless' | 'custom';

export class BiconomyFeeMode {
    private option: OptionType;
    private feeQuote?: any;

    constructor(option: OptionType, feeQuote?: any) {
        this.option = option;
        this.feeQuote = feeQuote;
    }

    getOption(): OptionType {
        return this.option;
    }

    getFeeQuote(): any {
        return this.feeQuote;
    }

    /**
     * Auto fee mode
     * @returns Auto fee mode, use native to pay gas fee.
     */
    static auto(): BiconomyFeeMode {
        return new BiconomyFeeMode('auto');
    }

    /**
     * Gasless fee mode
     * @returns Gasless fee mode, user dont need to pay gas fee.
     */
    static gasless(): BiconomyFeeMode {
        return new BiconomyFeeMode('gasless');
    }

    /**
     * Custom fee mode
     * @returns Custom fee mode, works with particle-biconomy rpcGetFeeQuotes method, pick one token or native to pay gas fee.
     */
    static custom(feeQuote: any): BiconomyFeeMode {
        return new BiconomyFeeMode('custom', feeQuote);
    }
}
