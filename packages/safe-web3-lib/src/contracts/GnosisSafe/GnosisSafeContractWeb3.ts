import { BigNumber } from '@ethersproject/bignumber'
import {
  GnosisSafeContract,
  SafeTransaction,
  SafeTransactionData,
  SafeVersion,
  SafeSetupConfig
} from '@pnsdomains/safe-core-sdk-types'
import { Gnosis_safe as GnosisSafe_V1_0_0 } from '../../../typechain/src/web3-v1/v1.0.0/Gnosis_safe'
import { Gnosis_safe as GnosisSafe_V1_1_1 } from '../../../typechain/src/web3-v1/v1.1.1/Gnosis_safe'
import { Gnosis_safe as GnosisSafe_V1_2_0 } from '../../../typechain/src/web3-v1/v1.2.0/Gnosis_safe'
import { Gnosis_safe as GnosisSafe_V1_3_0 } from '../../../typechain/src/web3-v1/v1.3.0/Gnosis_safe'
import { Web3TransactionOptions, Web3TransactionResult } from '../../types'
import { toTxResult } from '../../utils'

abstract class GnosisSafeContractWeb3 implements GnosisSafeContract {
  constructor(
    public contract: GnosisSafe_V1_3_0 | GnosisSafe_V1_2_0 | GnosisSafe_V1_1_1 | GnosisSafe_V1_0_0
  ) {}

  abstract setup(
    setupConfig: SafeSetupConfig,
    options?: Web3TransactionOptions
  ): Promise<Web3TransactionResult>

  async getVersion(): Promise<SafeVersion> {
    return (await this.contract.methods.VERSION().call()) as SafeVersion
  }

  getAddress(): string {
    return this.contract.options.address
  }

  async getNonce(): Promise<number> {
    return Number(await this.contract.methods.nonce().call())
  }

  async getThreshold(): Promise<number> {
    return Number(await this.contract.methods.getThreshold().call())
  }

  async getOwners(): Promise<string[]> {
    return this.contract.methods.getOwners().call()
  }

  async isOwner(address: string): Promise<boolean> {
    return this.contract.methods.isOwner(address).call()
  }

  async getTransactionHash(safeTransactionData: SafeTransactionData): Promise<string> {
    return this.contract.methods
      .getTransactionHash(
        safeTransactionData.to,
        safeTransactionData.value,
        safeTransactionData.data,
        safeTransactionData.operation,
        safeTransactionData.safeTxGas,
        safeTransactionData.baseGas,
        safeTransactionData.gasPrice,
        safeTransactionData.gasToken,
        safeTransactionData.refundReceiver,
        safeTransactionData.nonce
      )
      .call()
  }

  async approvedHashes(ownerAddress: string, hash: string): Promise<BigNumber> {
    return BigNumber.from(await this.contract.methods.approvedHashes(ownerAddress, hash).call())
  }

  async approveHash(
    hash: string,
    options?: Web3TransactionOptions
  ): Promise<Web3TransactionResult> {
    if (options && !options.gas) {
      options.gas = await this.estimateGas('approveHash', [hash], { ...options })
    }
    const txResponse = this.contract.methods.approveHash(hash).send(options)
    return toTxResult(txResponse, options)
  }

  abstract getModules(): Promise<string[]>

  abstract isModuleEnabled(moduleAddress: string): Promise<boolean>

  async isValidTransaction(
    safeTransaction: SafeTransaction,
    options?: Web3TransactionOptions
  ): Promise<boolean> {
    let isTxValid = false
    try {
      if (options && !options.gas) {
        options.gas = await this.estimateGas(
          'execTransaction',
          [
            safeTransaction.data.to,
            safeTransaction.data.value,
            safeTransaction.data.data,
            safeTransaction.data.operation,
            safeTransaction.data.safeTxGas,
            safeTransaction.data.baseGas,
            safeTransaction.data.gasPrice,
            safeTransaction.data.gasToken,
            safeTransaction.data.refundReceiver,
            safeTransaction.encodedSignatures()
          ],
          {
            ...options
          }
        )
      }
      isTxValid = await this.contract.methods
        .execTransaction(
          safeTransaction.data.to,
          safeTransaction.data.value,
          safeTransaction.data.data,
          safeTransaction.data.operation,
          safeTransaction.data.safeTxGas,
          safeTransaction.data.baseGas,
          safeTransaction.data.gasPrice,
          safeTransaction.data.gasToken,
          safeTransaction.data.refundReceiver,
          safeTransaction.encodedSignatures()
        )
        .call(options)
    } catch {}
    return isTxValid
  }

  async execTransaction(
    safeTransaction: SafeTransaction,
    options?: Web3TransactionOptions
  ): Promise<Web3TransactionResult> {
    if (options && !options.gas) {
      options.gas = await this.estimateGas(
        'execTransaction',
        [
          safeTransaction.data.to,
          safeTransaction.data.value,
          safeTransaction.data.data,
          safeTransaction.data.operation,
          safeTransaction.data.safeTxGas,
          safeTransaction.data.baseGas,
          safeTransaction.data.gasPrice,
          safeTransaction.data.gasToken,
          safeTransaction.data.refundReceiver,
          safeTransaction.encodedSignatures()
        ],
        {
          ...options
        }
      )
    }
    const txResponse = this.contract.methods
      .execTransaction(
        safeTransaction.data.to,
        safeTransaction.data.value,
        safeTransaction.data.data,
        safeTransaction.data.operation,
        safeTransaction.data.safeTxGas,
        safeTransaction.data.baseGas,
        safeTransaction.data.gasPrice,
        safeTransaction.data.gasToken,
        safeTransaction.data.refundReceiver,
        safeTransaction.encodedSignatures()
      )
      .send(options)

    return toTxResult(txResponse, options)
  }

  encode(methodName: string, params: any[]): string {
    return (this.contract.methods as any)[methodName](...params).encodeABI()
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

export default GnosisSafeContractWeb3
