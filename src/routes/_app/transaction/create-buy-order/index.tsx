import type { ConnectedWallet } from '@privy-io/react-auth'
import apiBasic from '@/api/basicApi'
import { createBuyOrder as createBuyOrderApi } from '@/api/investment'
import { IImage } from '@/components/common/i-image'
import { IInfoField } from '@/components/common/i-info-field'
import ISeparator from '@/components/common/i-separator'
import { PaymentContent } from '@/components/common/payment-content'
import QuantitySelector from '@/components/common/quantity-selector'
import { formatNumberNoRound, toBigNumer } from '@/utils/number'
import { joinImagesPath } from '@/utils/url'
import { getTradeContract, listenerCreateSellEvent, createBuyOrder as toCreateBuyOrder } from '@/utils/web/tradeContract'
import { getContactInfo, getUsdcContract } from '@/utils/web/usdcAddress'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { Button, InputNumber, Select, Spin } from 'antd'
import { ethers } from 'ethers'
import { PayDialog } from '../../properties/-components/payDialog'

// 最小购买数量常量
const MIN_TOKEN_PURCHASE = 1 // 设置最小购买量为2个代币，根据合约要求调整

export const Route = createFileRoute('/_app/transaction/create-buy-order/')({
  component: RouteComponent
})

function RouteComponent() {
  const { t } = useTranslation()
  const router = useRouter()
  const navigate = useNavigate()
  const [wallet, setWallet] = useState<ConnectedWallet | null>(null)

  const [item, setItem] = useState<any>(null)
  const [tokens, setTokens] = useState(MIN_TOKEN_PURCHASE)
  const [minTokenAmount] = useState(MIN_TOKEN_PURCHASE)
  const [isProcessing, setIsProcessing] = useState(false) // 添加处理状态

  const [keyword, setKeyword] = useState('')
  const [buyPrice, setBuyPrice] = useState(1)
  const [usdcInfo, setUsdcInfo] = useState({
    decimals: 6,
    symbol: 'USDT'
  })
  const maxPrice = 999999999999999

  // 获取代币精度
  useEffect(() => {
    if (!wallet)
      return
    const getDecimals = async () => {
      const ethProvider = await wallet.getEthereumProvider()
      const { decimals, symbol } = await getContactInfo(ethProvider)
      setUsdcInfo({
        decimals: Number(decimals),
        symbol
      })
    }
    getDecimals()
  }, [wallet])

  const getProperties = async () => {
    return await apiBasic.getDataList({ keyword })
  }

  const { data, isRefetching: isLoading, refetch } = useQuery<any[]>({
    queryKey: ['properties'],
    queryFn: async () => {
      const res = await getProperties()
      return _get(res.data, 'list', [])
    }
  })

  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)
  const [searchTime, setSearchTime] = useState(0)
  const queryClient = useQueryClient()
  const handleSearchProperties = (value: string) => {
    setKeyword(value)
    // 防抖，2秒空闲后执行
    const clockTimer = 500
    if (Date.now() - searchTime > clockTimer) {
      if (timer) {
        clearTimeout(timer)
      }
      setTimer(setTimeout(() => {
        // 取消之前的请求
        queryClient.cancelQueries({ queryKey: ['properties'] })
        refetch()

        setSearchTime(Date.now())
      }, clockTimer))
    }
  }

  // 资产选择处理
  const handleAssetSelect = (value: number) => {
    const selectedItem = data?.find((asset: any) => asset.id === value)
    console.log(selectedItem)
    if (selectedItem) {
      setItem(selectedItem)
    }
  }

  // 搜索关键词处理
  const handleSearch = (value: string) => {
    handleSearchProperties(value)
  }

  // 处理清空搜索
  const handleClear = () => {
    setKeyword('')
  }

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: {
      sell_order_id: number
      token_price: number
      hash: string
    }) => {
      const res = await createBuyOrderApi({
        id: `${item.id}`,
        token_number: `${tokens}`,
        token_price: data.token_price.toString(),
        sell_order_id: `${data.sell_order_id}`,
        hash: data.hash
      })
      return res.data
    }
  })

  const [payDialogOpen, setPayDialogOpen] = useState(false)
  async function createBuyOrder() {
    try {
      setIsProcessing(true) // 开始处理时设置为 true

      if (!wallet) {
        toast.error(t('payment.errors.no_wallet'))
        return
      }
      if (buyPrice < (1 * 10 ** (-1 * usdcInfo.decimals)))
        return
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
      setPayDialogOpen(true)

      const ethProvider = await wallet.getEthereumProvider()
      const provider = new ethers.BrowserProvider(ethProvider)
      const signer = await provider.getSigner()

      const usdtContract = await getUsdcContract(ethProvider)
      const tradingManagerContract = await getTradeContract(ethProvider)
      // 获取USDT decimals
      const usdtDecimals = await usdtContract.decimals()

      // 设置购买参数
      const tokenAmount = tokens
      // 获取设置的代币价格

      const requiredUsdt = toBigNumer(tokenAmount).multipliedBy(buyPrice).toString()
      // 获取签名者地址
      const signerAddress = await signer.getAddress()

      // 检查USDT余额
      const usdtBalance = await usdtContract.balanceOf(signerAddress)
      if (usdtBalance < ethers.parseUnits(requiredUsdt, usdtDecimals)) {
        toast.error(t('payment.errors.insufficient_usdt'))
        return
      }

      // 创建买单
      toast.info(t('payment.messages.creating_buy_order'))
      const [orderId, createData] = await Promise.all([
        listenerCreateSellEvent(wallet.address, item.contract_address, false),
        toCreateBuyOrder(tradingManagerContract, ethProvider, {
          token: item.contract_address,
          amount: tokenAmount,
          price: buyPrice
        })
      ])

      toast.info(t('payment.messages.waiting_for_confirmation'))
      await createData.tx.wait()

      // 调用后端API记录购买信息
      await mutateAsync({
        sell_order_id: orderId,
        hash: createData.tx.hash,
        token_price: createData.price
      })

      toast.success(t('payment.messages.buy_order_created'))
      navigate({ to: '/investment' })
    }
    catch (error: any) {
      if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
        toast.error(t('payment.errors.rejected'))
      }
      else if (error.message && error.message.includes('rejected')) {
        toast.error(t('payment.errors.rejected'))
      }
      else if (error.message && error.message.includes('insufficient funds')) {
        toast.error(t('payment.errors.insufficient_eth'))
      }
      else {
        toast.error(t('payment.errors.transaction_failed'))
      }
      throw error
    }
    finally {
      setIsProcessing(false) // 无论成功或失败，最终都设置为 false
      setPayDialogOpen(false)
    }
  }

  const renderAssetSelection = () => (
    <div className="rounded-xl bg-[#202329] p-6 space-y-4">
      <div className="text-4.5">{t('properties.payment.select_asset')}</div>
      {data && Array.isArray(data) && (
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
          options={(data)?.map((asset: any) => ({
            value: asset.id,
            label: asset.name
          })) || []}
        />
      )}
    </div>
  )

  return (
    <div className="mx-auto max-w-7xl p-8 space-y-8 max-lg:p-4">
      <div className="text-center text-6 font-medium">{t('common.payment_title')}</div>

      {/* 添加资产选择下拉框 */}
      {renderAssetSelection()}

      {!item
        ? (
            <div className="rounded-xl bg-[#202329] p-6 text-center">
              {t('properties.payment.select_asset_prompt')}
            </div>
          )
        : (
            <>
              <div className="flex gap-6 rounded-xl bg-[#202329] p-6 max-lg:flex-col">
                <div className="h-60 w-100 max-lg:h-auto max-lg:w-full">
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
                  <div className="w-full text-[#898989] [&>div]:w-full [&>div]:fyc [&>div]:justify-between space-y-4">
                    <div>
                      <div>{t('properties.payment.number')}</div>
                      <div className="flex justify-end">
                        <QuantitySelector
                          value={tokens}
                          onChange={setTokens}
                          min={minTokenAmount}
                          disabled={isPending}
                        />
                      </div>
                    </div>
                    <div>
                      <div>{t('properties.payment.token_price')}</div>
                      <div className="fcc gap-2">
                        <InputNumber
                          className="[&>div>*]:!text-center"
                          controls={false}
                          value={buyPrice}
                          onChange={value => setBuyPrice(value || 1)}
                          min={1 * 10 ** (-1 * usdcInfo.decimals)}
                          max={maxPrice}
                        />
                        <div>{usdcInfo.symbol}</div>
                      </div>
                    </div>
                    <div>
                      <div>{t('properties.payment.subtotal')}</div>
                      <div className="text-right">
                        $
                        {formatNumberNoRound((toBigNumer(tokens).multipliedBy(buyPrice)).toString(), 8)}
                      </div>
                    </div>
                    {/* <div>
                      <div>
                        {t('properties.payment.platform_fee')}
                        {' '}
                        (2%)
                      </div>
                      <div className="text-right">
                        $
                        {tokens * Number(item.price) * 0.02}
                      </div>
                    </div> */}
                  </div>

                  <div className="space-y-4">
                  </div>
                </div>

                <ISeparator className="bg-white" />

                {/* <div className="fbc">
                  <div>{t('properties.payment.total_amount')}</div>
                  <div className="text-primary">
                    $
                    {(tokens * Number(item.price) * 1.02).toFixed(2)}
                  </div>
                </div> */}

                <div className="text-xs text-[#f59e0b]">
                  {t('payment.info.min_tokens_required', { min: minTokenAmount })}
                </div>
              </div>

              <PaymentContent walletState={[wallet, setWallet]} />

              <div>
                <div className="mt-2 fcc gap-4">
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

              <PayDialog open={payDialogOpen} onClose={() => setPayDialogOpen(false)} />
            </>
          )}
    </div>
  )
}
