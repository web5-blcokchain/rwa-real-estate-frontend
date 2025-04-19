import type { ConnectedWallet } from '@privy-io/react-auth'
import apiBasic from '@/api/basicApi'
import { IImage } from '@/components/common/i-image'
import { IInfoField } from '@/components/common/i-info-field'
import ISeparator from '@/components/common/i-separator'
import { PaymentMethod } from '@/components/common/payment-method'
import { useTradingManagerContract } from '@/contract'
import { useCommonDataStore } from '@/stores/common-data'
import { joinImagesPath } from '@/utils/url'
import { useWallets } from '@privy-io/react-auth'
import { useMutation } from '@tanstack/react-query'
import { createLazyFileRoute, useMatch, useNavigate, useRouter } from '@tanstack/react-router'
import { Button } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Web3 from 'web3'

export const Route = createLazyFileRoute('/_app/properties/payment/$id')({
  component: RouteComponent
})

function RouteComponent() {
  const { t } = useTranslation()
  const router = useRouter()
  const navigate = useNavigate()
  const { ready, wallets } = useWallets()
  const contract = useTradingManagerContract()

  const [wallet, setWallet] = useState<ConnectedWallet | null>(null)

  const { params } = useMatch({
    from: '/_app/properties/payment/$id'
  })

  const id = Number.parseInt(params.id)
  const assets = useCommonDataStore(state => state.assets)

  const assetDetail = assets.get(id)!

  const [tokens, setTokens] = useState(1)

  const plus = () => setTokens(tokens + 1)
  const minus = () => {
    if (tokens > 1) {
      setTokens(tokens - 1)
    }
  }
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      const res = await apiBasic.purchaseBuy({ id: assetDetail.id, number: tokens })
      return res.data
    }
  })

  async function payment() {
    if (!wallet) {
      console.log('Please select a wallet')
      toast.error(t('payment.errors.no_wallet'))
      return
    }

    try {
      // 确保用户钱包已连接
      if (!window.ethereum) {
        console.log('Please install MetaMask or use a Web3 browser')
        toast.error(t('payment.errors.no_ethereum'))
        return
      }

      const web3 = new Web3(window.ethereum)

      // 检查网络是否正确
      const chainId = await web3.eth.getChainId()
      console.log('Current chain ID:', chainId)

      // 获取当前资产信息用于日志
      console.log('Asset details:', assetDetail)
      console.log('Token amount:', tokens)
      console.log('Price:', assetDetail.price)
      console.log('Total price in wei:', web3.utils.toWei((tokens * Number(assetDetail.price)).toString(), 'ether'))

      // 查询用户余额
      const balance = await web3.eth.getBalance(wallet.address)
      console.log('User balance:', web3.utils.fromWei(balance, 'ether'), 'ETH')

      // 确认合约方法和参数
      console.log('Contract methods:', Object.keys(contract.methods))

      // 修改：检查合约ABI格式和参数类型
      // 使用BigNumber或十六进制字符串处理大数值
      const tokenAmount = tokens.toString()
      // 使用十六进制表示的wei值，避免精度问题
      const priceInWei = web3.utils.toHex(web3.utils.toWei((tokens * Number(assetDetail.price)).toString(), 'ether'))

      console.log('Creating buy order with params:')
      console.log('- Contract address:', assetDetail.contract_address)
      console.log('- Wallet address:', wallet.address)
      console.log('- Token amount:', tokenAmount)
      console.log('- Price in Wei (hex):', priceInWei)

      // 尝试通过检查合约方法签名来排查问题
      console.log('Available contract methods:', Object.keys(contract.methods)
        .filter(key => typeof contract.methods[key] === 'function' && key.includes('createBuy')))

      // 获取合约ABI并查看createBuyOrder方法的具体定义
      const methodAbi = contract.options.jsonInterface.find(
        method => method.type === 'function' && 'name' in method && method.name === 'createBuyOrder'
      )
      console.log('createBuyOrder method ABI:', methodAbi)

      if (!methodAbi) {
        toast.error(t('payment.errors.method_not_found'))
        return
      }

      // 获取合约方法的 ABI 数据 - 尝试不同的参数顺序或组合
      try {
        const data = contract.methods.createBuyOrder(
          assetDetail.contract_address,
          wallet.address,
          tokenAmount,
          priceInWei
        ).encodeABI()

        console.log('Encoded ABI data:', data)

        // 尝试直接调用合约方法以获取更详细的错误
        try {
          // 使用call()而不是estimateGas()获取详细错误
          await contract.methods.createBuyOrder(
            assetDetail.contract_address,
            wallet.address,
            tokenAmount,
            priceInWei
          ).call({ from: wallet.address })

          console.log('Direct call succeeded! This is unexpected since transaction failed.')
        }
        catch (callError) {
          console.error('Direct call error (expected):', callError)
          // 解析错误以获取更多信息
          if (callError instanceof Error) {
            const errorString = callError.toString()

            // 检查是否包含特定错误字符串
            if (errorString.includes('revert')) {
              console.log('合约调用被回滚，原因可能是参数不符合条件或权限不足')
              toast.error(t('payment.errors.contract_revert'))

              // 尝试发现特定原因
              const revertReason = errorString.match(/revert: (.*)($|\n)/)?.[1]
              if (revertReason) {
                console.log('回滚原因:', revertReason)
                toast.error(t('payment.errors.revert_reason', { reason: revertReason }))
              }
            }

            // 检查是否需要支付ETH
            if (errorString.includes('value')) {
              console.log('交易可能需要发送ETH值')
              toast.warning(t('payment.errors.may_need_eth'))
            }
          }
        }

        // 估算gas，但使用更高的默认值和超时时间
        let gasEstimate
        try {
          gasEstimate = await web3.eth.estimateGas({
            from: wallet.address,
            to: contract.options.address,
            data,
            value: '0x0' // 测试是否需要发送ETH
          })
          console.log('Gas estimation successful:', gasEstimate)
        }
        catch (gasError) {
          console.error('Gas estimation error:', gasError)
          toast.error(t('payment.errors.gas_estimate'))

          // 测试是否需要发送ETH值
          try {
            gasEstimate = await web3.eth.estimateGas({
              from: wallet.address,
              to: contract.options.address,
              data,
              value: web3.utils.toWei('0.1', 'ether')
            })
            console.log('Gas estimation with ETH value successful:', gasEstimate)
            console.log('交易需要发送ETH!')
            toast.info(t('payment.info.eth_required'))
          }
          catch (ethGasError) {
            console.error('Gas estimation with ETH value still failed:', ethGasError)
            toast.error(t('payment.errors.gas_estimate_with_eth'))
            gasEstimate = 500000 // 使用一个较高的默认值
          }
        }

        // 修改：使用原始gasPrice并确保gas值足够
        const gasPrice = await web3.eth.getGasPrice()
        console.log('Gas price:', gasPrice)

        // 尝试检查账户余额是否足够
        const txCost = BigInt(gasEstimate) * BigInt(gasPrice)
        const userBalance = BigInt(await web3.eth.getBalance(wallet.address))

        console.log('Estimated tx cost (wei):', txCost.toString())
        console.log('User balance (wei):', userBalance.toString())

        if (userBalance < txCost) {
          console.error('余额不足，无法支付交易费用')
          toast.error(t('payment.errors.insufficient_balance'))
          return
        }

        // 使用更简化的交易参数
        const txParams = {
          from: wallet.address,
          to: contract.options.address,
          data,
          gas: Math.floor(Number(gasEstimate) * 1.2), // 使用2倍气体限制
          // 尝试不指定gasPrice和chainId，让钱包自动填充
          value: '0x0' // 如果合约需要ETH，这里需要修改
        }

        console.log('Transaction params:', txParams)
        console.log('Sending transaction...')

        // 使用 Privy 钱包签名并发送交易
        const txHash = await web3.eth.sendTransaction(txParams)

        console.log('Transaction hash:', txHash)
        toast.success(t('payment.success.tx_sent'))

        // 调用后端API记录交易
        mutateAsync()
          .then((transactionId) => {
            navigate({
              to: '/transaction/$id',
              params: {
                id: `${transactionId}`
              }
            })
          })
      }
      catch (encodeError: any) {
        console.error('ABI encoding error:', encodeError)
        toast.error(t('payment.errors.encoding', { error: encodeError.message }))
        throw new Error(`Failed to encode contract method call: ${encodeError.message}`)
      }
    }
    catch (error) {
      console.error('Payment error:', error)

      // 添加更详细的错误分析和相应的toast提示
      if (error instanceof Error) {
        const errorMsg = error.message
        console.log(`Payment failed: ${errorMsg}`)

        if (errorMsg.includes('gas required exceeds allowance')) {
          toast.error(t('payment.errors.gas_limit'))
        }
        else if (errorMsg.includes('nonce too low')) {
          toast.error(t('payment.errors.nonce'))
        }
        else if (errorMsg.includes('insufficient funds')) {
          toast.error(t('payment.errors.funds'))
        }
        else if (errorMsg.includes('execution reverted')) {
          toast.error(t('payment.errors.execution'))
        }
        else {
          toast.error(t('payment.errors.general', { error: errorMsg }))
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
  }, [assetDetail, navigate, params, t])

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
              <Button className="b-none text-white bg-[#374151]!" onClick={minus}>-</Button>
              <div className="w-12 select-none text-center">{tokens}</div>
              <Button className="b-none text-white bg-[#374151]!" onClick={plus}>+</Button>
            </div>

            <div className="text-right">
              $
              {tokens * 500}
            </div>
            <div className="text-right">
              $
              {tokens * 10}
            </div>
          </div>
        </div>

        <ISeparator className="bg-white" />

        <div className="fbc">
          <div>{t('properties.payment.total_amount')}</div>
          <div className="text-primary">$510</div>
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
              loading={false}
              disabled={isPending}
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
