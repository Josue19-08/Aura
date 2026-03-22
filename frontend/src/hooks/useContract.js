import { useState } from 'react'
import { useAccount, useWalletClient, usePublicClient } from 'wagmi'
import { parseEventLogs } from 'viem'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@utils/constants'

export default function useContract() {
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const registerProduct = async (lotId, productName, origin, ipfsHash) => {
    if (!walletClient) {
      throw new Error('Wallet not connected')
    }

    setIsLoading(true)
    setError(null)

    try {
      const { request } = await publicClient.simulateContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'registerProduct',
        args: [lotId, productName, origin, ipfsHash],
        account: address,
      })

      const hash = await walletClient.writeContract(request)

      const receipt = await publicClient.waitForTransactionReceipt({ hash })

      // Parse logs to get product ID
      const parsedLogs = parseEventLogs({
        abi: CONTRACT_ABI,
        eventName: 'ProductRegistered',
        logs: receipt.logs,
      })

      const productId = parsedLogs[0]?.args?.productId !== undefined
        ? Number(parsedLogs[0].args.productId)
        : null

      return { hash, productId, receipt }
    } catch (err) {
      console.error('Registration error:', err)
      setError(err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const transferCustody = async (productId, newCustodian, locationNote) => {
    if (!walletClient) {
      throw new Error('Wallet not connected')
    }

    setIsLoading(true)
    setError(null)

    try {
      const { request } = await publicClient.simulateContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'transferCustody',
        args: [BigInt(productId), newCustodian, locationNote],
        account: address,
      })

      const hash = await walletClient.writeContract(request)

      const receipt = await publicClient.waitForTransactionReceipt({ hash })

      return { hash, receipt }
    } catch (err) {
      console.error('Transfer error:', err)
      setError(err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const verifyProductOnChain = async (productId) => {
    if (!publicClient) {
      throw new Error('Public client not available')
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'verifyProduct',
        args: [BigInt(productId)],
      })

      return result
    } catch (err) {
      console.error('Verification error:', err)
      setError(err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const getProductOnChain = async (productId) => {
    if (!publicClient) {
      throw new Error('Public client not available')
    }

    try {
      const product = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getProduct',
        args: [BigInt(productId)],
      })

      const custodyHistory = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getCustodyHistory',
        args: [BigInt(productId)],
      })

      const currentCustodian = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getCurrentCustodian',
        args: [BigInt(productId)],
      })

      return { product, custodyHistory, currentCustodian }
    } catch (err) {
      console.error('Get product error:', err)
      throw err
    }
  }

  return {
    registerProduct,
    transferCustody,
    verifyProductOnChain,
    getProductOnChain,
    isLoading,
    error,
  }
}
