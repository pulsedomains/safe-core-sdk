import { SafeVersion } from '@pnsdomains/safe-core-sdk-types'

export const SAFE_LAST_VERSION: SafeVersion = '1.3.0'
export const SAFE_BASE_VERSION: SafeVersion = '1.0.0'

type SafeDeploymentsVersions = {
  [version: string]: {
    safeMasterCopyVersion: string
    safeMasterCopyL2Version?: string
    safeProxyFactoryVersion: string
    compatibilityFallbackHandler: string
    multiSendVersion: string
    multiSendCallOnlyVersion?: string
    signMessageLibVersion?: string
    createCallVersion?: string
  }
}

export const safeDeploymentsVersions: SafeDeploymentsVersions = {
  '1.3.0': {
    safeMasterCopyVersion: '1.3.0',
    safeMasterCopyL2Version: '1.3.0',
    safeProxyFactoryVersion: '1.3.0',
    compatibilityFallbackHandler: '1.3.0',
    multiSendVersion: '1.3.0',
    multiSendCallOnlyVersion: '1.3.0',
    signMessageLibVersion: '1.3.0',
    createCallVersion: '1.3.0'
  },
  '1.2.0': {
    safeMasterCopyVersion: '1.2.0',
    safeMasterCopyL2Version: undefined,
    safeProxyFactoryVersion: '1.1.1',
    compatibilityFallbackHandler: '1.3.0',
    multiSendVersion: '1.1.1',
    multiSendCallOnlyVersion: '1.3.0',
    signMessageLibVersion: '1.3.0',
    createCallVersion: '1.3.0'
  },
  '1.1.1': {
    safeMasterCopyVersion: '1.1.1',
    safeMasterCopyL2Version: undefined,
    safeProxyFactoryVersion: '1.1.1',
    compatibilityFallbackHandler: '1.3.0',
    multiSendVersion: '1.1.1',
    multiSendCallOnlyVersion: '1.3.0',
    signMessageLibVersion: '1.3.0',
    createCallVersion: '1.3.0'
  },
  '1.0.0': {
    safeMasterCopyVersion: '1.0.0',
    safeMasterCopyL2Version: undefined,
    safeProxyFactoryVersion: '1.0.0',
    compatibilityFallbackHandler: '1.3.0',
    multiSendVersion: '1.1.1',
    multiSendCallOnlyVersion: '1.3.0',
    signMessageLibVersion: '1.3.0',
    createCallVersion: '1.3.0'
  }
}

export const safeDeploymentsL1ChainIds = [
  1 // Ethereum Mainnet
]
