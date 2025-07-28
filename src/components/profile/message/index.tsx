import type { CheckboxProps } from 'antd/lib'
import { Checkbox, ConfigProvider, Pagination, Select } from 'antd'
import enUS from 'antd/locale/en_US'
import jaJP from 'antd/locale/ja_JP'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import './index.scss'

export default function Message() {
  const { i18n } = useTranslation()
  const locale = i18n.language === 'en' ? enUS : i18n.language === 'zh' ? zhCN : jaJP

  const messageTypeList = [
    { label: '全部', value: 'all' },
    { label: '分红发放', value: 'system' },
    { label: '申诉结果', value: 'trade' },
    { label: '系统公告', value: 'activity' }
  ]
  const [messageType, setMessageType] = useState()
  const messageStatusList = [
    { label: '全部', value: 'all' },
    { label: '未读', value: 'unread' },
    { label: '已读', value: 'read' }
  ]
  const [messageStatus, setMessageStatus] = useState()
  const mockMessageList = [
    {
      id: 1,
      title: '分红发放',
      content: '分红发放',
      time: '2025-07-23 10:00:00',
      status: 0
    },
    {
      id: 2,
      title: '申诉结果',
      content: '申诉结果',
      time: '2025-07-23 10:00:00',
      status: 1
    },
    {
      id: 3,
      title: '系统公告',
      content: '系统公告',
      time: '2025-07-23 10:00:00',
      status: 0
    },
    {
      id: 4,
      title: '系统公告',
      content: '系统公告',
      time: '2025-07-23 10:00:00',
      status: 0
    }
  ]
  const [selectedMessage, setSelectedMessage] = useState([] as number[])
  // 选中全部消息
  const checkAll = mockMessageList.length === selectedMessage.length
  const indeterminate = selectedMessage.length > 0 && selectedMessage.length < mockMessageList.length
  const onCheckAllChange: CheckboxProps['onChange'] = (e) => {
    setSelectedMessage(e.target.checked ? mockMessageList.map(item => item.id) : [])
  }
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, _setTotal] = useState(20)
  return (
    <div>
      <div className="text-2xl text-white">消息中心</div>
      <div className="mt-4 fyc gap-5 text-base max-lg:flex-col max-lg:items-start max-lg:text-sm">
        <div className="fyc gap-5">
          <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}></Checkbox>
          <div className="cursor-pointer">最近7天</div>
          <div className="cursor-pointer">最近30天</div>
        </div>
        <div className="fyc gap-5">
          <Select placeholder="消息类型" className="input-placeholder w-120px max-lg:w-100px [&>div]:!b-0 [&>div]:!bg-transparent" options={messageTypeList} value={messageType} onChange={setMessageType} />
          <Select placeholder="状态" className="input-placeholder w-120px max-lg:w-100px [&>div]:!b-0 [&>div]:!bg-transparent" options={messageStatusList} value={messageStatus} onChange={setMessageStatus} />
          <div className="cursor-pointer">全部清除</div>
        </div>
      </div>
      <div>
        <Checkbox.Group value={selectedMessage} onChange={setSelectedMessage} className="mt-5 w-full pr-20 max-lg:px-0">
          <div className="w-full flex flex-col gap-4">
            {
              mockMessageList.map(item => (
                <div key={item.id} className="w-full flex items-start gap-3">
                  <Checkbox value={item.id}></Checkbox>
                  <div className="w-full flex flex-1 flex-col gap-2">
                    <div className="fyc justify-between">
                      <div className="flex items-start gap-2 text-18px max-lg:text-base">
                        <div>{item.title}</div>
                        {item.status === 0 && <div className="mt-3% size-2.5 rounded-full bg-#eb5545"></div>}
                      </div>
                      <div className="text-#dbdbdb max-lg:text-12px">{dayjs(item.time).format('YYYY-MM-DD HH:mm:ss')}</div>
                    </div>
                    <div className="text-sm">{item.content}</div>
                  </div>
                </div>
              ))
            }
          </div>
        </Checkbox.Group>
      </div>
      <ConfigProvider locale={locale}>
        <Pagination
          showQuickJumper
          align="end"
          total={total}
          pageSize={pageSize}
          current={current}
          onChange={(page, pageSize) => {
            setCurrent(page)
            setPageSize(pageSize)
          }}
        />
      </ConfigProvider>
    </div>
  )
}
