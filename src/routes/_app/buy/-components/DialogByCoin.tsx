import type { Dispatch, KeyboardEvent, SetStateAction } from 'react'
import { Input, Modal } from 'antd'
import './DialogByCoin.scss'

export const DialogByCoin: FC<{
  openState: [boolean, Dispatch<SetStateAction<boolean>>]
  type: number
  onSelectCoin: (data: any) => void
}> = ({
  openState,
  type,
  onSelectCoin
}) => {
  const [open, setOpen] = openState
  const [search, setSearch] = useState('')

  // 模拟数据
  const coinList = [
    {
      name: 'BNB',
      address: '0x1234567890123456789012345678901234567890',
      description: 'BNB Chain'
    },
    {
      name: 'USDT',
      address: '0x1234567890123456789012345678901234567890',
      description: 'BNB Chain'
    },
    {
      name: 'USDT',
      address: '0x1234567890123456789012345678901234567890',
      description: 'BNB Chain'
    },
    {
      name: 'USDC',
      address: '0x1234567890123456789012345678901234567890',
      description: 'BNB Chain'
    },
    {
      name: 'USDC',
      address: '0x1234567890123456789012345678901234567890',
      description: 'BNB Chain'
    },
    {
      name: 'USDC',
      address: '0x1234567890123456789012345678901234567890',
      description: 'BNB Chain'
    },
    {
      name: 'USDC',
      address: '0x1234567890123456789012345678901234567890',
      description: 'BNB Chain'
    }

  ]

  // 搜索代币
  function toSearchCoin(e: KeyboardEvent<HTMLInputElement> | undefined) {
    if (e && e.key === 'Enter') {
      console.log(search)
    }
  }

  // 选中代币
  function selectCoin(data: any) {
    onSelectCoin(data)
    setOpen(false)
  }

  return (
    <Modal
      open={open}
      footer={null}
      width={760}
      maskClosable={false}
      className="login-dialog overflow-hidden max-lg:w-96 max-md:w-80"
      title={type === 0 ? '从' : '到'}
      onCancel={() => setOpen(false)}
    >
      <div className="flex flex-1 flex-col">
        <Input
          rootClassName="h-20 text-22px rounded-60px
        px-34px b-#606672 bg-transparent mt-15px
         max-lg:text-16px max-lg:px-20px max-lg:h-12 max-lg:rounded-40px
         max-md:text-14px max-md:px-10px"
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => toSearchCoin(e)}
          placeholder="搜索名称/地址"
        />
        <div className="mt-9px text-22px leading-11 max-lg:text-16px max-lg:leading-9">RWA代币</div>
        <div className="coin-list flex flex-1 flex-col gap-16px overflow-hidden overflow-y-auto overflow-y-scroll p-10px max-lg:gap-8px max-lg:p-4px">
          {
            coinList.map((item, index) => {
              return (
                <div key={index} className="w-full fyc justify-between">
                  <div className="font-500">
                    <div className="text-22px leading-11 max-lg:text-16px max-lg:leading-9">{item.name}</div>
                    <div className="pb-4 text-18px text-#606672 max-lg:text-12px">{item.description}</div>
                  </div>
                  <div onClick={() => selectCoin(item)} className="i-gg-arrow-right size-9 cursor-pointer max-lg:size-6"></div>
                </div>
              )
            })
          }
        </div>
      </div>
    </Modal>
  )
}
