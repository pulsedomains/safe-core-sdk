import { CreateCallContract } from '@pnsdomains/safe-core-sdk-types'
import { Create_call as CreateCall_V1_3_0 } from '../../../typechain/src/web3-v1/v1.3.0/Create_call'
import { Web3TransactionOptions, Web3TransactionResult } from '../../types'
import { toTxResult } from '../../utils'

abstract class CreateCallWeb3Contract implements CreateCallContract {
  constructor(public contract: CreateCall_V1_3_0) {}

  getAddress(): string {
    return this.contract.options.address
  }

  async performCreate2(
    value: string,
    deploymentData: string,
    salt: string,
    options?: Web3TransactionOptions
  ): Promise<Web3TransactionResult> {
    if (options && !options.gas) {
      options.gas = await this.estimateGas('performCreate2', [value, deploymentData, salt], {
        ...options
      })
    }
    const txResponse = this.contract.methods
      .performCreate2(value, deploymentData, salt)
      .send(options)
    return toTxResult(txResponse, options)
  }

  async performCreate(
    value: string,
    deploymentData: string,
    options?: Web3TransactionOptions
  ): Promise<Web3TransactionResult> {
    if (options && !options.gas) {
      options.gas = await this.estimateGas('performCreate', [value, deploymentData], { ...options })
    }
    const txResponse = this.contract.methods.performCreate(value, deploymentData).send(options)
    return toTxResult(txResponse, options)
  }

  encode(methodName: string, params: any[]): string {
    return (this.contract as any).methods[methodName](...params).encodeABI()
  }

  async estimateGas(
    methodName: string,
    params: any[],
    options: Web3TransactionOptions
  ): Promise<number> {
    try {
      return Number(
        await (this.contract.methods as any)[methodName](...params).estimateGas(options)
      )
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

export default CreateCallWeb3Contract
