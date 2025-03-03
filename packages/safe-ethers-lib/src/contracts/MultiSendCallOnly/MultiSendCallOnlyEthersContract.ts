import { MultiSendCallOnlyContract } from '@pnsdomains/safe-core-sdk-types'
import {
  Multi_send_call_only as MultiSendCallOnly_V1_3_0,
  Multi_send_call_onlyInterface as MultiSendCallOnlyInterface
} from '../../../typechain/src/ethers-v5/v1.3.0/Multi_send_call_only'

abstract class MultiSendCallOnlyEthersContract implements MultiSendCallOnlyContract {
  constructor(public contract: MultiSendCallOnly_V1_3_0) {}

  getAddress(): string {
    return this.contract.address
  }

  encode: MultiSendCallOnlyInterface['encodeFunctionData'] = (
    methodName: any,
    params: any
  ): string => {
    return this.contract.interface.encodeFunctionData(methodName, params)
  }
}

export default MultiSendCallOnlyEthersContract
