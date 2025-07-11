import type { TabsProps } from 'antd'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Button, Checkbox, ConfigProvider, InputNumber, Tabs } from 'antd'
import { useState } from 'react'
import { DialogByCoin } from './-components/DialogByCoin'
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
    <div className="pt-38px">
      <div className={cn('b-1 rounded-10px px-22px pt-5 pb-26px transition-all duration-300 mb-38px', selected === 0 ? 'b-#F0B90B' : 'b-#484D56')}>
        <div className="fyc justify-between">
          <div className="text-22px text-#606672 leading-11">从</div>
          {
            type === 1 && (
              <div className="fyc gap-3 text-22px text-#606672 font-500">
                {
                  sellType.map((item, index) => {
                    return (
                      <div key={index} className="fyc gap-3">
                        <div className="cursor-pointer">{item === 100 ? 'MAX' : (`${item}%`)}</div>
                        {
                          index !== sellType.length - 1 && <div className="h-4 w-1px bg-#606672"></div>
                        }
                      </div>
                    )
                  })
                }
              </div>
            )
          }
        </div>
        <div className="fyc justify-between gap-4">
          <div className="flex gap-23px">
            <div className="size-45px rounded-full pt-8px">
              <img src="/src/assets/images/bnb.png" alt="" />
            </div>
            <div>
              <div className="fyc cursor-pointer gap-2 text-8 leading-11" onClick={() => toOpenDialog(0)}>
                <span>BNB</span>
                <span><div className="i-solar-alt-arrow-down-line-duotone size-6"></div></span>
              </div>
              <div className="text-18px leading-6">BNB Chain</div>
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
              rootClassName="h-68px w-full b-0 !shadow-none bg-transparent text-right"
              placeholder="0.00"
              onChange={value => value && setBuyValue(value)}
            />
          </div>
        </div>
      </div>
      <div className={cn('b-1 rounded-10px px-22px pt-5 pb-26px transition-all duration-300', selected === 1 ? 'b-#F0B90B' : 'b-#484D56')}>
        <div className="fyc justify-between">
          <div className="text-22px text-#606672 leading-11">到</div>
          {
            type === 1 && (
              <div className="fyc gap-2 text-22px text-#606672 font-500">
                <div className="i-mingcute:wallet-line bg-#606672"></div>
                <span>0.0003342</span>
              </div>
            )
          }
        </div>
        <div className="fyc justify-between gap-4">
          <div className="flex gap-23px">
            <div className="size-45px rounded-full pt-8px">
              <img src="/src/assets/images/usdc.png" alt="" />
            </div>
            <div>
              <div className="fyc cursor-pointer gap-2 text-8 leading-11" onClick={() => toOpenDialog(0)}>
                <span>USDT</span>
                <span><div className="i-solar-alt-arrow-down-line-duotone size-6"></div></span>
              </div>
              <div className="text-18px leading-6">BNB Chain</div>
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
              rootClassName="h-68px w-full b-0 !shadow-none bg-transparent text-right"
              placeholder="0.00"
              onChange={value => value && setSellValue(value)}
            />
          </div>
        </div>
      </div>
      <Checkbox rootClassName="text-xl" onChange={() => setSelectedMEV(!selectedMEV)}>启用MEV保护</Checkbox>
      <Button onClick={buyOrSell} rootClassName="w-full py-22px text-9 h-auto leading-11 bg-#F0B90B text-black mt-46px">
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

  return (
    <div className="buy-content mx-auto min-w-760px w-53%">
      <div className="mb-98px mt-101px text-center text-38px font-500 leading-61px">
        轻松买卖，只需点击“购买”开始，我们将全程引导您完成整个过程
      </div>
      <div className="b-1 b-#484D56 rounded-30px px-10 pb-71px pt-22">
        <ConfigProvider
          theme={{
            components: {
              Tabs: {
                titleFontSize: 40
              }
            }
          }}
        >
          <Tabs rootClassName="text-10 leading-11" defaultActiveKey="1" activeKey={activeTab} items={items} onChange={setActiveTab} />
        </ConfigProvider>
      </div>
    </div>
  )
}
