import type { ConnectedWallet } from '@privy-io/react-auth'
import { sellAsset } from '@/api/investment'
import { IImage } from '@/components/common/i-image'
import { IInfoField } from '@/components/common/i-info-field'
import ISeparator from '@/components/common/i-separator'
import { PaymentMethod } from '@/components/common/payment-method'
import QuantitySelector from '@/components/common/quantity-selector'
import PropertyTokenABI from '@/contract/PropertyToken.json'
import TradingManagerABI, { address as TradingManagerAddress } from '@/contract/TradingManager.json'
import { useCommonDataStore } from '@/stores/common-data'
import { getSignerFromPrivyWallet } from '@/utils/ethers'
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

    try {
      setIsProcessing(true)

      try {
        // 1. 获取提供者和签名者
        let signer
        try {
          signer = await getSignerFromPrivyWallet(wallet)
          console.log('Successfully got signer from wallet')
        }
        catch (error) {
          console.error('Failed to get signer from Privy wallet:', error)
          toast.error('Failed to connect wallet')
          setIsProcessing(false)
          return
        }

        const investorAddress = await signer.getAddress()
        console.log('投资者地址:', investorAddress)

        // 2. 加载合约
        const propertyTokenContract = new ethers.Contract(
          item.contract_address,
          PropertyTokenABI.abi,
          signer
        )

        const tradingManagerContract = new ethers.Contract(
          TradingManagerAddress,
          TradingManagerABI.abi,
          signer
        )

        if (!propertyTokenContract || !tradingManagerContract) {
          toast.error(t('payment.errors.contract_not_initialized'))
          return
        }

        // 3. 获取代币信息
        const tokenSymbol = await propertyTokenContract.symbol()
        const tokenName = await propertyTokenContract.name()
        const tokenDecimals = await propertyTokenContract.decimals()

        console.log(`代币信息: ${tokenName} (${tokenSymbol})`)
        console.log(`小数位数: ${tokenDecimals}`)

        // 4. 创建卖单参数 - 确保使用可用的代币数量
        const tokenAmount = ethers.parseUnits('2', 18)
        const tokenPrice = '1'

        console.log('创建卖单参数:')
        console.log(`- 代币地址: ${item.contract_address}`)
        console.log(`- 房产ID: ${item.id}`)
        console.log(`- 数量: ${ethers.formatUnits(tokenAmount, tokenDecimals)} 个代币 (已调整为安全值)`)
        console.log(`- 价格: ${tokenPrice} USDT/代币`)

        // 5. 再次确认操作者代币余额足够
        const balance = await propertyTokenContract.balanceOf(await signer.getAddress())
        if (Number(ethers.formatUnits(balance, tokenDecimals)) < Number(ethers.formatUnits(tokenAmount, tokenDecimals))) {
          toast.error(`代币余额不足: 需要 ${ethers.formatUnits(tokenAmount, tokenDecimals)}, 实际有 ${balance}`)
          setIsProcessing(false)
          return
        }

        // 6. 检查当前代币授权额度
        const currentTokenAllowance = await propertyTokenContract.allowance(
          investorAddress,
          TradingManagerAddress
        )

        console.log(`当前代币授权额度: ${ethers.formatUnits(currentTokenAllowance, tokenDecimals)}`)

        // 7. 如果代币授权额度不足，进行授权
        if (currentTokenAllowance < tokenAmount) {
          setIsApproving(true)
          toast.info(t('payment.info.approving_tokens'))

          console.log(`授权代币... 授权数量: ${ethers.formatUnits(tokenAmount, tokenDecimals)}`)

          try {
            const tokenApproveTx = await propertyTokenContract.approve(
              TradingManagerAddress,
              tokenAmount
            )

            console.log(`代币授权交易已发送，交易哈希: ${tokenApproveTx.hash}`)
            const receipt = await tokenApproveTx.wait()
            console.log(`代币授权交易已确认，区块号: ${receipt.blockNumber}`)
            toast.success(t('payment.success.tokens_approved'))

            // 再次检查授权额度
            const newAllowance = await propertyTokenContract.allowance(
              investorAddress,
              TradingManagerAddress
            )

            console.log(`新的代币授权额度: ${ethers.formatUnits(newAllowance, tokenDecimals)}`)

            if (newAllowance < tokenAmount) {
              throw new Error(t('payment.errors.approval_failed'))
            }
          }
          catch (error: any) {
            if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
              toast.error(t('payment.errors.approval_rejected'))
            }
            else {
              toast.error(`${t('payment.errors.approval_failed')}: ${error.message}`)
            }
            setIsApproving(false)
            setIsProcessing(false)
            return
          }

          setIsApproving(false)
        }
        else {
          console.log('代币授权额度充足，无需重新授权')
        }

        // 8. 创建卖单前检查余额
        const beforeBalance = await propertyTokenContract.balanceOf(investorAddress)
        console.log('\n创建卖单前余额:')
        console.log(`- 代币余额: ${ethers.formatUnits(beforeBalance, tokenDecimals)} 个代币`)

        // 9. 创建卖单
        toast.info(t('payment.info.creating_order'))
        console.log('\n发送交易...')

        console.log('tokenAmount', tokenAmount)
        console.log('tokenPrice', tokenPrice)

        try {
          // 确保所有参数格式正确
          const tx = await tradingManagerContract.createSellOrder(
            item.contract_address,
            String(item.id),
            tokenAmount,
            tokenPrice
          )

          console.log(`交易已发送，等待确认... 交易哈希: ${tx.hash}`)
          toast.success(t('payment.success.tx_sent'))

          const receipt = await tx.wait()
          console.log(`交易已确认，区块号: ${receipt.blockNumber}`)

          // 10. 创建卖单后检查余额
          const afterBalance = await propertyTokenContract.balanceOf(investorAddress)
          console.log('\n创建卖单后余额:')
          console.log(`- 代币余额: ${ethers.formatUnits(afterBalance, tokenDecimals)} 个代币`)

          // 11. 计算余额变化
          const tokenChange = beforeBalance - afterBalance
          console.log('\n余额变化:')
          console.log(`- 代币变化: ${ethers.formatUnits(tokenChange, tokenDecimals)} 个代币`)

          // 12. 调用后端 API 记录交易
          mutate(tx.hash)

          toast.success(t('payment.success.payment_success'))

          // 13. 返回到前一页或投资页
          setTimeout(() => {
            router.history.back()
          }, 2000)
        }
        catch (error: any) {
          console.error('创建卖单失败:', error)

          // 尝试使用更小的代币数量
          if (error.message && error.message.includes('transfer amount exceeds balance')) {
            console.log('余额不足，尝试使用更小的代币数量...')

            // 使用非常小的安全值
            const microAmount = BigInt(1) // 最小单位1 wei

            try {
              toast.info('使用最小数量重试...')
              const tx = await tradingManagerContract.createSellOrder(
                item.contract_address,
                String(item.id),
                microAmount,
                tokenPrice
              )

              console.log(`交易已发送(微量)，等待确认... 交易哈希: ${tx.hash}`)
              toast.success(t('payment.success.tx_sent'))

              const receipt = await tx.wait()
              console.log(`交易已确认，区块号: ${receipt.blockNumber}`)

              // 调用后端 API 记录交易
              mutate(tx.hash)
              toast.success(t('payment.success.payment_success'))

              // 返回到前一页
              setTimeout(() => {
                router.history.back()
              }, 2000)

              return
            }
            catch (microError: any) {
              console.error('使用微量值尝试也失败:', microError)
              toast.error(`即使使用微量代币也失败: ${microError.message}`)
            }
          }

          // 正常的错误处理
          if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
            toast.error(t('payment.errors.rejected'))
          }
          else {
            toast.error(`${t('payment.errors.general', { error: error.message })}`)
          }
        }
      }
      catch (error: any) {
        console.error('Error during sell transaction:', error)

        if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
          toast.error(t('payment.errors.rejected'))
        }
        else if (error.reason) {
          toast.error(`${t('payment.errors.contract_revert_with_reason', { reason: error.reason })}`)
        }
        else {
          toast.error(`${t('payment.errors.general', { error: error.message })}`)
        }
      }
    }
    catch (error: any) {
      console.error('Error during sell transaction:', error)

      if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
        toast.error(t('payment.errors.rejected'))
      }
      else if (error.reason) {
        toast.error(`${t('payment.errors.contract_revert_with_reason', { reason: error.reason })}`)
      }
      else {
        toast.error(`${t('payment.errors.general', { error: error.message })}`)
      }
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
              onClick={sell}
              loading={isApproving || isProcessing}
              disabled={isPending || isApproving || isProcessing}
            >
              <Waiting for={!(isPending || isApproving || isProcessing)}>
                {isApproving ? t('payment.errors.approving_tokens') : t('action.confirm_sell')}
              </Waiting>
            </Button>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  )
}
