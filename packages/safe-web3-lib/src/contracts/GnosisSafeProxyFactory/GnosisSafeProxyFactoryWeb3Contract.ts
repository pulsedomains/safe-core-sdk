import { BigNumber } from '@ethersproject/bignumber'
import { GnosisSafeProxyFactoryContract } from '@pnsdomains/safe-core-sdk-types'
import { TransactionReceipt } from 'web3-core/types'
import { Proxy_factory as ProxyFactory_V1_0_0 } from '../../../typechain/src/web3-v1/v1.0.0/Proxy_factory'
import { Proxy_factory as ProxyFactory_V1_1_1 } from '../../../typechain/src/web3-v1/v1.1.1/Proxy_factory'
import { Proxy_factory as ProxyFactory_V1_3_0 } from '../../../typechain/src/web3-v1/v1.3.0/Proxy_factory'
import { Web3TransactionOptions } from '../../types'
import { toTxResult } from '../../utils'

export interface CreateProxyProps {
  safeMasterCopyAddress: string
  initializer: string
  saltNonce: string
  options?: Web3TransactionOptions
  callback?: (txHash: string) => void
}

class GnosisSafeProxyFactoryWeb3Contract implements GnosisSafeProxyFactoryContract {
  constructor(public contract: ProxyFactory_V1_3_0 | ProxyFactory_V1_1_1 | ProxyFactory_V1_0_0) {}

  getAddress(): string {
    return this.contract.options.address
  }

  async proxyCreationCode(): Promise<string> {
    return this.contract.methods.proxyCreationCode().call()
  }

  async createProxy({
    safeMasterCopyAddress,
    initializer,
    saltNonce,
    options,
    callback
  }: CreateProxyProps): Promise<string> {
    if (BigNumber.from(saltNonce).lt(0))
      throw new Error('saltNonce must be greater than or equal to 0')
    if (options && !options.gas) {
      options.gas = await this.estimateGas(
        'createProxyWithNonce',
        [safeMasterCopyAddress, initializer, saltNonce],
        {
          ...options
        }
      )
    }
    const txResponse = this.contract.methods
      .createProxyWithNonce(safeMasterCopyAddress, initializer, saltNonce)
      .send(options)

    if (callback) {
      const txResult = await toTxResult(txResponse)
      callback(txResult.hash)
    }

    const txResult: TransactionReceipt = await new Promise((resolve, reject) =>
      txResponse.once('receipt', (receipt: TransactionReceipt) => resolve(receipt)).catch(reject)
    )
    const proxyAddress = txResult.events?.ProxyCreation?.returnValues?.proxy
    if (!proxyAddress) {
      throw new Error('SafeProxy was not deployed correctly')
    }
    return proxyAddress
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

export default GnosisSafeProxyFactoryWeb3Contract
