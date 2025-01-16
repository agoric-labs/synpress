const approveButton = `//button[div[contains(text(), 'Approve')]]`;
const copyAddress = 'Copy Address';
const walletSelectors = chainName => `img[alt="${chainName}"]`;

module.exports.notificationPageElements = {
  approveButton,
  copyAddress,
  walletSelectors,
};
