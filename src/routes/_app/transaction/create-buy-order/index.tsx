import type { ConnectedWallet } from '@privy-io/react-auth'
import { buyAsset } from '@/api/investment'
import { IImage } from '@/components/common/i-image'
import { IInfoField } from '@/components/common/i-info-field'
import ISeparator from '@/components/common/i-separator'
import { PaymentMethod } from '@/components/common/payment-method'
import SimpleERC20ABI from '@/contract/SimpleERC20.json'
import TradingManagerABI from '@/contract/TradingManager.json'
import { joinImagesPath } from '@/utils/url'
import { useWallets } from '@privy-io/react-auth'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { Button } from 'antd'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

export const Route = createFileRoute('/_app/transaction/create-buy-order/')({
  component: RouteComponent
})

function RouteComponent() {
  const { t } = useTranslation()
  const router = useRouter()
  const navigate = useNavigate()
  const { ready, wallets } = useWallets()
  const [wallet, setWallet] = useState<ConnectedWallet | null>(null)

  const [id] = useState<number | null>(null)
  const [item] = useState<any>(null)
  const [tokens, setTokens] = useState(1)

  const plus = () => setTokens(tokens + 1)
  const minus = () => {
    if (tokens > 1) {
      setTokens(tokens - 1)
    }
  }
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      const res = await buyAsset({ order_id: id! })
      return res.data
    }
  })

  async function createBuyOrder() {
    if (!wallet) {
      toast.error(t('payment.errors.no_wallet'))
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

    try {
      // 设置购买参数
      const tokenAmount = ethers.parseUnits(tokens.toString(), 18) // 转换为wei单位
      const tokenPrice = ethers.parseUnits(item.token_price.toString(), 18)
      const requiredUsdt = tokenAmount * tokenPrice

      // 获取签名者地址
      const signerAddress = await signer.getAddress()

      // 检查USDT余额
      const usdtBalance = await usdtContract.balanceOf(signerAddress)
      if (usdtBalance < requiredUsdt) {
        toast.error(t('payment.errors.insufficient_usdt', {
          required: ethers.formatUnits(requiredUsdt, 18),
          balance: ethers.formatUnits(usdtBalance, 18)
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
        item.token_address,
        item.property_id,
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
  }

  useEffect(() => {
    if (ready) {
      const [firstWallet] = wallets
      if (firstWallet) {
        setWallet(firstWallet)
      }
    }
  }, [navigate, t, ready, wallets])

  if (!item) {
    return (
      <div className="text-center">
        Select a asset to create a buy order.
      </div>
    )
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
              value={item?.total_amount}
              labelClass="text-[#898989]"
              className="space-y-2"
            />
            <IInfoField
              label={t('properties.payment.total')}
              value={item.total_amount}
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
              <Button className="b-none text-white bg-[#374151]!" onClick={minus}>-</Button>
              <div className="w-12 select-none text-center">{tokens}</div>
              <Button className="b-none text-white bg-[#374151]!" onClick={plus}>+</Button>
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
              loading={isPending}
              disabled={isPending}
            >
              {t('properties.payment.confirm_payment')}
            </Button>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  )
}
