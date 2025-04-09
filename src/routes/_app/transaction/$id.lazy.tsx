import { getTransactionDetail } from '@/api/transaction'
import { ChatButton } from '@/components/common/chat-button'
import { IInfoField } from '@/components/common/i-info-field'
import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute, useMatch } from '@tanstack/react-router'
import { Button, Progress } from 'antd'

export const Route = createLazyFileRoute('/_app/transaction/$id')({
  component: RouteComponent
})

function RouteComponent() {
  const { params } = useMatch({
    from: '/_app/transaction/$id'
  })

  const id = Number.parseInt(params.id)

  const { data, isLoading } = useQuery({
    queryKey: ['transaction', id],
    queryFn: async () => {
      const res = await getTransactionDetail({ id })
      return res.data
    }
  })

  return (
    <div className="mx-a max-w-3xl p-8 space-y-8">
      <div className="text-center text-7 font-medium">Token Distribution</div>

      <Waiting
        for={!isLoading}
        className="h-32 fcc"
        iconClass="size-12"
      >
        <div className="rounded-xl bg-[#212328] p-6 space-y-4">
          {/* TODO: 根据接口展示状态 */}
          <Result />
          <Request />

          <div className="rounded-xl bg-[#252932] p-4 space-y-2">
            <div className="fbc text-3.5">
              <div>Smart Contract Address</div>
              <div className="fyc gap-2">
                <div>{_get(data, 'token.smart_contract_address')}</div>
                <div
                  className="i-mingcute-copy-2-fill bg-[#b5b5b5] clickable"
                  onClick={
                    () => copy(
                      _get(data, 'token.smart_contract_address')
                    )
                  }
                >
                </div>
              </div>
            </div>

            <div className="fbc text-3.5">
              <div>Token Contract Address</div>
              <div className="fyc gap-2">
                <div>{_get(data, 'token.token_contract_address')}</div>
                <div
                  className="i-mingcute-copy-2-fill bg-[#b5b5b5] clickable"
                  onClick={
                    () => copy(
                      _get(data, 'token.token_contract_address')
                    )
                  }
                >
                </div>
              </div>
            </div>

            <div className="fbc text-3.5">
              <div>Estimated Execution Time</div>
              <div>{_get(data, 'token.estimated_execution_time')}</div>
            </div>
          </div>

          <div className="rounded-xl bg-[#252932] p-6 space-y-4">
            <div className="text-4 font-medium">Property Token Distribution</div>

            <ul
              className={cn(
                'list-disc list-inside text-3.5 space-y-2',
                '[&>li]:(space-x-1)'
              )}
            >
              <li>{_get(data, 'property.name')}</li>
              <li>
                <span>Property Location:</span>
                <span>{_get(data, 'property.location')}</span>
              </li>
              <li>
                <span>Registration Number:</span>
                <span>{_get(data, 'property.registration_number')}</span>
              </li>
              <li>
                <span>Annual Yield:</span>
                <span>{_get(data, 'property.annual_yield')}</span>
              </li>
              <li>{_get(data, 'property.audit')}</li>
            </ul>
          </div>
        </div>

        <div className="rounded-xl bg-[#212328] p-6 space-y-4">
          <div className="fbc">
            <div className="font-medium">Transaction Status</div>
            <div className="text-[#898989]">Estimated token arrival time: 25 seconds</div>
          </div>

          <Progress
            className="w-full"
            strokeColor="var(--primary)"
            trailColor="#898989"
            percent={50}
            showInfo={false}
          />

          <div className="fbc text-3.5">
            <div>Transaction Hash</div>
            <div className="fyc gap-2">
              <div>{_get(data, 'transaction.hash')}</div>
              <div
                className="i-mingcute-copy-2-fill bg-[#b5b5b5] clickable"
                onClick={
                  () => copy(_get(data, 'transaction.hash'))
                }
              >
              </div>
            </div>
          </div>

          <IInfoField
            horizontal
            label="Smart Contract Status"
            value={_get(data, 'transaction.status')}
            labelClass="text-3.5"
            valueClass="text-3.5"
          />

          <IInfoField
            horizontal
            label="Block Confirmation"
            value={_get(data, 'transaction.block_confirmation')}
            labelClass="text-3.5"
            valueClass="text-3.5"
          />
        </div>

        <div className="pt-4 text-center">
          <Button
            type="primary"
            size="large"
            className="text-black!"
          >
            Confirm in Wallet
          </Button>
        </div>

        <ChatButton />
      </Waiting>
    </div>
  )
}

const Request: FC = () => {
  return (
    <>
      <div className="fbc">
        <div className="fyc gap-4">
          <SvgIcon name="token" className="size-6" />
          <div>
            <div className="text-3.5 text-[#b5b5b5]">Token Type</div>
            <div className="text-4 font-medium">RWA Token</div>
          </div>
        </div>
        <div>
          <div className="text-right text-3.5">Receiving Amount</div>
          <div className="text-right text-4 font-medium">1000 RWA</div>
        </div>
      </div>

      <div className="space-y-4">
        <IInfoField
          horizontal
          label="Transaction Status"
          value="Payment Successful"
          labelClass="text-3.5"
          valueClass="text-green! text-3.5"
        />

        <IInfoField
          horizontal
          label="Payment Amount"
          value="0.2 ETH"
          labelClass="text-3.5"
          valueClass="text-3.5"
        />
      </div>
    </>
  )
}

const Result: FC = () => {
  return (
    <>
      <div className="fccc gap-4">
        <div className="i-ep-success-filled size-15 bg-green"></div>
        <div className="text-6 font-medium">Token Distribution Complete</div>
        <div className="text-4 text-[#898989]">Tokens have been successfully transferred to your wallet</div>
      </div>

      <div className="rounded-xl bg-[#252932] p-4">
        <div className="text-3.5 text-[#b5b5b5]">Real Estate Token</div>
        <div className="text-4 font-medium">JPRE-0023</div>
      </div>
    </>
  )
}
