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

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (sell_order_id: number) => {
      const res = await sellAsset({
        id: `${item.id}`,
        token_number: `${tokens}`,
        sell_order_id: `${sell_order_id}`
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

    console.log(wallet)

    // item.contract_address = '0xa0FA9cfEC8B6F8E0C3C7edBbBA3Ae5237FF6D4f3'
    // ;(item as any).id = 'PROP-1746803801088'
    // wallet.address = '0xA5922D51BfD5b9381f1FF32418FddFdE35582cAC'

    try {
      // 获取以太坊提供者并创建签名者
      const ethProvider = await wallet.getEthereumProvider()
      const provider = new ethers.BrowserProvider(ethProvider)
      const signer = await provider.getSigner()

      // 获取当前链ID和地址
      const network = await provider.getNetwork()
      const signerAddress = await signer.getAddress()
      console.log(`当前连接的链ID: ${network.chainId}`)
      console.log(`签名者地址: ${signerAddress}`)

      // 获取余额
      const balance = await provider.getBalance(signerAddress)
      console.log(`账户余额: ${ethers.formatEther(balance)} ETH`)

      try {
        // 打印合约地址以便检查
        console.log(`PropertyToken 合约地址: ${item.contract_address}`)
        console.log(`TradingManager 合约地址: ${TradingManagerAddress}`)

        const propertyTokenContract = new ethers.Contract(
          item.contract_address,
          PropertyTokenABI.abi,
          signer
        )

        const tradingManagerContract = new ethers.Contract(
          TradingManagerABI.address,
          TradingManagerABI.abi,
          signer
        )

        // 3. 检查合约是否可用
        if (!propertyTokenContract || !tradingManagerContract) {
          toast.error(t('payment.errors.contract_not_initialized'))
          setIsProcessing(false)
          return
        }

        // 4. 获取代币信息
        const tokenSymbol = await propertyTokenContract.symbol()
        const tokenName = await propertyTokenContract.name()
        const tokenDecimals = await propertyTokenContract.decimals()

        console.log(`代币信息: ${tokenName} (${tokenSymbol})`)
        console.log(`小数位数: ${tokenDecimals}`)

        // 5. 设置交易参数 - 使用合约实际 decimals
        const tokenAmount = ethers.parseUnits(`${tokens}`, 18)
        const tokenPrice = ethers.parseUnits(`${item.token_price}`, 18)

        console.log('创建卖单参数:')
        console.log(`- 代币地址: ${item.contract_address}`)
        console.log(`- 房产ID: ${item.id}`)
        console.log(`- 数量: ${ethers.formatUnits(tokenAmount, tokenDecimals)} 个代币`)
        console.log(`- 价格: ${ethers.formatUnits(tokenPrice, 18)} USDT/代币`)

        // 6. 检查余额（链上余额）
        const operatorTokenBalance = await propertyTokenContract.balanceOf(wallet.address)
        console.log(`操作者代币余额: ${ethers.formatUnits(operatorTokenBalance, tokenDecimals)} 个代币`)

        if (operatorTokenBalance < tokenAmount) {
          toast.error(`代币余额不足: ${ethers.formatUnits(operatorTokenBalance, tokenDecimals)} < ${ethers.formatUnits(tokenAmount, tokenDecimals)}`)
          setIsProcessing(false)
          return
        }

        // 7. 检查授权
        const currentTokenAllowance = await propertyTokenContract.allowance(
          wallet.address,
          TradingManagerAddress
        )

        console.log(`当前代币授权额度: ${ethers.formatUnits(currentTokenAllowance, 18)}`)

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
            toast.info(`授权交易已发送，等待确认...`)

            await tokenApproveTx.wait()
            console.log('授权交易已确认')
            toast.success('代币授权成功')

            // 验证授权是否成功
            const newAllowance = await propertyTokenContract.allowance(
              wallet.address,
              TradingManagerAddress
            )
            console.log(`新的授权额度: ${ethers.formatUnits(newAllowance, 18)}`)

            // 确保授权成功
            if (newAllowance < tokenAmount) {
              toast.error('授权失败，请重试')
              setIsApproving(false)
              setIsProcessing(false)
              return
            }
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
          console.log('交易参数:')
          console.log(`- 合约地址: ${item.contract_address}`)
          console.log(`- 房产ID: ${item.id}`)
          console.log(`- 代币数量: ${ethers.formatUnits(tokenAmount, 18)}`)
          console.log(`- 价格: ${ethers.formatUnits(tokenPrice, 18)}`)

          // 使用与授权相同的tokenAmount变量
          const tx = await tradingManagerContract.createSellOrder(
            item.contract_address,
            String(item.id),
            tokenAmount,
            tokenPrice
          )

          console.log(`交易已发送: ${tx.hash}`)
          console.log('tx', tx)
          toast.success('交易已发送')

          const receipt = await tx.wait()
          console.log('交易已确认', receipt)
          toast.success('卖单创建成功')

          const orders = await tradingManagerContract.getUserOrders(wallet.address)
          console.log('用户订单:', orders)
          const lastOrderId = orders[orders.length - 1]
          console.log('最后一个订单ID:', lastOrderId)

          // 10. 记录交易
          await mutateAsync(lastOrderId)

          // 11. 返回上一页
          setTimeout(() => {
            router.history.back()
          }, 2000)
        }
        catch (error: any) {
          console.error('创建卖单失败:', error)

          // 更详细地记录错误信息
          console.error('错误详情:', JSON.stringify({
            code: error.code,
            message: error.message,
            data: error.data,
            reason: error.reason,
            stack: error.stack
          }, null, 2))

          if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
            toast.error('交易已被拒绝')
          }
          else if (error.message && error.message.includes('user rejected transaction')) {
            toast.error('用户拒绝了交易')
          }
          else if (error.message && error.message.includes('insufficient funds')) {
            toast.error('账户余额不足，无法支付 gas 费用')
          }
          else {
            toast.error('创建卖单失败')
          }

          setIsProcessing(false)
        }
      }
      catch (error: any) {
        console.error('获取钱包失败:', error)
        toast.error(`获取钱包失败: ${error.message || '未知错误'}`)
        setIsProcessing(false)
      }
    }
    catch (error: any) {
      console.error('交易过程中出现错误:', error)
      toast.error(`交易过程中出现错误: ${error.message || '未知错误'}`)
      setIsProcessing(false)
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
        to: '/profile'
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
        <div className="text-4.5">{t('transaction.sell.detail')}</div>

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
