export class RpcUrl {
    evm_url: string
    sol_url: string

    constructor(evm_url: string, sol_url: string) {
        this.evm_url = evm_url
        this.sol_url = sol_url
    }
}