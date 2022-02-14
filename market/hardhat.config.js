require("@nomiclabs/hardhat-waffle");
const INFURA_PROJECT_ID = "3fc6eb8b74f641c6b291d3b0ece1b34e";
const fs = require("fs");
const PRIVATE_KEY  = fs.readFileSync('.secret').toString();

module.exports = {
  solidity: "0.8.4",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [`0x${PRIVATE_KEY}`],
    }
  }
};
