import { getTransactionDetail } from '@/api/transaction'
import { ChatButton } from '@/components/common/chat-button'
import { IInfoField } from '@/components/common/i-info-field'
import { shortAddress } from '@/utils/wallet'
import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute, useMatch } from '@tanstack/react-router'
import { Button, Progress } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Web3 from 'web3'

export const Route = createLazyFileRoute('/_app/transaction/$hash')({
  component: RouteComponent
})

function RouteComponent() {
  const { t } = useTranslation()
  const { params } = useMatch({
    from: '/_app/transaction/$hash'
  })

  const hash = params.hash
  const [status, setStatus] = useState<'pending' | 'success' | 'failed'>('pending')
  const [progress, setProgress] = useState(10)

  const { data, isLoading } = useQuery({
    queryKey: ['transaction', hash],
    queryFn: async () => {
      const res = await getTransactionDetail({ hash })
      return res.data
    }
  })

  // 使用交易确认逻辑
  // 使用 ref 跟踪是否是首次查询
  const isFirstCheck = useRef(true)
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [])

  useEffect(() => {
    if (!data || isLoading)
      return

    const txHash = _get(data, 'transaction.hash')
    if (!txHash)
      return

    // 如果已经知道交易结果，不再查询
    if (status === 'success' || status === 'failed')
      return

    const checkTransaction = async () => {
      try {
        if (!window.ethereum) {
          console.error('No Ethereum provider found')
          return
        }

        const web3 = new Web3(window.ethereum)
        const receipt = await web3.eth.getTransactionReceipt(txHash)

        if (receipt) {
          console.log('Transaction receipt:', receipt)
          if (receipt.status) {
            console.log('Payment successful')
            // 只有非首次查询才显示 toast
            if (!isFirstCheck.current) {
              toast.success(t('payment.success.payment_success'))
            }
            setStatus('success')
            setProgress(100)
            // 交易成功后清除间隔定时器
            clearInterval(intervalId)
          }
          else {
            console.log('Transaction failed')
            // 只有非首次查询才显示 toast
            if (!isFirstCheck.current) {
              toast.error(t('payment.errors.tx_failed'))
            }
            setStatus('failed')
            // 交易失败后清除间隔定时器
            clearInterval(intervalId)
          }
        }
        else {
          console.log('Transaction not yet confirmed.')
          // 只有非首次查询才显示 toast
          if (!isFirstCheck.current) {
            toast.info(t('payment.info.tx_pending'))
          }
          // 增加进度但不到100%，表示处理中
          setProgress(prev => Math.min(prev + 5, 90))
        }

        // 首次检查完成后更新标志
        if (isFirstCheck.current) {
          isFirstCheck.current = false
        }
      }
      catch (error) {
        console.error('Error checking transaction:', error)
      }
    }

    // 立即检查一次
    checkTransaction()

    // 设置定期检查，保存间隔ID以便后续清除
    let intervalId = setInterval(checkTransaction, 3000)

    return () => {
      if (intervalId)
        clearInterval(intervalId)
    }
  }, [data, isLoading, t, status])

  // 根据状态选择要显示的组件
  const renderStatusComponent = () => {
    if (status === 'pending') {
      return <Pending />
    }
    else if (status === 'success') {
      return <Result />
    }
    else {
      return <Error />
    }
  }

  const openBlockUrl = () => {
    if (status === 'success') {
      window.open(`${import.meta.env.VITE_PUBLIC_WEB_BLOCK_URL}/tx/${hash}`, '_blank')
    }
  }

  return (
    <div className="mx-a max-w-3xl p-8 space-y-8 max-lg:p-4">
      <div className="text-center text-7 font-medium">{t('transaction.hash.token_distribution')}</div>

      <Waiting
        for={!isLoading}
        className="h-32 fcc"
        iconClass="size-12"
      >
        <div className="rounded-xl bg-[#212328] p-6 space-y-4">
          {/* 根据交易状态显示不同的组件 */}
          {renderStatusComponent()}

          <div className="rounded-xl bg-[#252932] p-4 space-y-2">
            <div className="fbc text-3.5">
              <div>{t('transaction.hash.smart_contract_address')}</div>
              <div className="fyc gap-2">
                <div>{shortAddress(_get(data, 'token.smart_contract_address'))}</div>
                <div
                  className="i-mingcute-copy-2-fill bg-[#b5b5b5] clickable"
                  onClick={
                    () => copy(
                      _get(data, 'token.smart_contract_address'),
                      t
                    )
                  }
                >
                </div>
              </div>
            </div>

            <div className="fbc text-3.5">
              <div>{t('transaction.hash.token_contract_address')}</div>
              <div className="fyc gap-2">
                <div>{shortAddress(_get(data, 'token.token_contract_address'))}</div>
                <div
                  className="i-mingcute-copy-2-fill bg-[#b5b5b5] clickable"
                  onClick={
                    () => copy(
                      _get(data, 'token.token_contract_address'),
                      t
                    )
                  }
                >
                </div>
              </div>
            </div>

            <div className="fbc text-3.5">
              <div>{t('transaction.hash.estimated_execution_time')}</div>
              <div>{_get(data, 'token.estimated_execution_time')}</div>
            </div>
          </div>

          <div className="rounded-xl bg-[#252932] p-6 space-y-4">
            <div className="text-4 font-medium">{t('transaction.hash.property_token_distribution')}</div>

            <ul
              className={cn(
                'list-disc list-inside text-3.5 space-y-2',
                '[&>li]:(space-x-1)'
              )}
            >
              <li>{_get(data, 'property.name')}</li>
              <li>
                <span>
                  {t('transaction.hash.property_location')}
                  :
                </span>
                <span>{_get(data, 'property.location')}</span>
              </li>
              <li>
                <span>
                  {t('transaction.hash.registration_number')}
                  :
                </span>
                <span>{_get(data, 'property.registration_number')}</span>
              </li>
              <li>
                <span>
                  {t('transaction.hash.annual_yield')}
                  :
                </span>
                <span>{_get(data, 'property.annual_yield')}</span>
              </li>
              <li>{_get(data, 'property.audit')}</li>
            </ul>
          </div>
        </div>

        <div className="rounded-xl bg-[#212328] p-6 space-y-4">
          <div className="fbc">
            <div className="font-medium">{t('transaction.hash.transaction_status')}</div>
            <div className="text-[#898989]">{t('transaction.hash.estimated_token_arrival_time', { num: 25 })}</div>
          </div>

          <Progress
            className="w-full"
            strokeColor="var(--primary)"
            trailColor="#898989"
            percent={progress}
            showInfo={false}
            status={status === 'failed' ? 'exception' : undefined}
          />

          <div className="fbc text-3.5">
            <div>{t('transaction.hash.transaction_hash')}</div>
            <div className="fyc gap-2">
              <div>{shortAddress(_get(data, 'transaction.hash'))}</div>
              <div
                className="i-mingcute-copy-2-fill bg-[#b5b5b5] clickable"
                onClick={
                  () => copy(_get(data, 'transaction.hash'), t)
                }
              >
              </div>
            </div>
          </div>

          <IInfoField
            horizontal
            label={t('transaction.hash.smart_contract_status')}
            value={status === 'pending' ? t('transaction.hash.processing') : (status === 'success' ? t('transaction.hash.success') : t('transaction.hash.failed'))}
            labelClass="text-3.5"
            valueClass={`text-3.5 ${status === 'success' ? 'text-green!' : (status === 'failed' ? 'text-red!' : '')}`}
          />

          <IInfoField
            horizontal
            label={t('transaction.hash.block_confirmation_confirmed')}
            value={status === 'success' ? t('transaction.hash.confirmed') : t('transaction.hash.pending')}
            labelClass="text-3.5"
            valueClass="text-3.5"
          />
        </div>

        <div className="pt-4 text-center">
          <Button
            type="primary"
            size="large"
            className="text-black!"
            onClick={openBlockUrl}
            disabled={status === 'pending'}
          >
            {status === 'success' ? t('transaction.hash.view_in_explorer') : t('transaction.hash.confirm_in_wallet')}
          </Button>
        </div>

        <ChatButton />
      </Waiting>
    </div>
  )
}

