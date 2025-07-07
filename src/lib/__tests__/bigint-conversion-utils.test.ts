import { describe, it, expect } from 'vitest'
import {
  parseAssetAmount,
  formatAssetAmount,
  formatAssetAmountForDisplay,
  validateAssetInput,
  convertToQuoteAsset,
  convertToBaseAsset,
  performSafeBigIntConversion,
  createPreciseConversionResult,
} from '../bigint-conversion-utils'
import { AssetConfig } from '@/types/asset'

describe('BigInt Conversion Utils', () => {
  // Mock asset configs for testing
  const usdAsset: AssetConfig = {
    id: 'usd',
    symbol: 'USD',
    name: 'US Dollar',
    decimals: 2,
    icon: '💵',
  }

  const wbtcAsset: AssetConfig = {
    id: 'wbtc',
    symbol: 'wBTC',
    name: 'Wrapped Bitcoin',
    decimals: 8,
    icon: '₿',
  }

  describe('parseAssetAmount', () => {
    it('should parse USD amount correctly', () => {
      const result = parseAssetAmount('100.50', 2)
      expect(result).toBe(BigInt(10050))
    })

    it('should parse wBTC amount correctly', () => {
      const result = parseAssetAmount('0.00001234', 8)
      expect(result).toBe(BigInt(1234))
    })

    it('should handle whole numbers', () => {
      const result = parseAssetAmount('1', 8)
      expect(result).toBe(BigInt(100000000))
    })

    it('should handle zero', () => {
      const result = parseAssetAmount('0', 8)
      expect(result).toBe(BigInt(0))
    })
  })

  describe('formatAssetAmount', () => {
    it('should format USD amount correctly', () => {
      const result = formatAssetAmount(BigInt(10050), 2)
      expect(result).toBe('100.5')
    })

    it('should format wBTC amount correctly', () => {
      const result = formatAssetAmount(BigInt(1234), 8)
      expect(result).toBe('0.00001234')
    })

    it('should format whole numbers', () => {
      const result = formatAssetAmount(BigInt(100000000), 8)
      expect(result).toBe('1')
    })
  })

  describe('formatAssetAmountForDisplay', () => {
    it('should format USD with commas and 2 decimals', () => {
      const result = formatAssetAmountForDisplay(BigInt(123456789), 2)
      expect(result).toBe('1,234,567.89')
    })

    it('should format crypto without trailing zeros', () => {
      const result = formatAssetAmountForDisplay(BigInt(100000000), 8)
      expect(result).toBe('1')
    })

    it('should show small crypto amounts', () => {
      const result = formatAssetAmountForDisplay(BigInt(1234), 8)
      expect(result).toBe('0.00001234')
    })

    it('should handle zero amounts', () => {
      const result = formatAssetAmountForDisplay(BigInt(0), 8)
      expect(result).toBe('0')
    })
  })

  describe('validateAssetInput', () => {
    it('should validate correct numbers', () => {
      expect(validateAssetInput('100.50')).toEqual({ isValid: true })
      expect(validateAssetInput('0.00001234')).toEqual({ isValid: true })
      expect(validateAssetInput('1')).toEqual({ isValid: true })
    })

    it('should allow empty input', () => {
      expect(validateAssetInput('')).toEqual({ isValid: true })
      expect(validateAssetInput('   ')).toEqual({ isValid: true })
    })

    it('should reject invalid formats', () => {
      expect(validateAssetInput('abc')).toEqual({ 
        isValid: false, 
        error: 'Please enter a valid number' 
      })
      expect(validateAssetInput('12.34.56')).toEqual({ 
        isValid: false, 
        error: 'Invalid decimal format' 
      })
    })

    it('should reject negative numbers', () => {
      expect(validateAssetInput('-100')).toEqual({ 
        isValid: false, 
        error: 'Amount must be greater than zero' 
      })
    })

    it('should reject zero', () => {
      expect(validateAssetInput('0')).toEqual({ 
        isValid: false, 
        error: 'Amount must be greater than zero' 
      })
    })

    it('should reject very large numbers', () => {
      expect(validateAssetInput('1000000000000000000')).toEqual({ 
        isValid: false, 
        error: 'Amount is too large' 
      })
    })
  })

  describe('convertToQuoteAsset', () => {
    it('should convert USD to wBTC correctly', () => {
      // $100 at $50,000 per wBTC = 0.002 wBTC
      const result = convertToQuoteAsset('100', 2, '50000', 8, 8)
      // 100 USD = 10000 (with 2 decimals)
      // 50000 BTC price = 5000000000000 (with 8 decimals)
      // Expected: 0.002 wBTC = 200000 (with 8 decimals)
      expect(result).toBe(BigInt(200000))
    })

    it('should handle small amounts', () => {
      // $1 at $100,000 per wBTC
      const result = convertToQuoteAsset('1', 2, '100000', 8, 8)
      expect(result).toBe(BigInt(1000)) // 0.00001 wBTC
    })
  })

  describe('convertToBaseAsset', () => {
    it('should convert wBTC to USD correctly', () => {
      // 0.002 wBTC at $50,000 per wBTC = $100
      const result = convertToBaseAsset('0.002', 8, '50000', 8, 2)
      expect(result).toBe(BigInt(10000)) // $100.00
    })

    it('should handle small crypto amounts', () => {
      // 0.00001 wBTC at $100,000 per wBTC = $1
      const result = convertToBaseAsset('0.00001', 8, '100000', 8, 2)
      expect(result).toBe(BigInt(100)) // $1.00
    })
  })

  describe('performSafeBigIntConversion', () => {
    it('should perform USD to wBTC conversion', () => {
      const result = performSafeBigIntConversion(
        '100',
        usdAsset,
        wbtcAsset,
        50000,
        true
      )
      expect(result.isValid).toBe(true)
      expect(result.amount).toBe(BigInt(200000)) // 0.002 wBTC
    })

    it('should handle validation errors', () => {
      const result = performSafeBigIntConversion(
        'invalid',
        usdAsset,
        wbtcAsset,
        50000,
        true
      )
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Please enter a valid number')
    })

    it('should handle empty input', () => {
      const result = performSafeBigIntConversion(
        '',
        usdAsset,
        wbtcAsset,
        50000,
        true
      )
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Amount is required')
    })
  })

  describe('createPreciseConversionResult', () => {
    it('should create proper conversion result object', () => {
      const amount = BigInt(200000) // 0.002 wBTC
      const result = createPreciseConversionResult(amount, wbtcAsset)
      
      expect(result.amount).toBe(amount)
      expect(result.asset).toBe(wbtcAsset)
      expect(result.formatted).toBe('0.002') // Display format
      expect(result.humanReadable).toBe('0.002') // Human readable
    })
  })
}) 