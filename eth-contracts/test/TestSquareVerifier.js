// define a variable to import the <Verifier> or <renamedVerifier> solidity contract generated by Zokrates
var verifier = artifacts.require('Verifier');
var json = require('./proof.json');

contract('verifier', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('Test verification with correct proof', function () {
        beforeEach(async function () {
            this.contract = await verifier.new({from: account_one});
        })

        it('correct proof', async function () {
          let result = await this.contract.verifyTx.call(json.proof.a,
            json.proof.b,
            json.proof.c,
            json.inputs);
          assert.equal(result,true,"proof is invalid")
        })


    });

    describe('Test verification with incorrect proof', function () {
        beforeEach(async function () {
            this.contract = await verifier.new({from: account_one});
        })

        it('incorrect proof', async function () {



          let result = await this.contract.verifyTx.call(json.proof.a,
            json.proof.b,
            json.proof.c
            , [0,9]);
          assert.equal(result,false,"proof is invalied")

        });
    });

})