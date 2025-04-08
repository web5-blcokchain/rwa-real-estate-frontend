import { ChatButton } from '@/components/common/chat-button'
import ISeparator from '@/components/common/i-separator'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Button } from 'antd'

export const Route = createLazyFileRoute(
  '/_app/properties/distribution/result'
)({
  component: RouteComponent
})

function RouteComponent() {
  return (
    <div className="mx-a max-w-3xl rounded-xl bg-[#212328] p-6 space-y-4">
      <div className="fccc gap-4">
        <div className="i-ep-success-filled size-15 bg-green"></div>
        <div className="text-6 font-medium">Token Distribution Complete</div>
        <div className="text-4 text-[#898989]">Tokens have been successfully transferred to your wallet</div>
      </div>

      <div className="rounded-xl bg-[#252932] p-4">
        <div className="text-3.5 text-[#b5b5b5]">Real Estate Token</div>
        <div className="text-4 font-medium">JPRE-0023</div>
      </div>

      <ISeparator />

      <div className="space-y-4">
        <div className="fbc text-3.5">
          <div className="text-[#b5b5b5]">Smart Contract Address</div>
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
          <div className="text-[#b5b5b5]">Token Contract Address</div>
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
          <div className="text-[#b5b5b5]">Estimated Execution Time</div>
          <div className="text-[#898989]">Completed</div>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-[#252932] p-6 space-y-4">
        <div className="text-4 font-medium">Property Token Distribution</div>

        <ul className="list-disc list-inside text-3.5 space-y-2">
          <li>Tokenized shares of Shibuya Residence Complex</li>
          <li>Property Location: 2-3-1 Dogenzaka, Shibuya City, Tokyo</li>
          <li>Registration Number: JPRE-2024-0023</li>
          <li>Annual Yield: ~4.2%</li>
          <li>Smart Contract Audited by CertiK</li>
        </ul>
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
    </div>
  )
}
