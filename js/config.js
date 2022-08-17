const CONTRACT_NAME = 'test.aricha.testnet'; // Account id where the HospBlock smart contract is deployed
const APP_NAME = 'HospBlock';

function getConfig(env) {
  switch (env) {
    case 'production':
    case 'mainnet':
      return {
        networkId: 'mainnet',
        nodeUrl: 'https://rpc.mainnet.near.org',
        keyStore: new nearApi.keyStores.BrowserLocalStorageKeyStore(),
        walletUrl: 'https://wallet.near.org',
        helperUrl: 'https://helper.mainnet.near.org',
        explorerUrl: 'https://explorer.mainnet.near.org',
      };
    case 'development':
    case 'testnet':
      return {
        networkId: 'testnet',
        nodeUrl: 'https://rpc.testnet.near.org',
        keyStore: new nearApi.keyStores.BrowserLocalStorageKeyStore(),
        walletUrl: 'https://wallet.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org',
        explorerUrl: 'https://explorer.testnet.near.org',
      };
    default:
      throw Error(
        `Unconfigured environment '${env}'. Can be configured in js/config.js.`
      );
  }
}
