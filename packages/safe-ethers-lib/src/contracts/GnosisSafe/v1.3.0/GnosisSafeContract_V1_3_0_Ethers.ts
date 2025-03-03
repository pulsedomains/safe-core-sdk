import { SafeSetupConfig } from '@pnsdomains/safe-core-sdk-types'
import { EthersTransactionOptions, EthersTransactionResult } from '../../../types'
import { toTxResult } from '../../../utils'
import { Gnosis_safe as GnosisSafe } from '../../../../typechain/src/ethers-v5/v1.3.0/Gnosis_safe'
import { EMPTY_DATA, SENTINEL_ADDRESS, ZERO_ADDRESS } from '../../../utils/constants'
import GnosisSafeContractEthers from '../GnosisSafeContractEthers'

class GnosisSafeContract_V1_3_0_Ethers extends GnosisSafeContractEthers {
  constructor(public contract: GnosisSafe) {
    super(contract)
  }

  async setup(
    setupConfig: SafeSetupConfig,
    options?: EthersTransactionOptions
  ): Promise<EthersTransactionResult> {
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

    if (options && !options.gasLimit) {
      options.gasLimit = await this.estimateGas(
        'setup',
        [owners, threshold, to, data, fallbackHandler, paymentToken, payment, paymentReceiver],
        {
          ...options
        }
      )
    }
    const txResponse = await this.contract.setup(
      owners,
      threshold,
      to,
      data,
      fallbackHandler,
      paymentToken,
      payment,
      paymentReceiver,
      options
    )

    return toTxResult(txResponse, options)
  }

  async getModules(): Promise<string[]> {
    const { array } = await this.contract.getModulesPaginated(SENTINEL_ADDRESS, 10)
    return array
  }

  async isModuleEnabled(moduleAddress: string): Promise<boolean> {
    return this.contract.isModuleEnabled(moduleAddress)
  }
}

export default GnosisSafeContract_V1_3_0_Ethers
