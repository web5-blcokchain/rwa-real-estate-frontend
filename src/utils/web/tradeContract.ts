import type { EIP1193Provider } from '@privy-io/react-auth'
import { getContracts } from '@/contract'
import BigNumber from 'bignumber.js'
import { Contract, ethers } from 'ethers'
import { envConfig } from '../envConfig'
import { toBigNumer } from '../number'
import { getPropertyTokenContract } from './propertyToken'
import { getUsdcContract } from './usdcAddress'
import { getNameToContract, SmartErrorParses } from './utils'

// 获取交易合约
export async function getTradeContract(e: EIP1193Provider) {
  const propertyContract = await getNameToContract(e, 'TradeContract', envConfig.tradeContract)
  return propertyContract
}

/**
 * 创建卖单（资产托管至合约）
 * @param contact 交易合约
 * @param e
 * @param data 地址
 * @param data.token 房屋资产地址
 * @param data.amount 房屋代币数量
 * @param data.price 房屋代币价格
 *
 * @returns tx，price
 */
export async function createSellOrder(contact: ethers.Contract, e: EIP1193Provider, data: {
  token: string
  amount: number
  price: number
}) {
  try {
    const propertyTokenContract = await getPropertyTokenContract(e, data.token)
    const tokenDecimals = await propertyTokenContract.decimals()
    // 获取房屋id
    const [serverId] = await propertyTokenContract.getPropertyInfo()
    const tokenPrice = await data.price
    const allAmount = toBigNumer((data.amount)).toString()
    const parseAmount = ethers.parseUnits(allAmount, tokenDecimals)
    const usdcContact = await getUsdcContract(e)
    const usdcDecimals = await usdcContact.decimals()
    // 将房屋代币授权给交易合约
    const approveTx = await propertyTokenContract.approve(envConfig.tradeContract, parseAmount)
    await approveTx.wait()
    const sellPrice = new BigNumber(data.price)
    // 发送创建卖单交易（房屋代币地址、房产表示字符串、卖出数量、挂单单价【默认支付代币精度】）
    const tx = await contact.createSellOrder(data.token, serverId, parseAmount, ethers.parseUnits(sellPrice.toString(), usdcDecimals))
    await tx.wait()
    return {
      tx,
      price: tokenPrice
    }
  }
  catch (e: any) {
    console.log(e)
    throw (new Error(e))
  }
}

/**
 * 创建买单（支付币+手续费托管至合约）
 * @param contact 交易合约
 * @param e
 * @param data
 * @param data.token 房屋资产地址
 * @param data.amount 房屋代币数量
 * @param data.price 房屋代币价格
 * @returns tx，price
 */
export async function createBuyOrder(contact: ethers.Contract, e: EIP1193Provider, data: {
  token: string
  amount: number
  price: number
}) {
  try {
    const propertyTokenContract = await getPropertyTokenContract(e, data.token)
    const usdcContact = await getUsdcContract(e)
    // 房屋代币价格和精度
    const tokenDecimals = await propertyTokenContract.decimals()

    // 获取usdc精度
    const usdcDecimals = await usdcContact.decimals()
    const tokenPrice = ethers.parseUnits(toBigNumer(data.price).toString(), usdcDecimals)
    const tokenAmount = ethers.parseUnits(toBigNumer(data.amount).toString(), usdcDecimals)
    // 售卖总价格
    const allAmount = tokenAmount * tokenPrice / BigInt(10 ** Number(usdcDecimals))
    // 获取房屋id
    const [serverId] = await propertyTokenContract.getPropertyInfo()
    // 将需要支付的usdc（数量 * 单价）授权给交易合约
    const approveTx = await usdcContact.approve(envConfig.tradeContract, allAmount)
    await approveTx.wait()
    // 发送创建卖单交易 （房屋代币地址、房产表示字符串、买入数量、挂单单价【默认支付代币精度】）
    const tx = await contact.createBuyOrder(data.token, serverId, ethers.parseUnits(data.amount.toString(), tokenDecimals), ethers.parseUnits(data.price.toString(), usdcDecimals))
    await tx.wait()
    return {
      tx,
      price: data.price
    }
  }
  catch (e: any) {
    console.log(e)
    throw (new Error(e))
  }
}

/**
 * 购买房屋代币
 * @param contact 交易合约
 * @param e
 * @param data
 * @param data.sellOrderId 买入订单号
 * @param data.amount 房屋代币数量
 * @param data.price 房屋代币单价
 * @returns tx
 */
export async function tradeContractBuyOrder(contact: ethers.Contract, e: EIP1193Provider, data: {
  sellOrderId: number
  amount: number
  price: number
}): Promise<ethers.TransactionResponse> {
  try {
    const usdcContact = await getUsdcContract(e)
    const usdcDecimals = await usdcContact.decimals()
    const payPricr = ethers.parseUnits(toBigNumer(data.price).toString(), usdcDecimals)
    const payAmount = ethers.parseUnits(toBigNumer(data.amount).toString(), usdcDecimals)
    const allAmount = payPricr * payAmount / BigInt(10 ** Number(usdcDecimals))
    // 将usdc授权给交易合约
    const approveTx = await usdcContact.approve(envConfig.tradeContract, allAmount)
    await approveTx.wait()
    // 发送买单交易
    const tx = await contact.buyOrder(data.sellOrderId)
    await tx.wait()
    return tx
  }
  catch (e: any) {
    console.log(e)
    throw (new Error(e))
  }
}

