import { SafeSetupConfig } from '@pnsdomains/safe-core-sdk-types'
import { Web3TransactionOptions, Web3TransactionResult } from '../../../types'
import { toTxResult } from '../../../utils'
import { Gnosis_safe as GnosisSafe } from '../../../../typechain/src/web3-v1/v1.2.0/Gnosis_safe'
import GnosisSafeContractWeb3 from '../GnosisSafeContractWeb3'
import { ZERO_ADDRESS, EMPTY_DATA } from '../../../utils/constants'

class GnosisSafeContract_V1_2_0_Web3 extends GnosisSafeContractWeb3 {
  constructor(public contract: GnosisSafe) {
    super(contract)
  }

  async setup(
    setupConfig: SafeSetupConfig,
    options?: Web3TransactionOptions
  ): Promise<Web3TransactionResult> {
    const {
      owners,
      threshold,
      to = ZERO_ADDRESS,
      data = EMPTY_DATA,
      fallbackHandler = ZERO_ADDRESS,
      paymentToken = ZERO_ADDRESS,
      payment = 0,
      paymentReceiver = ZERO_ADDRESS
    } = setupConfig

    if (options && !options.gas) {
      options.gas = await this.estimateGas(
        'setup',
        [owners, threshold, to, data, fallbackHandler, paymentToken, payment, paymentReceiver],
        {
          ...options
        }
      )
    }
    const txResponse = this.contract.methods
      .setup(owners, threshold, to, data, fallbackHandler, paymentToken, payment, paymentReceiver)
      .send(options)

    return toTxResult(txResponse, options)
  }

  async getModules(): Promise<string[]> {
    return this.contract.methods.getModules().call()
  }

  async isModuleEnabled(moduleAddress: string): Promise<boolean> {
    return this.contract.methods.isModuleEnabled(moduleAddress).call()
  }
}

export default GnosisSafeContract_V1_2_0_Web3
