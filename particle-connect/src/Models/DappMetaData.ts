
/**
 * Dapp meta data
 */
 export class DappMetaData {
    url: string
    icon: string
    name: string
    desctiption: string

    /**
     * 
     * @param url Dapp website url
     * @param icon Dapp icon url
     * @param name Dapp name
     * @param desctiption Dapp desctiption
     */
    constructor(url: string, icon: string, name: string, desctiption: string) {
            this.url = url
            this.icon = icon
            this.name = name
            this.desctiption = desctiption
        }
} 