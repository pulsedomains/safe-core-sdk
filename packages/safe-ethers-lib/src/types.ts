import { ContractTransaction } from '@ethersproject/contracts'
import { BaseTransactionResult } from '@pnsdomains/safe-core-sdk-types'

export interface EthersTransactionOptions {
  from?: string
  gasLimit?: number | string
  gasPrice?: number | string
  maxFeePerGas?: number | string
  maxPriorityFeePerGas?: number | string
  nonce?: number
}

export interface EthersTransactionResult extends BaseTransactionResult {
  transactionResponse: ContractTransaction
  options?: EthersTransactionOptions
}
