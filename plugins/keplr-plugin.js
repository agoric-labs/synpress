const helpers = require('../helpers');
const playwright = require('../commands/playwright-keplr');
const keplr = require('../commands/keplr');

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  on('before:browser:launch', async (browser = {}, arguments_) => {
    if (browser.name === 'chrome') {
      // metamask welcome screen blocks cypress from loading
      arguments_.args.push(
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
      );
      if (process.env.CI) {
        // Avoid: "dri3 extension not supported" error
        arguments_.args.push('--disable-gpu');
      }
      if (process.env.HEADLESS_MODE) {
        arguments_.args.push('--headless=new');
      }
      if (browser.isHeadless) {
        arguments_.args.push('--window-size=1920,1080');
      }
    }

    if (!process.env.SKIP_KEPLR_INSTALL) {
      // NOTE: extensions cannot be loaded in headless Chrome
      const keplrPath = await helpers.prepareExtension(
        process.env.KEPLR_VERSION || '0.12.68',
        process.env.EXTENSION,
      );
      arguments_.extensions.push(keplrPath);
    }

    return arguments_;
  });

  on('task', {
    error(message) {
      console.error('\u001B[31m', 'ERROR:', message, '\u001B[0m');
      return true;
    },
    warn(message) {
      console.warn('\u001B[33m', 'WARNING:', message, '\u001B[0m');
      return true;
    },
    info(message) {
      console.log('\u001B[36m', 'INFO:', message, '\u001B[0m');
      return true;
    },

    async execute(command) {
      return new Promise((resolve, reject) => {
        const { exec } = require('child_process');
        try {
          exec(command, (error, stdout, stderr) => {
            if (error) {
              reject(error);
            } else {
              resolve({ stdout, stderr });
            }
          });
        } catch (e) {
          reject(e);
        }
      });
    },

    // playwright commands for Keplr
    initPlaywright: playwright.init,
    assignWindows: playwright.assignWindows,
    assignActiveTabName: playwright.assignActiveTabName,
    isExtensionWindowActive: playwright.isKeplrWindowActive,
    switchToCypressWindow: playwright.switchToCypressWindow,
    clearPlaywright: playwright.clear,
    clearWindows: playwright.clearWindows,
    isCypressWindowActive: playwright.isCypressWindowActive,
    switchToExtensionWindow: playwright.switchToKeplrWindow,
    switchToExtensionRegistrationWindow:
      playwright.switchToKeplrRegistrationWindow,
    switchToExtensionPermissionWindow: playwright.switchToKeplrPermissionWindow,

    // keplr commands
    importWallet: keplr.importWallet,
    acceptAccess: keplr.acceptAccess,
    acceptAccessWithoutWaitForEvent: keplr.acceptAccessWithoutWaitForEvent,
    rejectAccess: keplr.rejectAccess,
    getWalletAddress: keplr.getWalletAddress,
    confirmTransaction: keplr.confirmTransaction,
    rejectTransaction: keplr.rejectTransaction,
    disconnectWalletFromDapp: keplr.disconnectWalletFromDapp,
    setupWallet: async ({
      secretWordsOrPrivateKey,
      password,
      walletName,
      selectedChains,
      createNewWallet,
    }) => {
      await keplr.initialSetup(null, {
        secretWordsOrPrivateKey,
        password,
        walletName,
        selectedChains,
        createNewWallet,
      });
      return true;
    },
    switchWallet: keplr.switchWallet,
    addNewTokensFound: keplr.addNewTokensFound,
    getTokenAmount: keplr.getTokenAmount,
  });

  return config;
};
