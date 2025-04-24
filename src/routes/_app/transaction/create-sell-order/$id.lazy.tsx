import type { ConnectedWallet } from '@privy-io/react-auth'
import { sellAsset } from '@/api/investment'
import { IImage } from '@/components/common/i-image'
import { IInfoField } from '@/components/common/i-info-field'
import ISeparator from '@/components/common/i-separator'
import { PaymentMethod } from '@/components/common/payment-method'
import QuantitySelector from '@/components/common/quantity-selector'
import PropertyTokenABI from '@/contract/PropertyToken.json'
import TradingManagerABI, { address as TradingManagerAddress } from '@/contract/TradingManager.json'
import { Env } from '@/lib/global'
import { useCommonDataStore } from '@/stores/common-data'
import { joinImagesPath } from '@/utils/url'
import { useWallets } from '@privy-io/react-auth'
import { useMutation } from '@tanstack/react-query'
import { createLazyFileRoute, useMatch, useNavigate, useRouter } from '@tanstack/react-router'
import { Button } from 'antd'
import { ethers } from 'ethers'
import numeral from 'numeral'

export const Route = createLazyFileRoute('/_app/transaction/create-sell-order/$id')({
  component: RouteComponent
})

function RouteComponent() {
  const { t } = useTranslation()
  const router = useRouter()
  const navigate = useNavigate()
  const { ready, wallets } = useWallets()
  const [wallet, setWallet] = useState<ConnectedWallet | null>(null)
  const [isApproving, setIsApproving] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const { params } = useMatch({
    from: '/_app/transaction/create-sell-order/$id'
  })

  const id = Number.parseInt(params.id)
  const investmentItems = useCommonDataStore(state => state.investmentItems)

  const item = investmentItems.get(id)!

  const [tokens, setTokens] = useState(1)

  const { isPending, mutate } = useMutation({
    mutationFn: async (hash: string) => {
      const res = await sellAsset({
        order_market_id: item.id,
        hash
      })
      return res.data
    }
  })

  async function sell() {
    if (!wallet) {
      toast.error(t('payment.errors.no_wallet'))
      return
    }

    setIsProcessing(true)

    const provider = new ethers.JsonRpcProvider(Env.web3.rpc)

    try {
      // TODO: 测试用合约地址和ID，后续删除
      ;(item as any).id = 'PROP-1745501565874'
      item.contract_address = '0x1c38DE9B3011431eF58e0302e38C0977519AC41f'

      // 1. 正确获取钱包signer
      try {
        // TODO: 测试用钱包，后续删除
        const investor = new ethers.Wallet('877bfccd2c9e75a46571117dde988cfc01556f252352dec24efa91bddbf87b4b', provider)

        const propertyTokenContract = new ethers.Contract(
          item.contract_address,
          PropertyTokenABI.abi,
          investor
        )

        const tradingManagerContract = new ethers.Contract(
          TradingManagerAddress,
          TradingManagerABI.abi,
          investor
        )

        // 3. 检查合约是否可用
        if (!propertyTokenContract || !tradingManagerContract) {
          toast.error(t('payment.errors.contract_not_initialized'))
          return
        }

        // 4. 获取代币信息
        const tokenSymbol = await propertyTokenContract.symbol()
        const tokenName = await propertyTokenContract.name()
        const tokenDecimals = await propertyTokenContract.decimals()

        console.log(`代币信息: ${tokenName} (${tokenSymbol})`)
        console.log(`小数位数: ${tokenDecimals}`)

        // 5. 设置交易参数
        const tokenAmount = ethers.parseUnits('2', 18)
        const tokenPrice = BigInt(3)

        console.log('创建卖单参数:')
        console.log(`- 代币地址: ${item.contract_address}`)
        console.log(`- 房产ID: ${item.id}`)
        console.log(`- 数量: ${ethers.formatUnits(tokenAmount, tokenDecimals)} 个代币`)
        console.log(`- 价格: ${tokenPrice} USDT/代币`)

        // 6. 检查余额
        const operatorTokenBalance = await propertyTokenContract.balanceOf(investor.address)
        console.log(`操作者代币余额: ${ethers.formatUnits(operatorTokenBalance, tokenDecimals)} 个代币`)

        // 7. 检查授权
        const currentTokenAllowance = await propertyTokenContract.allowance(
          investor,
          TradingManagerAddress
        )

        if (operatorTokenBalance < tokenAmount) {
          toast.error(`代币余额不足: ${ethers.formatUnits(operatorTokenBalance, tokenDecimals)} < ${ethers.formatUnits(tokenAmount, tokenDecimals)}`)
          setIsProcessing(false)
          return
        }

        console.log(`当前代币授权额度: ${ethers.formatUnits(currentTokenAllowance, tokenDecimals)}`)

        // 8. 如果授权不足则进行授权
        if (currentTokenAllowance < tokenAmount) {
          setIsApproving(true)
          toast.info('正在授权代币...')

          try {
            const tokenApproveTx = await propertyTokenContract.approve(
              TradingManagerAddress,
              tokenAmount
            )

            console.log(`授权交易已发送: ${tokenApproveTx.hash}`)
            await tokenApproveTx.wait()
            console.log('授权交易已确认')
            toast.success('代币授权成功')

            const newAllowance = await propertyTokenContract.allowance(
              investor,
              TradingManagerAddress
            )
            console.log(`新的授权额度: ${ethers.formatUnits(newAllowance, tokenDecimals)}`)
          }
          catch (error: any) {
            console.error('授权失败:', error)
            toast.error(`授权失败: ${error.message}`)
            setIsApproving(false)
            setIsProcessing(false)
            return
          }
          setIsApproving(false)
        }

        // 9. 创建卖单
        toast.info('正在创建卖单...')
        console.log('发送createSellOrder交易')

        try {
          const gasLimit = await tradingManagerContract.createSellOrder.estimateGas(
            item.contract_address,
            String(item.id),
            tokenAmount,
            tokenPrice
          )

          console.log(`预估gas: ${gasLimit.toString()}`)

          const tx = await tradingManagerContract.createSellOrder(
            item.contract_address,
            String(item.id),
            tokenAmount,
            tokenPrice,
            { gasLimit: Math.floor(Number(gasLimit) * 1.2) } // 增加20%的gas限制
          )

          console.log(`交易已发送: ${tx.hash}`)
          toast.success('交易已发送')

          const receipt = await tx.wait()
          console.log(`交易已确认，块号: ${receipt.blockNumber}`)
          toast.success('卖单创建成功')

          // 10. 记录交易
          mutate(tx.hash)

          // 11. 返回上一页
          setTimeout(() => {
            router.history.back()
          }, 2000)
        }
        catch (error: any) {
          console.error('创建卖单失败:', error)

          if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
            toast.error('交易已被拒绝')
          }
          else {
            console.error(`创建卖单失败: ${error.message}`)
          }
        }
      }
      catch (error: any) {
        console.error('获取钱包失败:', error)
      }
    }
    catch (error: any) {
      console.error('交易过程中出现错误:', error)
    }
    finally {
      setIsProcessing(false)
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
      toast.error(t('properties.payment.asset_not_found'))
      navigate({
        to: '/investment'
      })
    }
  }, [item, navigate, params, t, ready, wallets])

  if (!item) {
    return null
  }

  const [imageUrl] = joinImagesPath(item.image_urls)

  return (
    <div className="max-w-7xl p-8 space-y-8">
      <div className="text-center text-6 font-medium">{t('common.sell_title')}</div>

      <div className="flex gap-6 rounded-xl bg-[#202329] p-6">
        <div className="h-60 w-100">
          <IImage src={imageUrl} className="size-full rounded" />
        </div>
        <div>
          <div className="text-6 font-medium">{item?.name}</div>

          <div className="grid grid-cols-2 mt-4 gap-x-4">
            <IInfoField
              label={t('properties.detail.location')}
              value={item?.location}
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
              value={`${numeral(item?.total_amount).format('0,0')} / token`}
              labelClass="text-[#898989]"
              className="space-y-2"
            />
            <IInfoField
              label={t('properties.payment.total')}
              value={numeral(Number(item?.total_amount) * item.tokens_held).format('0,0')}
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
            <div>{t('properties.payment.tokens_held')}</div>
            <div>{t('properties.payment.number')}</div>
            <div>{t('properties.payment.subtotal')}</div>
            <div>
              {t('properties.payment.platform_fee')}
              {' '}
              (2%)
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-right text-[#898989]">{item.tokens_held}</div>
            <div className="flex justify-end">
              <QuantitySelector
                value={tokens}
                onChange={setTokens}
                min={1}
                max={item.tokens_held}
                disabled={isPending || isProcessing}
              />
            </div>

            <div className="text-right">
              $
              {tokens * Number(item.token_price)}
            </div>
            <div className="text-right">
              $
              {tokens * Number(item.token_price) * 0.02}
            </div>
          </div>
        </div>

        <ISeparator className="bg-white" />

        <div className="fbc">
          <div>{t('properties.payment.total_amount')}</div>
          <div className="text-primary">
            {`$${(tokens * Number(item.token_price)) + (tokens * Number(item.token_price) * 0.02)}`}
          </div>
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
              onClick={sell}
              loading={isApproving || isProcessing}
              disabled={isPending || isApproving || isProcessing}
            >
              {isApproving ? t('payment.errors.approving_tokens') : t('action.confirm_sell')}
            </Button>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  )
}
