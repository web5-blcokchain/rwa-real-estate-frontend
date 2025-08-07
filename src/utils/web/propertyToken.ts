import type { EIP1193Provider } from '@privy-io/react-auth'
import { getNameToContract } from './utils'

export async function getPropertyTokenContract(e: EIP1193Provider, address: string) {
  const propertyContract = await getNameToContract(e, 'PropertyToken', address)
  return propertyContract
}
