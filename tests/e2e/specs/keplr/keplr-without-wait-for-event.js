/* eslint-disable ui-testing/no-disabled-tests */

before(() => {
  cy.setupWallet({
    createNewWallet: true,
    walletName: 'New Test Wallet',
  }).then(setupFinished => {
    expect(setupFinished).to.be.true;
  });
});

describe('Keplr', () => {
  context('Test new commands', () => {
    it(`should accept connection with wallet with "acceptAccessWithoutWaitForEvent"`, () => {
      cy.visit('/');
      cy.contains('Connect Wallet').click();
      cy.acceptAccessWithoutWaitForEvent().then(taskCompleted => {
        expect(taskCompleted).to.be.true;
      });
      cy.contains('Make an Offer').should('exist');
    });
  });
});
