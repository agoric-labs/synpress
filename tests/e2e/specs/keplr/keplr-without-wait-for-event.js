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
    it(`should accept connection with wallet with "acceptAccessWithoutWaitForEvent"`, () => {
      cy.contains('Connect Wallet').click();
      cy.acceptAccessWithoutWaitForEvent().then(taskCompleted => {
        expect(taskCompleted).to.be.true;
      });
      cy.contains('Make an Offer').should('exist');
    });
  });
});
