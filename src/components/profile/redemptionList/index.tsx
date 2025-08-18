import { getWarningRedemptionList } from '@/api/assets'
import { useCommonDataStore } from '@/stores/common-data'
import { formatNumberNoRound } from '@/utils/number'
import { toBlockchainByHash } from '@/utils/web/utils'
import { useQuery } from '@tanstack/react-query'
import { ConfigProvider, Empty, Pagination, Spin } from 'antd'
import enUS from 'antd/locale/en_US'
import jaJP from 'antd/locale/ja_JP'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'

export default function RedemptionList() {
  const locale = i18n.language === 'en' ? enUS : i18n.language === 'zh' ? zhCN : jaJP
  const { t } = useTranslation()
  const commonData = useCommonDataStore()
  const [pagination, setPagination] = useState({
    pageSize: 10,
    current: 1,
    total: 0,
    showQuickJumper: true,
    showSizeChanger: false
  })
  const getRedemptionList = async () => {
    return await getWarningRedemptionList({ page: pagination.current, pageSize: pagination.pageSize })
  }
  const { data, isFetching: isLoading, refetch: redemptionListRefetch } = useQuery({
    queryKey: ['redemptionList'],
    queryFn: async () => {
      const data = await getRedemptionList()
      return data.data
    }
  })
  useEffect(() => {
    redemptionListRefetch()
  }, [pagination.current, pagination.pageSize])
  useEffect(() => {
    setPagination({
      ...pagination,
      total: (data?.total || 0)
    })
  }, [data])
  const statusText = ['processing', 'completed']

  return (
    <div className="text-white [&>div:last-child]:b-0 [&>div]:b-b-1 [&>div]:b-#242933 [&>div]:pb-30px">
      <Spin spinning={isLoading}>
        {
          data?.list && data?.list.length > 0
            ? (
                <div>
                  {data?.list.map((item) => {
                    return (
                      <div key={item.id} className="b-b-1 b-b-#242933 py-3">
                        <div className="overflow-hidden">
                          <div className="truncate text-xl max-md:text-base" title={item.name}>{item.name}</div>
                          <div className="truncate text-2xl max-md:text-xl" title={item.address}>{item.address}</div>
                        </div>
                        <div className="scrollbar-hidden overflow-hidden overflow-x-scroll">
                          <div className="grid grid-cols-6 mt-8 w-full gap-2 [&>div>div]:w-max max-md:w-max max-md:flex [&>div>div:first-child]:text-base [&>div>div:last-child]:text-xl [&>div>div:first-child]:text-#898989 [&>div>div:first-child]:max-md:text-sm [&>div>div:last-child]:max-md:text-base">
                            <div>
                              <div>{t('profile.redemptionList.investment_amount')}</div>
                              <div>
                                {formatNumberNoRound(item.total_current, 8)}
                                {' '}
                                {commonData.payTokenName}
                              </div>
                            </div>
                            <div>
                              <div>{t('profile.redemptionList.redemption_income')}</div>
                              <div>
                                {formatNumberNoRound(item.price, 8)}
                                {' '}
                                {commonData.payTokenName}
                              </div>
                            </div>
                            <div>
                              <div>{t('profile.redemptionList.redemption_date')}</div>
                              <div>{dayjs(item.create_date * 1000).format('YYYY-MM-DD')}</div>
                            </div>
                            <div>
                              <div>{t('profile.redemptionList.transaction_hash')}</div>
                              <div
                                className="cursor-pointer hover:text-primary"
                                onClick={() => toBlockchainByHash(item.tx_hash)}
                                title={item.tx_hash}
                              >
                                {item.tx_hash ? (`${item.tx_hash.slice(0, 4)}...${item.tx_hash.slice(-4)}`) : ''}
                              </div>
                            </div>
                            <div>
                              <div>{t('profile.redemptionList.income_date')}</div>
                              <div>{dayjs(item.received_date * 1000).format('YYYY-MM-DD')}</div>
                            </div>
                            <div className="fyc">
                              <div className="w-fit rounded-md bg-#f6d659 px-4 py-1 !text-sm !text-black">{t(`profile.redemptionList.${statusText[item.status]}`)}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  <div className="mt-14 fcc">
                    <ConfigProvider locale={locale}>
                      <Pagination
                        pageSize={pagination.pageSize}
                        current={pagination.current}
                        total={pagination.total}
                        showQuickJumper
                        showSizeChanger={false}
                        onChange={(page, pageSize) => {
                          setPagination({
                            ...pagination,
                            current: page,
                            pageSize
                          })
                        }}
                      />
                    </ConfigProvider>
                  </div>
                </div>
              )
            : (
                <div className="h-full">
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="">
                    <div className="text-base text-white">{t('common.no_data')}</div>
                  </Empty>
                </div>
              )
        }
      </Spin>
    </div>
  )
}
