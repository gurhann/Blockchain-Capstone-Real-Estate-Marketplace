// migrating the appropriate contracts
var Verifier = artifacts.require("./Verifier.sol");
//var ERC721MintableComplete = artifacts.require("./ERC721MintableComplete.sol");
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");

module.exports = async (deployer) => {
  await deployer.deploy(Verifier);
  await deployer.deploy(SolnSquareVerifier, Verifier.address, "GK_ERC721Mintable", "GK_721M");
};

// var ERC721Mintable = artifacts.require("./ERC721Mintable.sol");
// module.exports = async(deployer) => {
//   await deployer.deploy(ERC721Mintable, "GK_ERC721Mintable", "GK_721M");
// };