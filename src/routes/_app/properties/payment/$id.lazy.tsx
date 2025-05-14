import type { ConnectedWallet } from '@privy-io/react-auth'
import apiBasic from '@/api/basicApi'
import { IImage } from '@/components/common/i-image'
import { IInfoField } from '@/components/common/i-info-field'
import ISeparator from '@/components/common/i-separator'
import { PaymentMethod } from '@/components/common/payment-method'
import QuantitySelector from '@/components/common/quantity-selector'
import PropertyManagerABI from '@/contract/PropertyManager.json'
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
const MIN_TOKEN_PURCHASE = 1 // 设置最小购买量为2个代币，根据合约要求调整

export const Route = createLazyFileRoute('/_app/properties/payment/$id')({
  component: RouteComponent
})

function RouteComponent() {
  const { t } = useTranslation()
  const router = useRouter()
  const navigate = useNavigate()
  const { ready, wallets } = useWallets()

  const [wallet, setWallet] = useState<ConnectedWallet | null>(null)

  const { params } = useMatch({
    from: '/_app/properties/payment/$id'
  })

  const id = Number.parseInt(params.id)
  const assets = useCommonDataStore(state => state.assets)

  const item = assets.get(id)!

  // 默认购买量设置为最小值
  const [tokens, setTokens] = useState(MIN_TOKEN_PURCHASE)
  const [btnLoading, setBtnLoading] = useState(false) // 新增loading状态

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
    if (!wallet) {
      toast.error(t('payment.errors.no_wallet'))
      return
    }
    setBtnLoading(true)
    try {
      if (!window.ethereum) {
        toast.error(t('payment.errors.no_ethereum'))
        return
      }

      // PropertyManager 合约地址应从配置或 item 里获取，不能用 propertyToken 地址
      const propertyManagerAddress = PropertyManagerABI.address || process.env.REACT_APP_PROPERTY_MANAGER_ADDRESS
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
        SimpleERC20ABI.address,
        SimpleERC20ABI.abi,
        signer
      )
      // PropertyManager合约
      const propertyManagerContract = new ethers.Contract(
        propertyManagerAddress,
        PropertyManagerABI.abi,
        signer
      )

      // 获取USDT精度
      const usdtDecimals = await usdtContract.decimals()
      // 计算所需USDT金额
      const tokenPrice = ethers.parseUnits(String(item.price), usdtDecimals)
      const requiredUsdtAmount = tokenPrice * BigInt(tokens)

      // 检查USDT余额
      const usdtBalance = await usdtContract.balanceOf(signerAddress)
      if (usdtBalance < requiredUsdtAmount) {
        toast.error(t('payment.errors.insufficient_eth'))
        return
      }

      // 检查USDT授权额度（授权给 PropertyManager 合约地址）
      const usdtAllowance = await usdtContract.allowance(signerAddress, propertyManagerAddress)
      if (usdtAllowance < requiredUsdtAmount) {
        // 先清零授权
        const resetTx = await usdtContract.approve(propertyManagerAddress, 0)
        await resetTx.wait()
        // 再授权
        const approveTx = await usdtContract.approve(propertyManagerAddress, requiredUsdtAmount)
        await approveTx.wait()
      }

      toast.info(t('payment.info.creating_transaction'))

      try {
        // propertyId 类型要与合约一致（通常为 string 或 bytes32）
        const tx = await propertyManagerContract.initialBuyPropertyToken(
          String(id),
          tokens
        )
        const receipt = await tx.wait()
        toast.success(t('payment.success.tx_sent'))
        const hash = receipt.hash

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
                min={1}
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
              loading={btnLoading || isPending}
              disabled={btnLoading || isPending}
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
