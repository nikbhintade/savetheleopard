// const { assert } = require("chai");

const { assert } = require("chai");

const STL = artifacts.require('./Savetheleopard.sol');

require("chai")
    .use(require('chai-as-promised'))
    .should()

contract('STL contract\'s', (accounts)=> {
    let contract ;
    beforeEach(async () => {
        //contract = await STL.new();

        // this is creates new instnace every test
        contract = await STL.new();
    })
    describe('deployment', async()=> {
        it('is successful', async() => {
            
            const address = contract.address;
            assert.notEqual(address, '');
            assert.notEqual(address, 0x0);
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        })

        it('has a name', async () => {
            const name = await contract.name();
            assert.equal(name, "SaveTheLeopard");
        })
        
        it('has a symbol', async () => {
            const symbol = await contract.symbol();
            assert.equal(symbol, "SLT");
        })

    })
    describe('minting of NFT', async() => {
        it('creates a new token', async() => {
            const result = await contract.mint.sendTransaction(1, {from: accounts[0], value: 50000000000000000});
            const supply = await contract.totalSupply();

            //SUCCESS
            assert.equal(supply, 1);

            const event = result.logs[0].args;
            assert.equal(event.tokenId.toNumber(), 0, "id is correct");
            assert.equal(event.from, "0x0000000000000000000000000000000000000000");
            assert.equal(event.to, accounts[0]);
        })
        it('can\'t mint more than 10 tokens', async() => {
            let error;
            try {
                await contract.mint
                    .sendTransaction(20, 
                        {
                            from: accounts[0],
                            value: 1000000000000000000
                        })
            } catch (err){
                error = err;
            }
            assert.equal(
                error.reason,
                "no more than 10",
                "error should \"no more than 10\"")    
        })
        it('can\'t mint with Insufficient funds', async() => {
            let error;
            try {
                await contract.mint
                    .sendTransaction(9, 
                        {
                            from: accounts[0],
                            value: 50000000000000000
                        })
            } catch (err){
                error = err;
            }
            assert.equal(
                error.reason,
                "insufficient funds",
                "error should \"insufficient funds\"")    
        })

        it("and checking URI", async() => {
            await contract.mint.sendTransaction(1, {from: accounts[0], value: 50000000000000000});
            let URI = await contract.tokenURI(0);
            assert.equal(URI, "https://github.com/testRepo/0", "Didn't get correct URI")
        })
    });
})
