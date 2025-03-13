import { IInfoField } from '@/components/common/i-info-field'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Progress } from 'antd'

export const Route = createLazyFileRoute('/_app/properties/distribution/')({
  component: RouteComponent
})

function RouteComponent() {
  return (
    <div className="mx-a max-w-3xl p-8 space-y-8">
      <div className="text-7 font-medium">Token Distribution</div>

      <div className="rounded-xl bg-[#212328] p-6 space-y-4">
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

        <div className="rounded-xl bg-[#252932] p-4 space-y-2">
          <div className="fbc text-3.5">
            <div>Smart Contract Address</div>
            <div className="fyc gap-2">
              <div>0x1234...5678</div>
              <div
                className="i-mingcute-copy-2-fill bg-[#b5b5b5] clickable"
                onClick={() => copy('0x1234...5678')}
              >
              </div>
            </div>
          </div>

          <div className="fbc text-3.5">
            <div>Token Contract Address</div>
            <div className="fyc gap-2">
              <div>0x8765...4321</div>
              <div
                className="i-mingcute-copy-2-fill bg-[#b5b5b5] clickable"
                onClick={() => copy('0x8765...4321')}
              >
              </div>
            </div>
          </div>

          <div className="fbc text-3.5">
            <div>Estimated Execution Time</div>
            <div>About 30 seconds</div>
          </div>
        </div>

        <div className="rounded-xl bg-[#252932] p-6 space-y-4">
          <div className="text-4 font-medium">Property Token Distribution</div>

          <ul className="list-disc list-inside text-3.5 space-y-2">
            <li>Tokenized shares of Shibuya Residence Complex</li>
            <li>Property Location: 2-3-1 Dogenzaka, Shibuya City, Tokyo</li>
            <li>Registration Number: JPRE-2024-0023</li>
            <li>Annual Yield: ~4.2%</li>
            <li>Smart Contract Audited by CertiK</li>
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
            <div>0xabcd...efgh</div>
            <div
              className="i-mingcute-copy-2-fill bg-[#b5b5b5] clickable"
              onClick={() => copy('0xabcd...efgh')}
            >
            </div>
          </div>
        </div>

        <IInfoField
          horizontal
          label="Smart Contract Status"
          value="Executing"
          labelClass="text-3.5"
          valueClass="text-3.5"
        />

        <IInfoField
          horizontal
          label="Block Confirmation"
          value="1/12"
          labelClass="text-3.5"
          valueClass="text-3.5"
        />
      </div>
    </div>
  )
}
