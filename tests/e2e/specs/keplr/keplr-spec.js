/* eslint-disable ui-testing/no-disabled-tests */

describe('Keplr', () => {
  context('Test commands', () => {
    it(`should create a new wallet using 24 word phrase`, () => {
      cy.setupWallet(
        'orbit bench unit task food shock brand bracket domain regular warfare company announce wheel grape trust sphere boy doctor half guard ritual three ecology',
        'Test1234',
        true,
        'My Wallet 2',
      ).then(setupFinished => {
        expect(setupFinished).to.be.true;
      });
    });
    it(`should reject connection with wallet`, () => {
      cy.visit('/');
      const alertShown = cy.stub().as('alertShown');
      cy.on('window:alert', alertShown);

      cy.contains('Connect Wallet').click();
      cy.rejectAccess().then(rejected => {
        expect(rejected).to.be.true;
      });
      cy.get('@alertShown').should(
        'have.been.calledOnceWith',
        'Request rejected',
      );
    });
    it(`should accept connection with wallet`, () => {
      cy.contains('Connect Wallet').click();
      cy.acceptAccess().then(taskCompleted => {
        expect(taskCompleted).to.be.true;
      });
    });
    it(`should reject make an offer transaction`, () => {
      const alertShown = cy.stub().as('alertShown');
      cy.on('window:alert', alertShown);

      cy.contains('Make an Offer').click();
      cy.rejectTransaction().then(taskCompleted => {
        expect(taskCompleted).to.be.true;
      });

      cy.get('@alertShown').should(
        'have.been.calledOnceWith',
        'Offer error: Error: Request rejected',
      );
    });
    it(`should confirm make an offer transaction`, () => {
      const alertShown = cy.stub().as('alertShown');
      cy.on('window:alert', alertShown);

      cy.contains('Make an Offer').click();
      cy.confirmTransaction().then(taskCompleted => {
        expect(taskCompleted).to.be.true;
      });

      cy.get('@alertShown').should(
        'have.been.calledOnceWith',
        'Offer accepted',
      );
    });
    it(`should complete Keplr setup by importing an existing wallet using 24 word phrase`, () => {
      cy.setupWallet().then(setupFinished => {
        expect(setupFinished).to.be.true;
      });
    });
    it(`should complete Keplr setup by importing the wallet using private key`, () => {
      cy.setupWallet(
        'A9C09B6E4AF70DE1F1B621CB1AA66CFD0B4AA977E4C18497C49132DD9E579485',
        null,
        false,
        'My wallet 3',
      ).then(setupFinished => {
        expect(setupFinished).to.be.true;
      });
    });
    it(`should switch to new wallet by name`, () => {
      cy.switchWallet('My Wallet 2').then(taskCompleted => {
        expect(taskCompleted).to.be.true;
      });
      // TODO: Add some more robust check later
    });
    it(`should get the accurate values for the tokens in the wallet`, () => {
      cy.switchWallet('My Wallet').then(taskCompleted => {
        expect(taskCompleted).to.be.true;
      });
      cy.addNewTokensFound();
      cy.getTokenAmount('ATOM').then(tokenValue => {
        expect(tokenValue).to.equal(0);
      });
      cy.getTokenAmount('BLD').then(tokenValue => {
        expect(tokenValue).to.equal(331);
      });
    });
    it(`should disconnect the wallet from all the connected DAPPs`, () => {
      cy.disconnectWalletFromDapp().then(taskCompleted => {
        expect(taskCompleted).to.be.true;
      });
    });

    it(`should get wallet address`, () => {
      cy.getWalletAddress().then(walletAddress => {
        expect(walletAddress.length).to.be.equal(45);
      });
    });
  });
});
