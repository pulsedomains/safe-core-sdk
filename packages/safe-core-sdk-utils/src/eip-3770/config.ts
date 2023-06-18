interface NetworkShortName {
  shortName: string
  chainId: number
}

// https://github.com/ethereum-lists/chains/tree/master/_data/chains
export const networks: NetworkShortName[] = [
  { chainId: 1, shortName: 'eth' },
  { chainId: 5, shortName: 'gor' },
  { chainId: 369, shortName: 'pls' },
  { chainId: 943, shortName: 'tpls' },
]

if (process.env.TEST_NETWORK === 'hardhat') {
  networks.push({ shortName: 'local', chainId: 31337 })
} else if (process.env.TEST_NETWORK === 'ganache') {
  networks.push({ shortName: 'local', chainId: 1337 })
}
