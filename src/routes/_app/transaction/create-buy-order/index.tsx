import type { ConnectedWallet } from '@privy-io/react-auth'
import apiBasic from '@/api/basicApi'
import { createBuyOrder as createBuyOrderApi } from '@/api/investment'
import { IImage } from '@/components/common/i-image'
import { IInfoField } from '@/components/common/i-info-field'
import ISeparator from '@/components/common/i-separator'
import { PaymentMethod } from '@/components/common/payment-method'
import QuantitySelector from '@/components/common/quantity-selector'
import SimpleERC20ABI from '@/contract/SimpleERC20.json'
import TradingManagerABI from '@/contract/TradingManager.json'
import { joinImagesPath } from '@/utils/url'
import { useWallets } from '@privy-io/react-auth'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { Button, Select, Spin } from 'antd'
import { ethers } from 'ethers'

// 最小购买数量常量
const MIN_TOKEN_PURCHASE = 1 // 设置最小购买量为2个代币，根据合约要求调整

export const Route = createFileRoute('/_app/transaction/create-buy-order/')({
  component: RouteComponent
})

function RouteComponent() {
  const { t } = useTranslation()
  const router = useRouter()
  const navigate = useNavigate()
  const { ready, wallets } = useWallets()
  const [wallet, setWallet] = useState<ConnectedWallet | null>(null)

  const [id, setId] = useState<number | null>(null)
  const [item, setItem] = useState<any>(null)
  const [tokens, setTokens] = useState(MIN_TOKEN_PURCHASE)
  const [minTokenAmount] = useState(MIN_TOKEN_PURCHASE)
  const [isProcessing, setIsProcessing] = useState(false) // 添加处理状态

  const [keyword, setKeyword] = useState('')

  const { data, isLoading } = useQuery<any[]>({
    queryKey: ['properties', keyword],
    queryFn: async () => {
      const res = await apiBasic.getDataList({ keyword })
      return _get(res.data, 'list', [])
    }
  })

  // 资产选择处理
  const handleAssetSelect = (value: number) => {
    setId(value)
    const selectedItem = data?.find((asset: any) => asset.id === value)
    console.log(selectedItem)
    if (selectedItem) {
      setItem(selectedItem)
    }
  }

  // 搜索关键词处理
  const handleSearch = (value: string) => {
    setKeyword(value)
  }

  // 处理清空搜索
  const handleClear = () => {
    setKeyword('')
  }

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      const res = await createBuyOrderApi({
        id: `${item.id}`,
        token_number: `${tokens}`,
        token_price: item.price,
        sell_order_id: `${id}`
      })
      return res.data
    }
  })

  async function createBuyOrder() {
    try {
      setIsProcessing(true) // 开始处理时设置为 true

      if (!wallet) {
        toast.error(t('payment.errors.no_wallet'))
        return
      }

      // 检查资产是否存在
      if (!item) {
        toast.error(t('properties.payment.asset_not_found'))
        return
      }

      if (!item.price || _isNaN(Number(item.price))) {
        console.error('Token price is undefined or invalid:', item.price)
        toast.error(t('payment.errors.invalid_token_price'))
        return
      }

      // 检查 contract_address 是否存在
      if (!item.contract_address) {
        console.error('Token address is undefined:', item.contract_address)
        toast.error(t('payment.errors.property_token_not_initialized'))
        return
      }

      // 检查购买数量是否达到最小要求
      if (tokens < minTokenAmount) {
        toast.error(t('payment.errors.amount_below_minimum', { min: minTokenAmount }))
        return
      }

      const ethProvider = await wallet.getEthereumProvider()
      const provider = new ethers.BrowserProvider(ethProvider)
      const signer = await provider.getSigner()

      const usdtContract = new ethers.Contract(
        SimpleERC20ABI.address,
        SimpleERC20ABI.abi,
        signer
      )

      const tradingManagerContract = new ethers.Contract(
        TradingManagerABI.address,
        TradingManagerABI.abi,
        signer
      )

      // 获取USDT decimals
      const usdtDecimals = await usdtContract.decimals()

      // 设置购买参数
      const tokenAmount = BigInt(tokens)
      const tokenPrice = ethers.parseUnits(`${item.price}`, 18)
      const requiredUsdt = tokenAmount * tokenPrice

      // 获取签名者地址
      const signerAddress = await signer.getAddress()

      // 检查USDT余额
      const usdtBalance = await usdtContract.balanceOf(signerAddress)
      if (usdtBalance < requiredUsdt) {
        toast.error(t('payment.errors.insufficient_usdt', {
          required: ethers.formatUnits(requiredUsdt, usdtDecimals),
          balance: ethers.formatUnits(usdtBalance, usdtDecimals)
        }))
        return
      }

      // 检查USDT授权额度
      const currentAllowance = await usdtContract.allowance(
        signerAddress,
        TradingManagerABI.address
      )

      // 如果授权额度不足，进行授权
      if (currentAllowance < requiredUsdt) {
        toast.info(t('payment.messages.approving_usdt'))

        // 授权一个足够大的额度
        const approveTx = await usdtContract.approve(
          TradingManagerABI.address,
          requiredUsdt
        )

        toast.info(t('payment.messages.waiting_for_approval'))
        await approveTx.wait()

        // 再次检查授权额度
        const newAllowance = await usdtContract.allowance(
          signerAddress,
          TradingManagerABI.address
        )

        if (newAllowance < requiredUsdt) {
          toast.error(t('payment.errors.approval_failed'))
          return
        }
      }

      // 创建买单
      toast.info(t('payment.messages.creating_buy_order'))
      const buyTx = await tradingManagerContract.createBuyOrder(
        item.contract_address,
        `${item.id}`,
        tokenAmount,
        tokenPrice
      )

      toast.info(t('payment.messages.waiting_for_confirmation'))
      await buyTx.wait()

      // 调用后端API记录购买信息
      await mutateAsync()

      toast.success(t('payment.messages.buy_order_created'))
      navigate({ to: '/home' })
    }
    catch (error) {
      console.error(`执行买单失败:`, error)
      toast.error(t('payment.errors.transaction_failed'))
      throw error
    }
    finally {
      setIsProcessing(false) // 无论成功或失败，最终都设置为 false
    }
  }

  useEffect(() => {
    if (ready) {
      const [firstWallet] = wallets
      if (firstWallet) {
        setWallet(firstWallet)
      }
    }
  }, [navigate, t, ready, wallets])

  const renderAssetSelection = () => (
    <div className="rounded-xl bg-[#202329] p-6 space-y-4">
      <div className="text-4.5">{t('properties.payment.select_asset')}</div>
      <Select
        showSearch
        allowClear
        placeholder={t('properties.payment.search_asset')}
        optionFilterProp="children"
        onChange={handleAssetSelect}
        onSearch={handleSearch}
        onClear={handleClear}
        filterOption={(input, option) =>
          (option?.label?.toString().toLowerCase() ?? '').includes(input.toLowerCase())}
        loading={isLoading}
        className="w-full"
        dropdownStyle={{ background: '#2c2f36', color: 'white' }}
        notFoundContent={isLoading ? <Spin size="small" /> : null}
        options={data?.map((asset: any) => ({
          value: asset.id,
          label: asset.name
        }))}
      />
    </div>
  )

  return (
    <div className="max-w-7xl p-8 space-y-8">
      <div className="text-center text-6 font-medium">{t('common.payment_title')}</div>

      {/* 添加资产选择下拉框 */}
      {renderAssetSelection()}

      {!item
        ? (
            <div className="rounded-xl bg-[#202329] p-6 text-center">
              {t('properties.payment.select_asset_prompt') }
            </div>
          )
        : (
            <>
              <div className="flex gap-6 rounded-xl bg-[#202329] p-6">
                <div className="h-60 w-100">
                  <IImage src={joinImagesPath(item.image_urls)[0]} className="size-full rounded" />
                </div>
                <div className="flex-1">
                  <div className="text-6 font-medium">{item?.name}</div>

                  <div className="mt-4 w-full space-y-4">
                    <IInfoField
                      label={t('properties.detail.property_type')}
                      value={item?.property_type}
                      horizontal
                      labelClass="text-[#898989]"
                      valueClass="text-left"
                    />

                    <IInfoField
                      label={t('properties.detail.location')}
                      value={item?.address}
                      horizontal
                      labelClass="text-[#898989]"
                      valueClass="text-left"
                    />

                    <IInfoField
                      label={t('properties.payment.token_price')}
                      value={item?.price}
                      horizontal
                      labelClass="text-[#898989]"
                      valueClass="text-left"
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
                  Your account must be fully verified with a valid government-issued ID or passport.
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
                      onClick={createBuyOrder}
                      loading={isPending || isProcessing}
                      disabled={isPending || isProcessing || tokens < minTokenAmount}
                    >
                      {t('properties.payment.confirm_payment')}
                    </Button>
                  </div>
                  <div></div>
                </div>
              </div>
            </>
          )}
    </div>
  )
}
