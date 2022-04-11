const truffleAssert = require('truffle-assertions');
const expect = require('chai').expect;


var ERC721Mintable = artifacts.require('ERC721Mintable');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const baseTokenURI = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/";
    const zeroAddress = '0x0000000000000000000000000000000000000000';

    describe('match erc721 spec', function () {
        const tokensIds = [11, 22, 33, 44, 55, 66, 77, 88, 99, 101];
        beforeEach(async function () { 
            this.contract = await ERC721Mintable.new("GK_ERC721Mintable", "GK_721M", {from: account_one});
           
            // TODO: mint multiple tokens
            for (let i = 0; i < tokensIds.length - 1; i++) {
                await this.contract.mint(accounts[i + 1], tokensIds[i], {from: account_one});
            }
            await this.contract.mint(accounts[tokensIds.length -1], tokensIds[tokensIds.length-1], {from: account_one});
        })

        it('should return total supply', async function () { 
            const totalSupply = await this.contract.totalSupply.call({from: accounts[9]});
            expect(Number(totalSupply)).to.equal(tokensIds.length);
        })

        it('should get token balance', async function () { 
            const acc3Balance = await this.contract.balanceOf(accounts[3]);
            expect(Number(acc3Balance)).to.equal(1);

            const acc9Balance = await this.contract.balanceOf(accounts[9]);     
            expect(Number(acc9Balance)).to.equal(2);
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            const token3Uri = await this.contract.tokenURI(tokensIds[3]); 
            expect(token3Uri).to.deep.equal(`${baseTokenURI}${tokensIds[3]}`);
 
            const token6Uri = await this.contract.tokenURI(tokensIds[6]); 
            expect(token6Uri).to.deep.equal(`${baseTokenURI}${tokensIds[6]}`);
 
            const token9Uri = await this.contract.tokenURI(tokensIds[9]); 
            expect(token9Uri).to.deep.equal(`${baseTokenURI}${tokensIds[9]}`);
        })

        it('should transfer token from one owner to another', async function () { 
            await this.contract.approve(accounts[9], tokensIds[7], {from: accounts[8]});
            let tx = await this.contract.transferFrom(accounts[8], accounts[9], tokensIds[7], {from: accounts[9]});
            truffleAssert.eventEmitted(tx, 'Transfer', (ev) => {
                return expect(ev.from).to.deep.equal(accounts[8]) 
                       && expect(ev.to).to.equal(accounts[9])
                       && expect(Number(ev.tokenId)).to.equal(tokensIds[7]);
            });

            expect(await this.contract.ownerOf(tokensIds[7])).to.equal(accounts[9]);
            expect(Number(await this.contract.balanceOf(accounts[9]))).to.equal(3);
            expect(Number(await this.contract.balanceOf(accounts[8]))).to.equal(0);
            expect(await this.contract.getApproved(tokensIds[7])).to.equal(zeroAddress);
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721Mintable.new("GK_ERC721Mintable", "GK_721M", {from: account_one});
            currentOwner = account_one;
        })

        it('should fail when minting when address is not contract owner', async function () { 
            await expectToRevert(this.contract.mint(account_two, 12, {from: account_two}), 'Caller is not the contract owner');
        })

        it('should return contract owner', async function () { 
            expect(await this.contract.owner({from: account_one})).to.equal(currentOwner); ;
        })

    });
})

const expectToRevert = (promise, errorMessage) => {
    return truffleAssert.reverts(promise, errorMessage);
};