import { SafeAccountConfig, SafeDeploymentConfig, SafeFactory } from '@pnsdomains/safe-core-sdk'
import EthersAdapter from '@pnsdomains/safe-ethers-lib'
import { ethers } from 'ethers'

// This file can be used to play around with the Safe Core SDK

interface Config {
  RPC_URL: string
  DEPLOYER_ADDRESS_PRIVATE_KEY: string
  DEPLOY_SAFE: {
    OWNERS: string[]
    THRESHOLD: number
    SALT_NONCE: string
  }
}

const config: Config = {
  RPC_URL: 'https://goerli.infura.io/v3/<INFURA_KEY>',
  DEPLOYER_ADDRESS_PRIVATE_KEY: '<DEPLOYER_PRIVATE_KEY>',
  DEPLOY_SAFE: {
    OWNERS: ['<OWNER_ADDRESS_1>', '<OWNER_ADDRESS_2>'],
    THRESHOLD: 1, // <SAFE_THRESHOLD>
    SALT_NONCE: '<SALT_NONCE_NUMBER>'
  }
}

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(config.RPC_URL)
  const deployerSigner = new ethers.Wallet(config.DEPLOYER_ADDRESS_PRIVATE_KEY, provider)

  // Create EthAdapter instance
  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: deployerSigner
  })

  // Create SafeFactory instance
  const safeFactory = await SafeFactory.create({ ethAdapter })

  // Config of the deployed Safe
  const safeAccountConfig: SafeAccountConfig = {
    owners: config.DEPLOY_SAFE.OWNERS,
    threshold: config.DEPLOY_SAFE.THRESHOLD
  }
  const safeDeploymentConfig: SafeDeploymentConfig = {
    saltNonce: config.DEPLOY_SAFE.SALT_NONCE
  }

  // Predict deployed address
  const predictedDeployAddress = await safeFactory.predictSafeAddress({
    safeAccountConfig,
    safeDeploymentConfig
  })

  function callback(txHash: string) {
    console.log('Transaction hash:', txHash)
  }

  // Deploy Safe
  const safe = await safeFactory.deploySafe({
    safeAccountConfig,
    safeDeploymentConfig,
    callback
  })

  console.log('Predicted deployed address:', predictedDeployAddress)
  console.log('Deployed Safe:', safe.getAddress())
}

main()
