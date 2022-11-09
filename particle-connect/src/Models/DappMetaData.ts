
/**
 * Dapp meta data
 */
 export class DappMetaData {
    url: string
    icon: string
    name: string

    /**
     * 
     * @param url Dapp website url
     * @param icon Dapp icon url
     * @param name Dapp name
     */
    constructor(url: string, icon: string, name: string) {
            this.url = url
            this.icon = icon
            this.name = name
        }
} 