import type { TabsProps } from 'antd'
import bnb from '@/assets/images/bnb.png'
import usdc from '@/assets/images/usdc.png'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Button, Checkbox, ConfigProvider, InputNumber, Tabs } from 'antd'
import { useState } from 'react'
import { DialogByCoin } from './-components/DialogByCoin'
import { DialogConfirmPayment } from './-components/DialogConfirmPayment'
import './index.scss'

export const Route = createLazyFileRoute('/_app/buy/$id')({
  component: RouteComponent
})

function BuyContent({ type, onSuccess }: { type: number, onSuccess: () => void }) {
  const [buyValue, setBuyValue] = useState<number>(0)
  const [sellValue, setSellValue] = useState<number>(0)
  const [selected, setSelected] = useState(-1)
  const [selectedMEV, setSelectedMEV] = useState(false)
  const sellType = [25, 50, 100]
  const [open, setOpen] = useState(false)
  const [openDialogType, setOpenDialogType] = useState(0)
  // TODO 输入出售代币计算到账代币

  // TODO 输入到账代币计算出售代币

  // 购买/出售代币
  const buyOrSell = () => {
    if (selectedMEV)
      console.log(buyValue, sellValue)
    onSuccess()
  }

  const toOpenDialog = (type: number) => {
    setOpenDialogType(type)
    setOpen(true)
  }

  // 搜索代币返回到内容
  const searchCoin = (data: any) => {
    console.log(data)
  }

  return (
    <div className="pt-38px max-lg:pt-24px max-md:pt-12px">
      <div
        className={cn(
          'b-1 rounded-10px px-22px pt-5 pb-26px transition-all duration-300 mb-38px',
          selected === 0 ? 'b-#F0B90B' : 'b-#484D56',
          'max-lg:rounded-8px max-lg:px-8 max-lg:pt-2 max-lg:pb-12px max-lg:mb-20px',
          'max-md:rounded-6px max-md:px-2 max-md:pt-1 max-md:pb-6px max-md:mb-10px'
        )}
      >
        <div className="fyc justify-between">
          <div className="text-22px text-#606672 leading-11 max-lg:text-16px max-md:text-12px">从</div>
          {type === 1 && (
            <div className="fyc gap-3 text-22px text-#606672 font-500 max-lg:text-16px max-md:text-12px">
              {sellType.map((item, index) => (
                <div key={index} className="fyc gap-3 max-lg:gap-2 max-md:gap-1">
                  <div className="cursor-pointer">{item === 100 ? 'MAX' : `${item}%`}</div>
                  {index !== sellType.length - 1 && <div className="h-4 w-1px bg-#606672"></div>}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="fyc justify-between gap-4 max-lg:gap-2 max-md:gap-1">
          <div className="flex gap-23px max-lg:gap-12px max-md:gap-6px">
            <div className="size-45px rounded-full pt-8px max-lg:size-32px max-md:size-24px max-lg:pt-8px max-md:pt-10px">
              <img src={bnb} alt="" />
            </div>
            <div>
              <div
                className="fyc cursor-pointer gap-2 text-7 leading-10 max-lg:text-6 max-md:text-4"
                onClick={() => toOpenDialog(0)}
              >
                <span>BNB</span>
                <span>
                  <div className="i-solar-alt-arrow-down-line-duotone size-6 max-lg:size-4 max-md:size-3"></div>
                </span>
              </div>
              <div className="text-16px leading-6 max-lg:text-14px max-md:text-10px">BNB Chain</div>
            </div>
          </div>
          <div className="flex-1">
            <InputNumber<number>
              onBlur={() => {
                setSelected(-1)
              }}
              // 失去焦点
              onFocus={() => {
                setSelected(0)
              }}
              controls={false}
              rootClassName="h-68px w-full b-0 !shadow-none bg-transparent text-right max-lg:h-48px max-md:h-32px"
              placeholder="0.00"
              onChange={value => value && setBuyValue(value)}
            />
          </div>
        </div>
      </div>
      <div
        className={cn(
          'b-1 rounded-10px px-22px pt-5 pb-26px transition-all duration-300',
          selected === 1 ? 'b-#F0B90B' : 'b-#484D56',
          'max-lg:rounded-8px max-lg:px-8 max-lg:pt-2 max-lg:pb-12px',
          'max-md:rounded-6px max-md:px-2 max-md:pt-1 max-md:pb-6px'
        )}
      >
        <div className="fyc justify-between">
          <div className="text-22px text-#606672 leading-11 max-lg:text-16px max-md:text-12px">到</div>
          {type === 1 && (
            <div className="fyc gap-2 text-22px text-#606672 font-500 max-lg:text-16px max-md:text-12px">
              <div className="i-mingcute:wallet-line bg-#606672"></div>
              <span>0.0003342</span>
            </div>
          )}
        </div>
        <div className="fyc justify-between gap-4 max-lg:gap-2 max-md:gap-1">
          <div className="flex gap-23px max-lg:gap-12px max-md:gap-6px">
            <div className="size-45px rounded-full pt-8px max-lg:size-32px max-md:size-24px max-lg:pt-8px max-md:pt-10px">
              <img src={usdc} alt="" />
            </div>
            <div>
              <div className="fyc cursor-pointer gap-2 text-7 leading-10 max-lg:text-6 max-md:text-4" onClick={() => toOpenDialog(0)}>
                <span>USDT</span>
                <span><div className="i-solar-alt-arrow-down-line-duotone size-6 max-lg:size-4 max-md:size-3"></div></span>
              </div>
              <div className="text-16px leading-6 max-lg:text-14px max-md:text-10px">BNB Chain</div>
            </div>
          </div>
          <div className="flex-1">
            <InputNumber<number>
              onBlur={() => {
                setSelected(-1)
              }}
              // 失去焦点
              onFocus={() => {
                setSelected(1)
              }}
              controls={false}
              rootClassName="h-68px w-full b-0 !shadow-none bg-transparent text-right max-lg:h-48px max-md:h-32px"
              placeholder="0.00"
              onChange={value => value && setSellValue(value)}
            />
          </div>
        </div>
      </div>
      <Checkbox rootClassName="text-xl max-lg:text-lg max-md:text-base" onChange={() => setSelectedMEV(!selectedMEV)}>启用MEV保护</Checkbox>
      <Button onClick={buyOrSell} rootClassName="w-full py-18px text-7 h-auto leading-10 bg-#F0B90B text-black mt-46px max-lg:py-12px max-lg:text-7 max-lg:mt-24px max-md:py-6px max-md:text-4 max-md:mt-12px">
        {buyValue > 0 ? '确认' : '输入金额'}
      </Button>
      <DialogByCoin openState={[open, setOpen]} type={openDialogType} onSelectCoin={searchCoin} />
    </div>
  )
}

function RouteComponent() {
  // const { params } = useMatch({
  //   from: '/_app/buy/$id',
  // })

  const [activeTab, setActiveTab] = useState('1')
  const [status, setStatus] = useState(0)

  const onSuccess = () => {
    setStatus(1)
    console.log(status)
  }

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '买入',
      children: <BuyContent onSuccess={onSuccess} type={0} />
    },
    {
      key: '2',
      label: '卖出',
      children: <BuyContent onSuccess={onSuccess} type={0} />
    }
  ]

  const [openConfirmPayment, setOpenConfirmPayment] = useState(false)

  return (
    <div className="buy-content mx-auto min-w-760px w-53% max-lg:min-w-0 max-lg:w-11/12 max-md:w-full max-md:px-16px">
      <div className="mb-98px mt-101px text-center text-38px font-500 leading-61px max-lg:mb-60px max-lg:mt-60px max-md:mb-32px max-md:mt-32px max-lg:text-28px max-md:text-20px max-lg:leading-40px max-md:leading-28px">
        轻松买卖，只需点击“购买”开始，我们将全程引导您完成整个过程
      </div>
      <div className="b-1 b-#484D56 rounded-30px px-10 pb-71px pt-22 max-lg:rounded-20px max-md:rounded-10px max-lg:px-4 max-md:px-2 max-lg:pb-40px max-lg:pt-12 max-md:pb-20px max-md:pt-6">
        <ConfigProvider
          theme={{
            components: {
              Tabs: {
                // titleFontSize: 40,
                // 响应式：可用CSS变量或动态设置，或用更小字号
                // 这里建议用className控制Tabs内容字体
              }
            }
          }}
        >
          <Tabs
            rootClassName="
              text-10 leading-11
              max-lg:text-8 max-lg:leading-9
              max-md:text-6 max-md:leading-7
            "
            defaultActiveKey="1"
            activeKey={activeTab}
            items={items}
            onChange={setActiveTab}
          />
        </ConfigProvider>
      </div>
      <DialogConfirmPayment openState={[openConfirmPayment, setOpenConfirmPayment]} />
    </div>
  )
}