/**
 * 卖出房屋代币
 * @param contact 交易合约
 * @param e
 * @param data
 * @param data.token 房屋代币地址
 * @param data.sellOrderId 卖出订单号
 * @param data.amount 房屋代币数量
 * @param data.price 房屋代币单价
 * @returns tx
 */
export async function tradeContractSellOrder(contact: ethers.Contract, e: EIP1193Provider, data: {
  token: string
  sellOrderId: number
  amount: number
  price: number
}): Promise<ethers.TransactionResponse> {
  try {
    const propertyTokenContract = await getPropertyTokenContract(e, data.token)
    const tokenDecimals = await propertyTokenContract.decimals()
    const payAmount = ethers.parseUnits(toBigNumer(data.amount).toString(), tokenDecimals)
    const payPrice = ethers.parseUnits(toBigNumer(data.price).toString())
    const allAmount = payPrice * payAmount / BigInt(10 ** Number(tokenDecimals))
    // 将翻屋代币授权给交易合约
    const approveTx = await propertyTokenContract.approve(envConfig.tradeContract, allAmount)
    await approveTx.wait()
    // 发送卖单交易
    const tx = await contact.sellOrder(data.sellOrderId)
    await tx.wait()
    return tx
  }
  catch (e: any) {
    console.log(e)
    throw (new Error(e))
  }
}

/**
 * 取消订单
 * @param contact 交易合约
 * @param orderId 订单号
 * @returns tx
 */
export async function cancelSellOrder(contact: ethers.Contract, orderId: number): Promise<ethers.TransactionResponse> {
  try {
    const tx = await contact.cancelOrder(orderId)
    await tx.wait()
    return tx
  }
  catch (e: any) {
    console.log('原版内容:', e)
    console.log('解析内容:', SmartErrorParses.parseError(e.message))
    throw (new Error(e))
  }
}

export type CreateOrder = [
  id: bigint, // 订单ID
  creator: string, // 创建者
  token: string, // PropertyToken 地址
  propertyId: string, // 房屋ID
  amount: bigint, // 剩余数量（第一阶段仅全额撮合）
  price: bigint, // 单价（支付币精度）
  isSellOrder: boolean, // true: 卖单; false: 买单
  active: boolean, // 订单是否有效
  createdAt: number, // 创建时间
  feeBps: bigint, // 下单时费率快照（用于买单预存手续费）
  paymentToken: string // 下单时的支付代币（用于买单托管资金）
]
/**
 * 监听创建卖出事件，返回用户创建的结果
 * @param userAddress 用户地址
 * @param sellToken
 * @param isSellOrBuy 是否为售卖 true 卖， false 买
 * @returns orderId
 */
export async function listenerCreateSellEvent(
  userAddress: string,
  sellToken: string,
  isSellOrBuy: boolean
): Promise<number> {
  const ethersProvider = new ethers.WebSocketProvider(envConfig.web3.rpc)
  const tradeContract = getContracts('TradeContract')
  const contract = new Contract(envConfig.tradeContract, tradeContract.abi, ethersProvider)
  return new Promise((res, rej) => {
    const getOrderId = (...args: CreateOrder) => {
      const [orderId, creator, token, _propertyId, _amount, _price, isSellOrder] = args
      if (creator === userAddress && sellToken === token && isSellOrder === isSellOrBuy) {
        contract.off('OrderCreated', getOrderId)
        res(Number(orderId))
      }
    }
    contract.on('OrderCreated', getOrderId)
    setTimeout(() => {
      contract.off('OrderCreated', getOrderId)
      rej(new Error('time out'))
    }, 1000 * 60 * 2)
  })
}

export type BuyOrSellInfo = [
  orderId: bigint, // 订单ID
  maker: string, // 创建者
  taker: string, // PropertyToken 地址
  token: string, // 房屋ID
  propertyId: string, // 剩余数量（第一阶段仅全额撮合）
  matchedAmount: bigint, // 单价（支付币精度）
  price: bigint, // true: 卖单; false: 买单
  isSellOrder: boolean, // 订单是否有效
  fee: bigint, // 创建时间
  paymentToken: string, // 下单时费率快照（用于买单预存手续费）
  timestamp: number // 下单时的支付代币（用于买单托管资金）
]

/**
 * 监听创建卖出事件，返回用户创建的结果
 * @param userAddress 用户地址
 * @param sellToken
 * @param isSellOrBuy 是否为售卖 true 买， false 卖
 * @returns orderId
 */
export async function listenerOrderExecutedEvent(
  userAddress: string,
  sellToken: string,
  isSellOrBuy: boolean
): Promise<number> {
  const ethersProvider = new ethers.WebSocketProvider(envConfig.web3.rpc)
  const tradeContract = getContracts('TradeContract')
  const contract = new Contract(envConfig.tradeContract, tradeContract.abi, ethersProvider)
  return new Promise((res, rej) => {
    const getOrderId = (...args: BuyOrSellInfo) => {
      const [orderId, _maker, taker, token, _propertyId, _matchedAmount, _price, isSellOrder] = args
      if (taker === userAddress && sellToken === token && isSellOrder === isSellOrBuy) {
        contract.off('OrderExecuted', getOrderId)
        res(Number(orderId))
      }
    }
    contract.on('OrderExecuted', getOrderId)
    setTimeout(() => {
      contract.off('OrderExecuted', getOrderId)
      rej(new Error('time out'))
    }, 1000 * 60 * 2)
  })
}
