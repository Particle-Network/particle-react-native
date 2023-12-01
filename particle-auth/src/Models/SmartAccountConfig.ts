import { AccountName } from './AccountName';
import { VersionNumber } from './VersionNumber';

export class SmartAccountConfig {
    name: AccountName;
    version: VersionNumber;
    ownerAddress: string;

    constructor(name: AccountName, version: VersionNumber, ownerAddress: string) {
        this.name = name;
        this.version = version;
        this.ownerAddress = ownerAddress;
    }
}
