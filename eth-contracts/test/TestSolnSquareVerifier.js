// Test if a new solution can be added for contract - SolnSquareVerifier

// Test if an ERC721 token can be minted for contract - SolnSquareVerifier
const SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
const Verifier = artifacts.require('Verifier');
var proofJson = require('./proof.json');

contract('TestSolnSquareVerifier', accounts => {
  describe('verify soultion and mint token', () => {
    const first_account = accounts[0];
    const second_account = accounts[1];
    let verifier;
    let solnSquareVerifier;

    beforeEach(async () => {
      verifier = await Verifier.new({ from: first_account });
      solnSquareVerifier = await SolnSquareVerifier.new(verifier.address,"GK_ERC721Mintable", "GK_721M", {from: first_account});
    });
    it('can add a new solution', async () => {
      const { proof: { a, b, c }, inputs: input } = proofJson;
      let key = await solnSquareVerifier.generateKey.call(a, b, c, input);
      console.log("key", key);
      let result = await solnSquareVerifier.addSolution(1, second_account, key);

      assert.equal(result.logs[0].event, 'SolutionAdded', "no event emitted");
    });
    it("can mint an ERC721 token", async() => {

      const { proof: { a, b, c }, inputs: input } = proofJson;

      let supplyBefore = (await solnSquareVerifier.totalSupply.call()).toNumber();

      await solnSquareVerifier.mintToken(second_account, 2, a, b, c, input, {from: first_account});

      let supplyAfter = (await solnSquareVerifier.totalSupply.call()).toNumber();
      let difference = supplyAfter - supplyBefore;

      assert.equal(difference, 1, "token cannot be minted for contract");
    });
  });
});