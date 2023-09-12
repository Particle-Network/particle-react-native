export class RpcUrl {
  evm_url?: string | null;
  sol_url?: string | null;

  constructor(evm_url?: string | null, sol_url?: string | null) {
    this.evm_url = evm_url;
    this.sol_url = sol_url;
  }
}
