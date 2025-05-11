import type { ConnectedWallet } from '@privy-io/react-auth'
import apiBasic from '@/api/basicApi'
import { IImage } from '@/components/common/i-image'
import { IInfoField } from '@/components/common/i-info-field'
import ISeparator from '@/components/common/i-separator'
import { PaymentMethod } from '@/components/common/payment-method'
import QuantitySelector from '@/components/common/quantity-selector'
import { usePropertyManagerContract, useTradingManagerContract } from '@/contract'
import SimpleERC20ABI from '@/contract/SimpleERC20.json'
import { useCommonDataStore } from '@/stores/common-data'
import { joinImagesPath } from '@/utils/url'
import { useWallets } from '@privy-io/react-auth'
import { useMutation } from '@tanstack/react-query'
import { createLazyFileRoute, useMatch, useNavigate, useRouter } from '@tanstack/react-router'
import { Button } from 'antd'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { isAddress } from 'web3-validator'

// 最小购买数量常量
const MIN_TOKEN_PURCHASE = 2 // 设置最小购买量为2个代币，根据合约要求调整

export const Route = createLazyFileRoute('/_app/properties/payment/$id')({
  component: RouteComponent
})

function RouteComponent() {
  const { t } = useTranslation()
  const router = useRouter()
  const navigate = useNavigate()
  const { ready, wallets } = useWallets()
  const tradingManagerContract = useTradingManagerContract()
  const propertyManagerContract = usePropertyManagerContract()

  const [wallet, setWallet] = useState<ConnectedWallet | null>(null)
  const [minTokenAmount, setMinTokenAmount] = useState(MIN_TOKEN_PURCHASE)

  const { params } = useMatch({
    from: '/_app/properties/payment/$id'
  })

  const id = Number.parseInt(params.id)
  const assets = useCommonDataStore(state => state.assets)

  const item = assets.get(id)!

  // 默认购买量设置为最小值
  const [tokens, setTokens] = useState(MIN_TOKEN_PURCHASE)

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (hash: string) => {
      const res = await apiBasic.initialBuyAsset({
        id: item.id,
        number: tokens,
        hash
      })
      return res.data
    }
  })

  // 获取最小购买量
  useEffect(() => {
    const fetchMinAmount = async () => {
      if (tradingManagerContract && item?.contract_address) {
        try {
          // 如果合约有提供获取最小购买量的方法
          // const minAmount = await tradingManagerContract.methods.getMinimumTokenAmount().call();
          // setMinTokenAmount(Number(minAmount));

          // 如果没有相关方法，则使用默认值
          setMinTokenAmount(MIN_TOKEN_PURCHASE)
        }
        catch (error) {
          console.error('获取最小购买量失败:', error)
          setMinTokenAmount(MIN_TOKEN_PURCHASE)
        }
      }
    }

    fetchMinAmount()
  }, [tradingManagerContract, item])

  async function payment() {
    if (!wallet) {
      toast.error(t('payment.errors.no_wallet'))
      return
    }

    // 检查购买数量是否达到最小要求
    if (tokens < minTokenAmount) {
      toast.error(t('payment.errors.amount_below_minimum', { min: minTokenAmount }))
      return
    }

    try {
      // 确保用户钱包已连接
      if (!window.ethereum) {
        toast.error(t('payment.errors.no_ethereum'))
        return
      }

      // 检查房产合约地址
      if (!item.contract_address || !isAddress(item.contract_address)) {
        toast.error(t('payment.errors.invalid_contract'))
        return
      }

      const contractAddress = item.contract_address
      const investorAddress = wallet.address

      // 准备Provider和Signer
      const ethProvider = await wallet.getEthereumProvider()
      const provider = new ethers.BrowserProvider(ethProvider)
      const signer = await provider.getSigner()

      // 获取USDT合约
      const usdtContract = new ethers.Contract(
        SimpleERC20ABI.address,
        SimpleERC20ABI.abi,
        signer
      )

      // 检查USDT余额
      const signerAddress = await signer.getAddress()
      const usdtBalance = await usdtContract.balanceOf(signerAddress)
      const requiredBalance = ethers.parseUnits('0.01', 18) // 最小要求的USDT余额

      console.log('用户的USDT余额:', ethers.formatUnits(usdtBalance, 18))

      if (usdtBalance < requiredBalance) {
        toast.error(t('payment.errors.insufficient_eth'))
        return
      }

      // 展示购买信息
      console.log('初始购买信息:')
      console.log(`- 房产ID: ${item.id}`)
      console.log(`- 代币合约地址: ${contractAddress}`)
      console.log(`- 数量: ${tokens}`)
      console.log(`- 代币价格: ${item.price}`)

      // 执行初始购买
      toast.info(t('payment.info.creating_transaction'))

      // 验证propertyManagerContract已经初始化
      if (!propertyManagerContract || !propertyManagerContract.methods) {
        toast.error(t('payment.errors.contract_not_initialized'))
        return
      }

      try {
        // 使用房产ID作为标识符
        const propertyId = item.id.toString()

        console.log('准备调用合约:')
        console.log(`- 房产ID: ${propertyId}`)
        console.log(`- 代币数量: ${tokens}`)
        console.log(`- 投资者地址: ${investorAddress}`)

        // 估算gas
        const gasEstimate = await propertyManagerContract.methods.initialBuyPropertyToken(
          propertyId,
          tokens
        ).estimateGas({ from: investorAddress })

        console.log('预估的gas用量:', gasEstimate)

        // 增加20%的gas以避免gas不足
        const gasLimit = Math.floor(Number(gasEstimate) * 1.2).toString()

        // 执行交易
        const initialBuyTx = await propertyManagerContract.methods.initialBuyPropertyToken(
          propertyId,
          tokens
        ).send({
          from: investorAddress,
          gas: gasLimit
        })

        toast.success(t('payment.success.tx_sent'))
        const hash = initialBuyTx.transactionHash

        console.log('交易哈希:', hash)
        console.log('购买后余额', await usdtContract.balanceOf(signerAddress))

        // 调用后端API记录交易
        mutateAsync(hash)
          .then(() => {
            navigate({
              to: '/transaction/$hash',
              params: {
                hash
              }
            })
          })
      }
      catch (estimateError: any) {
        console.error('Gas估算或交易错误:', estimateError)

        // 提取错误消息
        const errorMessage = estimateError.message || ''

        // 分析错误类型并提供相应反馈
        if (errorMessage.includes('Amount below minimum')) {
          toast.error(t('payment.errors.amount_below_minimum', { min: minTokenAmount }))
        }
        else if (errorMessage.includes('insufficient funds')) {
          toast.error(t('payment.errors.insufficient_eth'))
        }
        else if (errorMessage.includes('User denied')) {
          toast.error(t('payment.errors.rejected'))
        }
        else {
          // 尝试提取更详细的错误信息
          const innerErrorMatch = errorMessage.match(/reverted with reason string '(.+?)'/i)
          const innerError = innerErrorMatch ? innerErrorMatch[1] : ''

          if (innerError) {
            toast.error(t('payment.errors.contract_revert_with_reason', { reason: innerError }))
          }
          else {
            toast.error(t('payment.errors.transaction_failed'))
          }
        }
      }
    }
    catch (error) {
      console.error('Payment error:', error)

      if (error instanceof Error) {
        if (error.message.includes('rejected')) {
          toast.error(t('payment.errors.rejected'))
        }
        else {
          toast.error(t('payment.errors.general', { error: error.message }))
        }
      }
      else {
        toast.error(t('payment.errors.unknown'))
      }
    }
  }

  useEffect(() => {
    if (ready) {
      const [firstWallet] = wallets
      if (firstWallet) {
        setWallet(firstWallet)
      }
    }

    if (!item) {
      console.log(t('properties.payment.asset_not_found'))
      navigate({
        to: '/properties/detail/$id',
        params
      })
    }
  }, [item, navigate, params, t, ready, wallets])

  if (!item) {
    return null
  }

  const [imageUrl] = joinImagesPath(item.image_urls)

  return (
    <div className="max-w-7xl p-8 space-y-8">
      <div className="text-center text-6 font-medium">{t('common.payment_title')}</div>

      <div className="flex gap-6 rounded-xl bg-[#202329] p-6">
        <div className="h-60 w-100">
          <IImage src={imageUrl} className="size-full rounded" />
        </div>
        <div>
          <div className="text-6 font-medium">{item?.name}</div>

          <div className="grid grid-cols-2 mt-4 gap-x-4">
            <IInfoField
              label={t('properties.detail.location')}
              value={item?.address}
              labelClass="text-[#898989]"
              className="space-y-2"
            />
            <IInfoField
              label={t('properties.detail.property_type')}
              value={item?.property_type}
              labelClass="text-[#898989]"
              className="space-y-2"
            />
            <IInfoField
              label={t('properties.payment.token_price')}
              value={item?.price}
              labelClass="text-[#898989]"
              className="space-y-2"
            />
            <IInfoField
              label={t('properties.payment.total')}
              value={Number(item?.number) * Number(item?.price)}
              labelClass="text-[#898989]"
              className="space-y-2"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-[#202329] p-6 space-y-4">
        <div className="text-4.5">{t('properties.payment.payment_details')}</div>

        <div className="flex items-center justify-between text-4">
          <div className="text-[#898989] space-y-4">
            <div>{t('properties.payment.number')}</div>
            <div>{t('properties.payment.subtotal')}</div>
            <div>
              {t('properties.payment.platform_fee')}
              {' '}
              (2%)
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-end">
              <QuantitySelector
                value={tokens}
                onChange={setTokens}
                min={minTokenAmount}
                disabled={isPending}
              />
            </div>

            <div className="text-right">
              $
              {tokens * Number(item.price)}
            </div>
            <div className="text-right">
              $
              {(tokens * Number(item.price) * 0.02).toFixed(2)}
            </div>
          </div>
        </div>

        <ISeparator className="bg-white" />

        <div className="fbc">
          <div>{t('properties.payment.total_amount')}</div>
          <div className="text-primary">
            $
            {(tokens * Number(item.price) * 1.02).toFixed(2)}
          </div>
        </div>

        {/* 添加最小购买量提示 */}
        <div className="text-xs text-[#f59e0b]">
          {t('payment.info.min_tokens_required', { min: minTokenAmount })}
        </div>
      </div>

      <div className="rounded-xl bg-[#202329] p-6 space-y-4">
        <div className="text-4.5">{t('properties.payment.payment_method')}</div>
        <PaymentMethod walletState={[wallet, setWallet]} />
      </div>

      <div className="rounded-xl bg-[#202329] p-6 text-4 text-[#898989] space-y-2">
        <p>{t('properties.payment.dear_user')}</p>
        <p>
          {t('properties.payment.please_verify')}

        </p>
        <p>
          {t('properties.payment.please_verify_1')}
        </p>
      </div>

      <div>
        <div className="text-center text-3.5 text-[#898989]">
          {t('properties.payment.expire')}
          14:59
        </div>
        <div className="grid grid-cols-3 mt-2">
          <div>
            <Button
              className="text-white bg-transparent!"
              size="large"
              onClick={() => router.history.back()}
            >
              {t('system.cancel')}
            </Button>
          </div>
          <div className="fcc">
            <Button
              type="primary"
              size="large"
              className="w-48 disabled:bg-gray-2 text-black!"
              onClick={payment}
              loading={isPending}
              disabled={isPending || tokens < minTokenAmount}
            >
              <Waiting for={!isPending}>
                {t('properties.payment.confirm_payment')}
              </Waiting>
            </Button>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  )
}
