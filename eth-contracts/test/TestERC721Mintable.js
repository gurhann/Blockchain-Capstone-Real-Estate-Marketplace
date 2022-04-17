const truffleAssert = require('truffle-assertions');
const expect = require('chai').expect;


var ERC721Mintable = artifacts.require('ERC721Mintable');

contract('TestERC721Mintable', accounts => {

    const first_account = accounts[0];
    const second_account = accounts[1];
    const tokenAddress = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/";
    const emptyAddress = '0x0000000000000000000000000000000000000000';

    describe('match erc721 spec', function () {
        const tokens = [11, 22, 33, 44, 55, 66, 77, 88, 99, 101];
        beforeEach(async function () { 
            this.contract = await ERC721Mintable.new("GK_ERC721Mintable", "GK_721M", {from: first_account});
           
            // TODO: mint multiple tokens
            for (let i = 0; i < tokens.length - 1; i++) {
                await this.contract.mint(accounts[i + 1], tokens[i], {from: first_account});
            }
            await this.contract.mint(accounts[tokens.length -1], tokens[tokens.length-1], {from: first_account});
        })

        it('get totken balance should be correct', async function () { 
            const accountBalance = await this.contract.balanceOf(accounts[3]);
            expect(Number(accountBalance)).to.equal(1);
        })

        it('tokenAddress should be correct', async function () { 
            const expectedTokenAddress = await this.contract.tokenURI(tokens[3]); 
            expect(expectedTokenAddress).to.deep.equal(`${tokenAddress}${tokens[3]}`);

        })

        it('total suppy should be correct', async function () { 
            const totalSupply = await this.contract.totalSupply.call({from: accounts[9]});
            expect(Number(totalSupply)).to.equal(tokens.length);
        })

        it('trasfer can be done', async function () { 
            await this.contract.approve(accounts[6], tokens[3], {from: accounts[4]});
            let transaction = await this.contract.transferFrom(accounts[4], accounts[6], tokens[3], {from: accounts[6]});
            truffleAssert.eventEmitted(transaction, 'Transfer', (ev) => {
                return expect(ev.from).to.deep.equal(accounts[4]) 
                       && expect(ev.to).to.equal(accounts[6])
                       && expect(Number(ev.tokenId)).to.equal(tokens[3]);
            });

            expect(await this.contract.ownerOf(tokens[3])).to.equal(accounts[6]);
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721Mintable.new("GK_ERC721Mintable", "GK_721M", {from: first_account});
            currentOwner = first_account;
        })

        it('if address is not contract owner then should be fail', async function () { 
            await expectToRevert(this.contract.mint(second_account, 12, {from: second_account}), 'Caller is not the contract owner');
        })

        it('should return contract owner', async function () { 
            expect(await this.contract.owner({from: first_account})).to.equal(currentOwner); ;
        })

    });
})

const expectToRevert = (promise, errorMessage) => {
    return truffleAssert.reverts(promise, errorMessage);
};