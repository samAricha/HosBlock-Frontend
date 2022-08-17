const nearConfig = getConfig('development');

// Initialize contract & set global variables
(async function () {
  // Initialize connection to NEAR testnet
  window.near = await nearApi.connect(nearConfig);

  // Initializing Wallet based Account. It can work with NEAR testnet wallet that
  // is hosted at https://wallet.testnet.near.org
  window.walletConnection = new nearApi.WalletConnection(window.near);
  window.account = await walletConnection.account();

  // Initializing our contract APIs by contract name and configuration
  window.contract = new nearApi.Contract(
    window.account, // the account object that is connecting
    CONTRACT_NAME,
    {
      // name of contract you're connecting to
      viewMethods: [], // view methods do not change state but usually return a value
      changeMethods: ['add_record', 'read_record', 'delete_record'], // change methods modify state
      sender: window.account, // account object to initialize and sign transactions.
    }
  );
})(window);

/**
 * Checks if the user is logged in or not
 * @returns bool
 */
const isLoggedIn = () => {
  return window.walletConnection.isSignedIn();
};

/**
 * Returns the wallet address linked to our app
 */
const getAccount = () => {
  return window.walletConnection.getAccountId();
};

/**
 * Links wallet address to the web frontend
 */
const login = () => {
  // Allow the current app to make calls to the specified contract on the
  // user's behalf.
  // This works by creating a new access key for the user's account and storing
  // the private key in localStorage.
  if (!isLoggedIn()) {
    window.walletConnection.requestSignIn(
      CONTRACT_NAME, // smart contract requesting access
      APP_NAME // optional
    );
  } else {
    alert(`Already logged in as ${getAccount()}`);
  }
};

/**
 * Unlinks wallet addresses from our application
 */
const logout = () => {
  if (isLoggedIn()) {
    window.walletConnection.signOut();
    // Page redirect
    window.location.reload();
  } else {
    alert(`Already logged Out!`);
  }
};

/**
 * ====================================================================
 * Smart Contract Methods
 * ====================================================================
 */

const addRecord = async (diagnosis, hospital_name, medicine_administered, date_of_admission,
   date_of_release, allergies_recorded, price) => {
  if (isLoggedIn()) {
    const response = await window.contract.add_record(
      {
        diagnosis,
        hospital_name, 
        medicine_administered,
        date_of_admission,
        date_of_release, 
        allergies_recorded, 
        price
      },
      '3000000000000', // attached GAS (optional)
      '1000000000000000000000000' // attached deposit in yoctoNEAR (optional)
    );
    return response;
  }
  return null;
};

const readRecords = async (start, limit) => {
  if (isLoggedIn()) {
    const response = await window.contract.read_record({ start, limit });
    return response;
  }
  return [];
};

const deleteRecord = async (id) => {
  if (isLoggedIn()) {
    const response = await contract.delete_record({id});
    window.location.reload();
  }
  return null;
};
