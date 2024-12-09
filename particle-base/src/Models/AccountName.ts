export class AccountName {
    public name: string;
    public version: string;

    constructor(name: string, version: string) {
        this.name = name;
        this.version = version;
    }

    static BICONOMY_V1(): AccountName {
        return new AccountName('BICONOMY', '1.0.0');
    }

    static BICONOMY_V2(): AccountName {
        return new AccountName('BICONOMY', '2.0.0');
    }

    static SIMPLE_V1(): AccountName {
        return new AccountName('SIMPLE', '1.0.0');
    }

    static SIMPLE_V2(): AccountName {
        return new AccountName('SIMPLE', '2.0.0');
    }

    static CYBERCONNECT(): AccountName {
        return new AccountName('CYBERCONNECT', '1.0.0');
    }
}