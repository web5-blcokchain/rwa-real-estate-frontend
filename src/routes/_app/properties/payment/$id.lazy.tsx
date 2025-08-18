import type { ConnectedWallet } from '@privy-io/react-auth'
import apiBasic from '@/api/basicApi'
import { IImage } from '@/components/common/i-image'
import { IInfoField } from '@/components/common/i-info-field'
import ISeparator from '@/components/common/i-separator'
import { PaymentContent } from '@/components/common/payment-content'
import QuantitySelector from '@/components/common/quantity-selector'
import { getContracts } from '@/contract'
import { useCommonDataStore } from '@/stores/common-data'
import { useUserStore } from '@/stores/user'
import { envConfig } from '@/utils/envConfig'
import { formatNumberNoRound, toBigNumer } from '@/utils/number'
import { joinImagesPath } from '@/utils/url'
import { generatePermitSignature } from '@/utils/web/utils'
import { useMutation } from '@tanstack/react-query'
import { createLazyFileRoute, useMatch, useNavigate, useRouter } from '@tanstack/react-router'
import { Button } from 'antd'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { isAddress } from 'web3-validator'
import { PayDialog } from '../-components/payDialog'

// 最小购买数量常量
const MIN_TOKEN_PURCHASE = 1 // 设置最小购买量为2个代币，根据合约要求调整

export const Route = createLazyFileRoute('/_app/properties/payment/$id')({
  component: RouteComponent
})

