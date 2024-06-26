/* eslint-disable ui-testing/no-disabled-tests */

describe('Keplr', () => {
  context('Test commands', () => {
    const scriptsFolder = Cypress.config('bashScriptsFolder');
    it('Executes a command and verifies stdout and stderr', () => {
      const command = 'echo "Hello, stdout!" && echo "Error occurred" >&2';

      cy.execute(command).then(({ stdout, stderr, error }) => {
        expect(stdout.trim()).to.equal('Hello, stdout!');
        expect(stderr.trim()).to.equal('Error occurred');
        expect(error).to.be.undefined;
      });
    });

    it('Executes a commands from a file and verifies stdout and stderr', () => {
      const fileName = 'script.sh';

      cy.execute(`sh ${scriptsFolder}/${fileName}`).then(
        ({ stdout, stderr, error }) => {
          expect(stdout.trim()).to.equal('Hello, stdout!');
          expect(stderr.trim()).to.equal('Error occurred');
          expect(error).to.be.undefined;
        },
      );
    });

    it(`should create a brand new wallet`, () => {
      cy.setupWallet({
        createNewWallet: true,
        walletName: 'my created wallet',
      }).then(setupFinished => {
        expect(setupFinished).to.be.true;
      });
    });
    it(`should complete Keplr setup by  importing an existing wallet using 24 word phrase`, () => {
      cy.setupWallet().then(setupFinished => {
        expect(setupFinished).to.be.true;
      });
      cy.visit('/');
    });
    it(`should reject connection with wallet`, () => {
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
    it(`should import a wallet and add selected chains`, () => {
      cy.setupWallet({
        secretWords:
          'orbit bench unit task food shock brand bracket domain regular warfare company announce wheel grape trust sphere boy doctor half guard ritual three ecology',
        password: 'Test1234',
        walletName: 'My Wallet 2',
        selectedChains: ['Agoric localhost', 'Secret Network'],
      }).then(setupFinished => {
        expect(setupFinished).to.be.true;
      });
    });
    it(`should complete Keplr setup by importing the wallet using private key`, () => {
      cy.setupWallet({
        privateKey:
          'A9C09B6E4AF70DE1F1B621CB1AA66CFD0B4AA977E4C18497C49132DD9E579485',
        walletName: 'My wallet 3',
        selectedChains: ['Agoric localhost'],
      }).then(setupFinished => {
        expect(setupFinished).to.be.true;
      });
    });

    it(`should get wallet address while running addNewTokensFound flow`, () => {
      cy.getWalletAddress('Agoric localhost').then(walletAddress => {
        expect(walletAddress.length).to.be.equal(45);
      });

      cy.getWalletAddress('Cosmos Hub').then(walletAddress => {
        expect(walletAddress.length).to.be.equal(45);
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
    it(`should differntiate between keplrWindow and keplrNotificationWindow when they have the same URL`, () => {
      cy.getTokenAmount('ATOM').then(tokenValue => {
        expect(tokenValue).to.equal(0);
      });

      cy.contains('Make an Offer').click();
      cy.confirmTransaction().then(taskCompleted => {
        expect(taskCompleted).to.be.true;
      });
    });
    it(`should disconnect the wallet from all the connected DAPPs`, () => {
      cy.disconnectWalletFromDapp().then(taskCompleted => {
        expect(taskCompleted).to.be.true;
      });
    });

    it(`should get wallet address without running addNewTokensFound flow`, () => {
      cy.getWalletAddress('Agoric localhost').then(walletAddress => {
        expect(walletAddress.length).to.be.equal(45);
      });

      cy.getWalletAddress('Cosmos Hub').then(walletAddress => {
        expect(walletAddress.length).to.be.equal(45);
      });
    });
    it(`should create a brand new wallet without password input`, () => {
      cy.setupWallet({ createNewWallet: true }).then(setupFinished => {
        expect(setupFinished).to.be.true;
      });
    });
  });
});
