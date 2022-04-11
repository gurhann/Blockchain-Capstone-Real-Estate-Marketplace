// Test if a new solution can be added for contract - SolnSquareVerifier

// Test if an ERC721 token can be minted for contract - SolnSquareVerifier
const SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
const Verifier = artifacts.require('Verifier');
const truffleAssert = require("truffle-assertions");
var proofJson = require('./proof.json');

contract('TestSolnSquareVerifier', accounts => {
  describe('can verify soultion and mint token', () => {
    const account_one = accounts[0];
    const account_two = accounts[1];
    let verifier;
    let solnSquareVerifier;

    beforeEach(async () => {
      verifier = await Verifier.new({ from: account_one });
      solnSquareVerifier = await SolnSquareVerifier.new(verifier.address,"GK_ERC721Mintable", "GK_721M", {from: account_one});
    });
    it('can add a new solution', async () => {
      const { proof: { a, b, c }, inputs: input } = proofJson;
      let key = await solnSquareVerifier.generateKey.call(a, b, c, input);
      console.log("key", key);
      let result = await solnSquareVerifier.addSolution(1, account_two, key);

      assert.equal(result.logs[0].event, 'SolutionAdded', "Error: no event emitted.");
    });
    it("can mint an ERC721 token", async() => {

      const { proof: { a, b, c }, inputs: input } = proofJson;

      let supplyBefore = (await solnSquareVerifier.totalSupply.call()).toNumber();

      await solnSquareVerifier.mintToken(account_two, 2, a, b, c, input, {from: account_one});

      let supplyAfter = (await solnSquareVerifier.totalSupply.call()).toNumber();
      let difference = supplyAfter - supplyBefore;

      assert.equal(difference, 1, "Error: an ERC721 token cannot be minted for contract - SolnSquareVerifier");
    });
  });
});