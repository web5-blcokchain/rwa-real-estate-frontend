import type { ConnectedWallet } from '@privy-io/react-auth'
import apiBasic from '@/api/basicApi'
import { IImage } from '@/components/common/i-image'
import { IInfoField } from '@/components/common/i-info-field'
import ISeparator from '@/components/common/i-separator'
import { PaymentMethod } from '@/components/common/payment-method'
import { usePropertyManagerContract, useTradingManagerContract } from '@/contract'
import { useCommonDataStore } from '@/stores/common-data'
import { joinImagesPath } from '@/utils/url'
import { getWeb3Instance } from '@/utils/web3'
import { useWallets } from '@privy-io/react-auth'
import { useMutation } from '@tanstack/react-query'
import { createLazyFileRoute, useMatch, useNavigate, useRouter } from '@tanstack/react-router'
import { Button } from 'antd'
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

  const assetDetail = assets.get(id)!

  // 默认购买量设置为最小值
  const [tokens, setTokens] = useState(MIN_TOKEN_PURCHASE)

  const plus = () => setTokens(tokens + 1)
  const minus = () => {
    if (tokens > minTokenAmount) {
      setTokens(tokens - 1)
    }
  }
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (hash: string) => {
      const res = await apiBasic.purchaseBuy({
        id: assetDetail.id,
        number: tokens,
        hash
      })
      return res.data
    }
  })

  // 获取最小购买量
  useEffect(() => {
    const fetchMinAmount = async () => {
      if (tradingManagerContract && assetDetail?.contract_address) {
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
  }, [tradingManagerContract, assetDetail])

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

      // 首先获取当前房产的合约地址
      if (!assetDetail.contract_address || !isAddress(assetDetail.contract_address)) {
        toast.error(t('payment.errors.invalid_contract'))
        return
      }

      const contractAddress = assetDetail.contract_address
      const investorAddress = wallet.address

      // 检查投资者ETH余额是否充足
      const web3 = getWeb3Instance()
      const investorBalance = await web3.eth.getBalance(investorAddress)
      const minBalance = web3.utils.toWei('0.01', 'ether') // 最小需要0.01 ETH

      if (BigInt(investorBalance) < BigInt(minBalance)) {
        toast.error(t('payment.errors.insufficient_eth'))
        return
      }

      // 展示购买信息
      console.log('初始购买信息:')
      console.log(`- 房产ID: ${assetDetail.id}`)
      console.log(`- 代币合约地址: ${contractAddress}`)
      console.log(`- 数量: ${tokens}`)

      // 执行初始购买
      toast.info(t('payment.info.creating_transaction'))

      // 验证propertyManagerContract已经初始化
      if (!propertyManagerContract || !propertyManagerContract.methods) {
        toast.error(t('payment.errors.contract_not_initialized'))
        return
      }

      try {
        // 输出调试信息，查看当前房产ID
        console.log('调用合约前的房产信息:')
        console.log(`- 房产ID类型: ${typeof assetDetail.id}`)
        console.log(`- 房产ID值: ${assetDetail.id}`)
        console.log(`- 房产合约地址: ${contractAddress}`)

        // 确保我们传递正确的房产标识符
        // 可能合约需要使用房产的合约地址或其他标识符，而不是仅仅使用ID
        const propertyIdentifier = assetDetail.id.toString()

        // 估算gas以检查交易是否可能成功
        const gasEstimate = await propertyManagerContract.methods.initialBuyPropertyToken(
          propertyIdentifier, // 使用合约地址作为房产标识符
          tokens.toString()
        ).estimateGas({ from: investorAddress })

        console.log('预估的gas用量:', gasEstimate)

        // 增加20%的gas以避免gas不足
        const gasLimit = Math.floor(Number(gasEstimate) * 1.2).toString()

        // 执行交易
        const initialBuyTx = await propertyManagerContract.methods.initialBuyPropertyToken(
          propertyIdentifier, // 同样使用合约地址作为房产标识符
          tokens.toString()
        ).send({
          from: investorAddress,
          gas: gasLimit
        })

        toast.success(t('payment.success.tx_sent'))
        const hash = initialBuyTx.transactionHash.toString()

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

        // 检查是否是最小数量错误
        if (errorMessage.includes('Amount below minimum')) {
          toast.error(t('payment.errors.amount_below_minimum', { min: minTokenAmount }))
          return
        }

        // 尝试提取更详细的错误信息
        const innerErrorMatch = errorMessage.match(/reverted with reason string '(.+?)'/i)
        const innerError = innerErrorMatch ? innerErrorMatch[1] : ''

        if (innerError) {
          toast.error(t('payment.errors.contract_revert_with_reason', { reason: innerError }))
        }
        else if (errorMessage.includes('insufficient funds')) {
          toast.error(t('payment.errors.insufficient_eth'))
        }
        else if (errorMessage.includes('User denied')) {
          toast.error(t('payment.errors.rejected'))
        }
        else {
          toast.error(t('payment.errors.transaction_failed'))
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

    if (!assetDetail) {
      console.log(t('properties.payment.asset_not_found'))
      navigate({
        to: '/properties/detail/$id',
        params
      })
    }
  }, [assetDetail, navigate, params, t, ready, wallets])

  if (!assetDetail) {
    return null
  }

  const [imageUrl] = joinImagesPath(assetDetail.image_urls)

  return (
    <div className="max-w-7xl p-8 space-y-8">
      <div className="text-center text-6 font-medium">{t('common.payment_title')}</div>

      <div className="flex gap-6 rounded-xl bg-[#202329] p-6">
        <div className="h-60 w-100">
          <IImage src={imageUrl} className="size-full rounded" />
        </div>
        <div>
          <div className="text-6 font-medium">{assetDetail?.name}</div>

          <div className="grid grid-cols-2 mt-4 gap-x-4">
            <IInfoField
              label={t('properties.detail.location')}
              value={assetDetail?.address}
              labelClass="text-[#898989]"
              className="space-y-2"
            />
            <IInfoField
              label={t('properties.detail.property_type')}
              value={assetDetail?.property_type}
              labelClass="text-[#898989]"
              className="space-y-2"
            />
            <IInfoField
              label={t('properties.payment.token_price')}
              value={assetDetail?.price}
              labelClass="text-[#898989]"
              className="space-y-2"
            />
            <IInfoField
              label={t('properties.payment.total')}
              value={Number(assetDetail?.number) * Number(assetDetail?.price)}
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
            <div className="fyc gap-4">
              <Button className="b-none text-white bg-[#374151]!" onClick={minus} disabled={tokens <= minTokenAmount}>-</Button>
              <div className="w-12 select-none text-center">{tokens}</div>
              <Button className="b-none text-white bg-[#374151]!" onClick={plus}>+</Button>
            </div>

            <div className="text-right">
              $
              {tokens * Number(assetDetail.price)}
            </div>
            <div className="text-right">
              $
              {(tokens * Number(assetDetail.price) * 0.02).toFixed(2)}
            </div>
          </div>
        </div>

        <ISeparator className="bg-white" />

        <div className="fbc">
          <div>{t('properties.payment.total_amount')}</div>
          <div className="text-primary">
            $
            {(tokens * Number(assetDetail.price) * 1.02).toFixed(2)}
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
