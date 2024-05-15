import { HardhatUserConfig } from 'hardhat/config.js';
import '@nomicfoundation/hardhat-ignition-ethers';
import '@nomicfoundation/hardhat-toolbox';


const config: HardhatUserConfig = {
  solidity: '0.8.24',
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.VITE_INFURA_API_KEY}`,
      accounts: [`${process.env.VITE_SEPOLIA_PRIVATE_KEY}`],
    },
  },
};

export default config;