const Result: FC = () => {
  const { t } = useTranslation()
  return (
    <>
      <div className="fccc gap-4">
        <div className="i-ep-success-filled size-15 bg-green"></div>
        <div className="text-6 font-medium">{t('transaction.hash.token_distribution_complete')}</div>
        <div className="text-4 text-[#898989]">{t('transaction.hash.tokens_have_been_successfully_transferred_to_your_wallet')}</div>
      </div>

      <div className="rounded-xl bg-[#252932] p-4">
        <div className="text-3.5 text-[#b5b5b5]">{t('transaction.hash.real_estate_token')}</div>
        <div className="text-4 font-medium">JPRE-0023</div>
      </div>
    </>
  )
}

const Error: FC = () => {
  const { t } = useTranslation()
  return (
    <>
      <div className="fccc gap-4">
        <div className="i-carbon:close-outline size-15 bg-#ec5b56"></div>
        <div className="text-6 font-medium">{t('transaction.hash.token_distribution_failed')}</div>
        {/* <div className="text-4 text-[#898989]">{t('transaction.hash.tokens_have_been_successfully_transferred_to_your_wallet')}</div> */}
      </div>

      <div className="rounded-xl bg-[#252932] p-4">
        <div className="text-3.5 text-[#b5b5b5]">{t('transaction.hash.real_estate_token')}</div>
        <div className="text-4 font-medium">JPRE-0023</div>
      </div>
    </>
  )
}

const Pending: FC = () => {
  return (
    <Waiting
      className="fcc"
      iconClass="size-8"
    />
  )
}
