
/**
   * Dapp meta data
   * @param url Dapp website url
   * @param icon Dapp icon url
   * @param name Dapp name
   * @param description Dapp description
   * @param redirect
   * @param verifyUrl
   */
export interface DappMetaData {
  url: string;
  icon: string;
  name: string;
  description: string;
  redirect?: string;
  verifyUrl?: string;
}
