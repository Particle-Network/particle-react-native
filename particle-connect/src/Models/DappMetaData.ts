/**
 * Dapp meta data
 */
export class DappMetaData {
  walletConnectProjectId: string;
  url: string;
  icon: string;
  name: string;
  description: string;
  redirect: string;
  verifyUrl: string;

  /**
   *
   * @param url Dapp website url
   * @param icon Dapp icon url
   * @param name Dapp name
   * @param description Dapp description
   */
  constructor(
    walletConnectProjectId: string,
    url: string,
    icon: string,
    name: string,
    description: string,
    redirect: string,
    verifyUrl: string
  ) {
    this.walletConnectProjectId = walletConnectProjectId;
    this.url = url;
    this.icon = icon;
    this.name = name;
    this.description = description;
    this.redirect = redirect;
    this.verifyUrl = verifyUrl;
  }
}
