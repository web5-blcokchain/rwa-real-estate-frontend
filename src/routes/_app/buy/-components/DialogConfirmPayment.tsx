import type { Dispatch, SetStateAction } from 'react'
import { Button, Modal } from 'antd'
import './DialogConfirmPayment.scss'

export const DialogConfirmPayment: FC<{
  openState: [boolean, Dispatch<SetStateAction<boolean>>]
}> = ({
  openState
}) => {
  const [open, setOpen] = openState
  return (
    <Modal
      open={open}
      footer={null}
      width={760}
      maskClosable={false}
      className="login-dialog max-lg:w-96 max-md:w-80 max-lg:[&>div>.ant-modal-content]:!px-12px"
      title="确认"
      onCancel={() => setOpen(false)}
    >
      <div className="w-full">
        <div className="mt-11 fyc justify-evenly">
          <div className="fccc gap-4 max-lg:gap-2">
            <img className="size-45px rounded-full" src="/src/assets/images/bnb.png" alt="" />
            <div className="text-xl text-#606672 max-lg:text-base">BNB</div>
            <div className="text-3xl max-lg:text-2xl">0.0001</div>
          </div>
          <div className="i-gg:arrow-right size-42px bg-white max-lg:size-32px"></div>
          <div className="fccc gap-4 max-lg:gap-2">
            <img className="size-45px rounded-full" src="/src/assets/images/usdc.png" alt="" />
            <div className="text-xl text-#606672 max-lg:text-base">USDC</div>
            <div className="text-3xl max-lg:text-2xl">0.0001</div>
          </div>
        </div>
        <div className="mt-9 fyc justify-between b-1 b-#606672 rounded-5 px-4 py-4 text-2xl max-lg:mt-4 max-lg:px-3 max-lg:py-2 max-lg:text-base">
          <div className="fcc gap-2 max-lg:gap-1">
            <div className="i-carbon-warning size-30px bg-white max-lg:size-20px"></div>
            <div>价格已更新</div>
          </div>
          <Button className="h-56px b-#F0B90B rounded-5 bg-#F0B90B px-7 text-2xl text-black max-lg:h-40px max-lg:px-5 max-lg:text-base [&>div]:hover:bg-#F0B90B hover:!text-#F0B90B">
            接受
          </Button>
        </div>
        <div className="mt-55px flex flex-col gap-10px b-1 b-#606672 rounded-5 px-6 py-4 text-2xl max-lg:mt-20px [&>div]:flex [&>div]:justify-between max-lg:px-3 max-lg:py-2 max-lg:text-base [&>div]:leading-80px [&>div>div:first-child]:!text-[#606672] max-lg:[&>div]:leading-40px">
          <div>
            <div>兑换率</div>
            <div className="fcc gap-1">
              <span>291.802 CAKE/BNB</span>
              <div className="i-icon-park-outline:switch bg-#606672"></div>
            </div>
          </div>
          <div>
            <div>价格影响</div>
            <div>&lt;0.01%</div>
          </div>
          <div className="items-center">
            <div>滑点容差</div>
            <Button className="h-56px gap-2px b-#F0B90B rounded-5 bg-#F0B90B px-3 text-2xl text-black max-lg:h-40px max-lg:gap-1 max-lg:px-2 max-lg:text-base [&>div]:hover:bg-#F0B90B hover:!text-#F0B90B">
              <div className="i-ant-design:warning-outlined w-6 bg-black"></div>
              <span>自动: 5.00%</span>
              <div className="i-tdesign:edit w-6 bg-black"></div>
            </Button>
          </div>
          <div>
            <div>最大卖出量</div>
            <div>0.000105003565497 BNB</div>
          </div>
          <div>
            <div>交易手续费</div>
            <div>0.0000000100003 BNB</div>
          </div>
        </div>
        <Button onClick={() => setOpen(false)} className="mt-14 mt-46px h-auto w-full rounded-5 bg-#F0B90B bg-#F0B90B py-18px text-7 text-black leading-10 max-lg:mt-24px max-md:mt-24px max-lg:py-12px max-md:py-6px max-lg:text-7 max-md:text-4">确认交易</Button>
      </div>
    </Modal>
  )
}
