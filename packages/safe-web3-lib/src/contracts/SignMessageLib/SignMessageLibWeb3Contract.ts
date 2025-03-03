import { SignMessageLibContract } from '@pnsdomains/safe-core-sdk-types'
import { Sign_message_lib as SignMessageLib_V1_3_0 } from '../../../typechain/src/web3-v1/v1.3.0/Sign_message_lib'
import { Web3TransactionOptions, Web3TransactionResult } from '../../types'
import { toTxResult } from '../../utils'

abstract class SignMessageLibWeb3Contract implements SignMessageLibContract {
  constructor(public contract: SignMessageLib_V1_3_0) {}

  getAddress(): string {
    return this.contract.options.address
  }

  async signMessage(
    data: string,
    options?: Web3TransactionOptions
  ): Promise<Web3TransactionResult> {
    if (options && !options.gas) {
      options.gas = await this.estimateGas('signMessage', [data], { ...options })
    }
    const txResponse = this.contract.methods.signMessage(data).send(options)
    return toTxResult(txResponse, options)
  }

  async getMessageHash(message: string): Promise<string> {
    return this.contract.methods.getMessageHash(message).call()
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

export default SignMessageLibWeb3Contract
