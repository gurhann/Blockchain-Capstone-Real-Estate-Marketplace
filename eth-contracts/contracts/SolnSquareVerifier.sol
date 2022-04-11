// SPDX-License-Identifier: MIT
pragma experimental ABIEncoderV2;

import "./ERC721Mintable.sol";
import "./Verifier.sol";

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>


// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class

contract SolnSquareVerifier is ERC721Mintable {
    Verifier private verifierContract;

    constructor(
        address verifierAddress,
        string memory name,
        string memory symbol
    ) public ERC721Mintable(name, symbol) {
        verifierContract = Verifier(verifierAddress);
    }

    struct Solution{
        uint256 tokenId;
        address to;
    }

   // TODO define an array of the above struct
    Solution[] solutionsArray;

    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => Solution) solutions;


    // TODO Create an event to emit when a solution is added
    event SolutionAdded(uint256 tokenId, address to, bytes32 key);


    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution( uint256 _index, address _to, bytes32 _key) public {
        Solution memory solution = Solution(_index, _to);

        solutionsArray.push(solution);
        solutions[_key] = solution;

        emit SolutionAdded(_index, _to, _key );
    }


    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly
    function generateKey(uint[2] memory a,
        uint[2][2] memory b, uint[2] memory c,
        uint[2] memory inputs) pure public returns(bytes32) {
        return keccak256(abi.encodePacked(a, b, c, inputs));
    }

    function mintToken(address to, uint256 tokenId,
        uint[2] memory a, uint[2][2] memory b,
        uint[2] memory c, uint[2] memory inputs)
    whenNotPaused
    public
    {
        bytes32 key = generateKey(a, b, c, inputs);
        require(!_existSolution(key));
        require(verifierContract.verifyTx(a,b,c,inputs));
        addSolution(tokenId, to, key);
        mint(to, tokenId);
    }

    function _existSolution(bytes32 _key) internal returns(bool){
        address to = solutions[_key].to;
        return to != address(0);
    }
}