function RouteComponent() {
  const { t } = useTranslation()
  const router = useRouter()
  const navigate = useNavigate()

  const [wallet, setWallet] = useState<ConnectedWallet | null>(null)
  const { userData } = useUserStore()

  const { params } = useMatch({
    from: '/_app/properties/payment/$id'
  })

  const id = Number.parseInt(params.id)
  const assets = useCommonDataStore(state => state.assets)

  const item = assets.get(id)!

  // 默认购买量设置为最小值
  const [tokens, setTokens] = useState(MIN_TOKEN_PURCHASE)
  const [btnLoading, setBtnLoading] = useState(false) // 新增loading状态
  const [payDialogOpen, setPayDialogOpen] = useState(false)

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

  async function payment() {
    // 判断当前用户是否是绑定的钱包/已经审核通过链
    if (userData.audit_status !== 4) {
      toast.error(t('payment.errors.please_wait_for_kyc'))
      return
    }
    if (!wallet) {
      toast.error(t('payment.errors.no_wallet'))
      return
    }
    if (wallet.address !== userData.wallet_address) {
      toast.error(t('payment.errors.please_use_bound_wallet'))
      return
    }
    setBtnLoading(true)
    setPayDialogOpen(true)
    try {
      if (!window.ethereum) {
        toast.error(t('payment.errors.no_ethereum'))
        return
      }

      const PropertyManager = getContracts('PropertyToken')
      const SimpleERC20 = getContracts('SimpleERC20')

      // PropertyManager 合约地址应从配置或 item 里获取，不能用 propertyToken 地址
      const propertyManagerAddress = item.contract_address
      const usdcAddress = envConfig.usdcAddress || SimpleERC20.address
      if (!propertyManagerAddress || !isAddress(propertyManagerAddress)) {
        toast.error(t('payment.errors.invalid_contract'))
        return
      }

      // Provider & Signer
      const ethProvider = await wallet.getEthereumProvider()
      const provider = new ethers.BrowserProvider(ethProvider)
      const signer = await provider.getSigner()
      const signerAddress = await signer.getAddress()

      // USDT合约
      const usdtContract = new ethers.Contract(
        usdcAddress,
        SimpleERC20.abi,
        signer
      )
      // PropertyManager合约
      const propertyManagerContract = new ethers.Contract(
        propertyManagerAddress,
        PropertyManager.abi,
        signer
      )

      // 获取USDT精度
      const usdtDecimals = await usdtContract.decimals()
      // 获取购买的房屋代币数量

      // 获取房屋代币对应的usdc价格
      let usdcPrice = await propertyManagerContract.issuePrice()
      usdcPrice = ethers.formatUnits(usdcPrice, usdtDecimals)
      const requiredUsdtAmount = toBigNumer(tokens).multipliedBy(usdcPrice).toString()
      // 计算需要支付USDT余额 百分之2的手续费 （总数 * 价格 * 手续费）
      const payUSDCAmount = ethers.parseUnits(requiredUsdtAmount, usdtDecimals)
      const usdtBalance = await usdtContract.balanceOf(signerAddress)
      // TODO 使用合约获取价格,计算代币与USDC比例兑换之后的余额，之后进行判断
      if (Number(usdcPrice) <= 0) {
        toast.error(t('payment.errors.get_token_price_failed'))
        return
      }
      if (Number(requiredUsdtAmount) <= 0) {
        toast.error(t('payment.errors.token_price_must_be_greater_than_0'))
        return
      }
      if (usdtBalance < payUSDCAmount) {
        toast.error(t('payment.errors.insufficient_eth'))
        return
      }

      // 检查USDT授权额度（授权给 PropertyManager 合约地址）
      // const usdtAllowance = await usdtContract.allowance(signerAddress, propertyManagerAddress)
      // if (usdtAllowance < requiredUsdtAmount) {
      //   // 先清零授权
      //   // const resetTx = await usdtContract.approve(propertyManagerAddress, 0)
      //   // await resetTx.wait()
      //   // 直接授权USDC所支付的数量
      //   const approveTx = await usdtContract.approve(propertyManagerAddress, payUSDCAmount)
      //   await approveTx.wait()
      // }

      toast.info(t('payment.info.creating_transaction'))

      try {
        // propertyId 类型要与合约一致（通常为 string 或 bytes32）
        // const tx = await propertyManagerContract.purchaseTokens(requiredUsdtAmount, usdcAddress)

        const currentTime = Math.floor(Date.now() / 1000)
        const deadline = currentTime + 3600 // 1 hour from now
        const { v, r, s } = await generatePermitSignature(
          signer,
          usdtContract,
          propertyManagerAddress,
          ethers.parseUnits(requiredUsdtAmount, usdtDecimals),
          deadline
        )
        // 生成支付合约的精度数
        const tx = await (propertyManagerContract.connect(signer) as any)
          .purchaseTokens(
            ethers.parseEther(toBigNumer(tokens).toString()), // 截断小数点，防止位数太多导致函数报错
            usdtContract.getAddress(),
            deadline,
            v,
            r,
            s
          )
        const receipt = await tx.wait()
        toast.success(t('payment.success.tx_sent'))
        const hash = receipt.hash as string

        // 后端同步
        mutateAsync(hash)
          .then(() => {
            navigate({
              to: '/transaction/$hash',
              params: { hash }
            })
          })
      }
      catch (err: any) {
        console.error('initialBuyPropertyToken error:', err)
        const errorMessage = err.message || ''
        if (errorMessage.includes('insufficient funds')) {
          toast.error(t('payment.errors.insufficient_eth'))
        }
        else if (errorMessage.includes('User denied')) {
          toast.error(t('payment.errors.rejected'))
        }
        else {
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
    finally {
      setBtnLoading(false)
      setPayDialogOpen(false)
    }
  }

  useEffect(() => {
    if (!item) {
      // console.log(t('properties.payment.asset_not_found'))
      navigate({
        to: '/properties/detail/$id',
        params
      })
    }
  }, [item, navigate, params, t])

  if (!item) {
    return null
  }

  const [imageUrl] = joinImagesPath(item.image_urls)

  return (
    <div className="mx-auto max-w-7xl p-8 space-y-8">
      {/* <div className="text-center text-6 font-medium">{t('common.payment_title')}</div> */}

      <div className="flex gap-6 rounded-xl bg-[#202329] p-6 max-lg:flex-col">
        <div className="h-60 w-100 max-lg:h-auto max-lg:w-full">
          <IImage src={imageUrl} className="size-full rounded" />
        </div>
        <div className="flex-1">
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
              value={`${item?.price} ${envConfig.defaultPayTokenName}`}
              labelClass="text-[#898989]"
              className="space-y-2"
            />
            <IInfoField
              label={t('properties.payment.total')}
              value={`${Number(item?.number) * Number(item?.price)} ${envConfig.defaultPayTokenName}`}
              labelClass="text-[#898989]"
              className="space-y-2"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-[#202329] p-6 space-y-4">
        <div className="text-4.5">{t('properties.payment.payment_details')}</div>

        <div className="text-4">
          <div className="w-full text-[#898989] [&>div]:w-full [&>div]:fyc [&>div]:justify-between space-y-4">
            <div>
              <div>{t('properties.payment.number')}</div>
              <div className="flex justify-end">
                <QuantitySelector
                  value={tokens}
                  onChange={setTokens}
                  min={1}
                  disabled={isPending}
                />
              </div>
            </div>
            <div>
              <div>{t('properties.payment.subtotal')}</div>
              <div className="text-right">
                $
                {formatNumberNoRound((toBigNumer(tokens).multipliedBy(item.price)).toString(), 8)}
              </div>
            </div>
            <div>
              {/* <div>
                {t('properties.payment.platform_fee')}
                {' '}
                (2%)
              </div>
              <div className="text-right">
                $
                {formatNumberNoRound(tokens * Number(item.price) * 0.02, 8)}
              </div> */}
            </div>
          </div>

          <div className="space-y-4">

          </div>
        </div>

        <ISeparator className="bg-white" />

        <div className="fbc">
          <div>{t('properties.payment.total_amount')}</div>
          <div className="text-primary">
            $
            {formatNumberNoRound((toBigNumer(tokens).multipliedBy(item.price)).toString(), 8)}
          </div>
        </div>
      </div>

      <PaymentContent walletState={[wallet, setWallet]} />

      {/* <div className="rounded-xl bg-[#202329] p-6 text-4 text-[#898989] space-y-2">
        <p>
          {t('properties.payment.please_verify')}
        </p>
        <p>
          {t('properties.payment.please_verify_1')}
        </p>
      </div> */}

      <div>
        {/* <div className="text-center text-3.5 text-[#898989]">
          {t('properties.payment.expire')}
          {dayjs().format('HH:mm')}
        </div> */}
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
              onClick={payment}
              loading={btnLoading || isPending}
              disabled={btnLoading || isPending || tokens <= 0}
            >
              {t('properties.payment.confirm_payment')}
            </Button>
          </div>
        </div>
      </div>
      <PayDialog open={payDialogOpen} onClose={() => setPayDialogOpen(false)} />
    </div>
  )
}
