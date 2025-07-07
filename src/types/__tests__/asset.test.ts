import { describe, it, expect } from 'vitest'
import { ASSET_PAIRS, AssetPairType } from '../asset'

describe('Asset Types', () => {
  describe('ASSET_PAIRS', () => {
    it('should have all required asset pairs', () => {
      expect(ASSET_PAIRS.USD_WBTC).toBeDefined()
      expect(ASSET_PAIRS.USD_ETH).toBeDefined()
      expect(ASSET_PAIRS.USD_SOL).toBeDefined()
    })

    it('should have properly structured USD_WBTC pair', () => {
      const pair = ASSET_PAIRS.USD_WBTC
      
      expect(pair.base.symbol).toBe('USD')
      expect(pair.base.decimals).toBe(2)
      expect(pair.quote.symbol).toBe('wBTC')
      expect(pair.quote.decimals).toBe(8)
      expect(pair.quote.apiId).toBe('bitcoin')
      expect(pair.priceKey).toBe('bitcoin.usd')
    })

    it('should have properly structured USD_ETH pair', () => {
      const pair = ASSET_PAIRS.USD_ETH
      
      expect(pair.base.symbol).toBe('USD')
      expect(pair.base.decimals).toBe(2)
      expect(pair.quote.symbol).toBe('ETH')
      expect(pair.quote.decimals).toBe(18)
      expect(pair.quote.apiId).toBe('ethereum')
      expect(pair.priceKey).toBe('ethereum.usd')
    })

    it('should have properly structured USD_SOL pair', () => {
      const pair = ASSET_PAIRS.USD_SOL
      
      expect(pair.base.symbol).toBe('USD')
      expect(pair.base.decimals).toBe(2)
      expect(pair.quote.symbol).toBe('SOL')
      expect(pair.quote.decimals).toBe(9)
      expect(pair.quote.apiId).toBe('solana')
      expect(pair.priceKey).toBe('solana.usd')
    })

    it('should have unique asset IDs', () => {
      const allAssets = Object.values(ASSET_PAIRS).flatMap(pair => [pair.base, pair.quote])
      const uniqueIds = new Set(allAssets.map(asset => asset.id))
      
      // USD is shared, but all crypto assets should be unique
      expect(uniqueIds.size).toBe(4) // USD, wBTC, ETH, SOL
    })

    it('should have valid contract addresses where applicable', () => {
      const wbtcPair = ASSET_PAIRS.USD_WBTC
      expect(wbtcPair.quote.contractAddress).toBe('0x2260fac5e5542a773aa44fbcfedf7c193bc2c599')
      
      // ETH doesn't have contract address (native token)
      const ethPair = ASSET_PAIRS.USD_ETH
      expect(ethPair.quote.contractAddress).toBeUndefined()
    })
  })

  describe('AssetPairType', () => {
    it('should accept valid asset pair types', () => {
      const validTypes: AssetPairType[] = ['USD_WBTC', 'USD_ETH', 'USD_SOL']
      
      validTypes.forEach(type => {
        expect(ASSET_PAIRS[type]).toBeDefined()
      })
    })
  })
}) 