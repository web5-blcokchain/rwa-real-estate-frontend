import type { CheckboxProps } from 'antd/lib'
import { getMessageList, readUserMessage } from '@/api/profile'
import EmptyContent from '@/components/common/empty-content'
import { useUserStore } from '@/stores/user'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Checkbox, ConfigProvider, Pagination, Select, Spin } from 'antd'
import enUS from 'antd/locale/en_US'
import jaJP from 'antd/locale/ja_JP'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import './index.scss'

export default function Message() {
  const { i18n, t } = useTranslation()
  const locale = i18n.language === 'en' ? enUS : i18n.language === 'zh' ? zhCN : jaJP

  const messageTypeList = [
    { label: <div>{t('profile.message.all')}</div>, value: 0 },
    { label: <div>{t('profile.message.kycApproved')}</div>, value: 1 },
    { label: <div>{t('profile.message.assetDefault')}</div>, value: 2 },
    { label: <div>{t('profile.message.c2cTrade')}</div>, value: 3 }
  ]
  const [messageType, setMessageType] = useState()
  const messageStatusList = [
    { label: <div>{t('profile.message.all')}</div>, value: -1 },
    { label: <div>{t('profile.message.unread')}</div>, value: 0 },
    { label: <div>{t('profile.message.read')}</div>, value: 1 }
  ]
  const [messageStatus, setMessageStatus] = useState()
  const { setUserNoReadMessage } = useUserStore()
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(12)
  const [selectTime, setSelectTime] = useState({
    date_start: '',
    date_end: '',
    type: 0
  })
  // 获取消息列表
  const { data: userMessage, refetch: refetchMessageList, isFetching: userMessageLoading } = useQuery({
    queryKey: ['getMessageList', messageStatus, pageSize, current, selectTime, messageType],
    queryFn: async () => {
      const res = await getMessageList({
        page: current,
        pageSize,
        status: typeof messageStatus === 'number' && messageStatus >= 0 ? messageStatus : undefined,
        type: !messageType ? undefined : messageType,
        data_start: selectTime.date_start,
        date_end: selectTime.date_end
      })
      const data = res.data
      // 获取消息总量
      if (data?.unread)
        setUserNoReadMessage(data?.unread)
      return data
    }
  })
  const [selectedMessage, setSelectedMessage] = useState([] as number[])
  // 选中全部消息
  const checkAll = useMemo(() => {
    return userMessage?.list.length === selectedMessage.length
  }, [userMessage, selectedMessage])
  const indeterminate = useMemo(() => {
    return selectedMessage.length > 0 && selectedMessage.length < (userMessage?.list.length || 0)
  }, [userMessage])
  const onCheckAllChange: CheckboxProps['onChange'] = (e) => {
    setSelectedMessage(e.target.checked ? (userMessage?.list || []).map(item => item.id) : [])
  }

  // 清空未读消息
  const { mutateAsync: readMessage, isPending: readLadoing } = useMutation({
    mutationKey: ['readUserMessage'],
    mutationFn: async (data: {
      ids: number[]
    }) => {
      return await readUserMessage(data)
    }
  })
  async function clearUnread(ids?: number[]) {
    const nowIds = userMessage?.list ? userMessage.list.filter(item => item.status === 0).map(item => item.id) : []
    ids = ids && ids.length > 0 ? ids : nowIds
    await readMessage({ ids }).then((res) => {
      if (res.code === 1) {
        refetchMessageList()
      }
    })
  }

  // 设置获取消息列表时间区间
  function getMessageByDate(type: number) {
    if (type === selectTime.type)
      type = 0
    switch (type) {
      case 0:
        setSelectTime({ date_start: '', date_end: '', type })
        return
      case 1:
        setSelectTime({ date_start: dayjs().subtract(7, 'days').format('YYYY-MM-DD'), date_end: dayjs().format('YYYY-MM-DD'), type })
        return
      case 2:
        setSelectTime({ date_start: dayjs().subtract(30, 'days').format('YYYY-MM-DD'), date_end: dayjs().format('YYYY-MM-DD'), type })
    }
  }

  return (
    <div>
      <div className="text-2xl text-white">{t('profile.message.center')}</div>
      <div className="mt-4 fyc gap-5 text-base max-lg:flex-col max-lg:items-start max-lg:text-sm">
        <div className="fyc gap-5">
          <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}></Checkbox>
          <div onClick={() => getMessageByDate(1)} className={cn('cursor-pointer px-4 py-1 rounded-md', selectTime.type === 1 && 'bg-#212328')}>{t('profile.message.last7Days')}</div>
          <div onClick={() => getMessageByDate(2)} className={cn('cursor-pointer px-4 py-1 rounded-md', selectTime.type === 2 && 'bg-#212328')}>{t('profile.message.last30Days')}</div>
        </div>
        <div className="fyc gap-5">
          <Select
            placeholder={t('profile.message.type')}
            className="input-placeholder w-120px max-lg:w-100px [&>div]:!b-0 [&>div]:!bg-transparent"
            options={messageTypeList}
            value={messageType}
            onChange={setMessageType}
          />
          <Select
            placeholder={t('profile.message.status')}
            className="input-placeholder w-120px max-lg:w-100px [&>div]:!b-0 [&>div]:!bg-transparent"
            options={messageStatusList}
            value={messageStatus}
            onChange={setMessageStatus}
          />
          <div className="cursor-pointer" onClick={() => clearUnread(selectedMessage)}>{t(`profile.message.${selectedMessage.length > 0 ? 'clearSelected' : 'clearAll'}`)}</div>
        </div>
      </div>
      <div className="mb-10">
        <Checkbox.Group
          value={selectedMessage}
          onChange={setSelectedMessage}
          className="mt-5 w-full pr-20 [&>div]:w-full max-lg:px-0"
        >
          <Spin spinning={userMessageLoading || readLadoing}>
            {userMessage?.list && userMessage.list.length > 0
              ? (
                  <div className="w-full flex flex-col gap-4">
                    {
                      userMessage?.list && userMessage?.list.map(item => (
                        <div key={item.id} className="w-full flex items-start gap-3">
                          <Checkbox value={item.id}></Checkbox>
                          <div className="w-full flex flex-1 flex-col gap-2">
                            <div className="fyc justify-between">
                              <div className="flex items-start gap-2 text-18px max-lg:text-base">
                                <div>{item.title}</div>
                                {item.status === 0 && <div className="mt-3% size-2.5 rounded-full bg-#eb5545"></div>}
                              </div>
                              <div className="text-#dbdbdb max-lg:text-12px">{dayjs(item.create_time).format('YYYY-MM-DD HH:mm:ss')}</div>
                            </div>
                            <div className="text-sm">{item.content}</div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                )
              : <EmptyContent />}
          </Spin>
        </Checkbox.Group>

      </div>
      {((userMessage?.list && userMessage.list.length > 0) || current > 1) && (
        <ConfigProvider locale={locale}>
          <Pagination
            showQuickJumper
            showSizeChanger={false}
            align="center"
            total={userMessage?.count || 0}
            pageSize={pageSize}
            current={current}
            onChange={(page, pageSize) => {
              setCurrent(page)
              setPageSize(pageSize)
            }}
          />
        </ConfigProvider>
      )}
    </div>
  )
}
