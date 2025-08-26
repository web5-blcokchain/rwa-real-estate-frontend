import { getWarningRedemptionList } from '@/api/assets'
import { useCommonDataStore } from '@/stores/common-data'
import { formatNumberNoRound } from '@/utils/number'
import { joinImagesPath } from '@/utils/url'
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
  const { data, isFetching: isLoading } = useQuery({
    queryKey: ['redemptionList', pagination.current, pagination.pageSize],
    queryFn: async () => {
      const data = await getWarningRedemptionList({ page: pagination.current, pageSize: pagination.pageSize })
      return data.data
    }
  })
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
                      <div key={item.id} className="fyc gap-4 b-b-1 b-b-#242933 py-3">
                        <div className="fcc flex-[2] overflow-hidden max-xl:flex-[3]">
                          <div className="relative size-100px overflow-hidden rounded-md">
                            <img className="absolute inset-0 left-1/2 top-1/2 w-full !max-w-max -translate-x-1/2 -translate-y-1/2" src={joinImagesPath(item.image_urls)[0]} alt="" />
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <div className="truncate text-xl max-md:text-base" title={item.name}>{item.name}</div>
                            <div className="truncate text-base max-md:text-xl" title={item.address}>{item.address}</div>
                          </div>
                        </div>
                        <div className="scrollbar-hidden flex-grow-7 overflow-hidden overflow-x-scroll" style={{ flex: 8 }}>
                          <div className="grid grid-cols-6 w-full gap-2 [&>div>div]:w-max max-md:w-max max-md:flex [&>div]:overflow-hidden [&>div>div]:truncate [&>div>div:first-child]:text-base [&>div>div:last-child]:text-xl [&>div>div:first-child]:text-#898989 [&>div>div:first-child]:max-md:text-sm [&>div>div:first-child]:max-xl:text-sm [&>div>div:last-child]:max-md:text-base [&>div>div:last-child]:max-xl:text-base">
                            <div>
                              <div>{t('profile.redemptionList.investment_amount')}</div>
                              <div>
                                {formatNumberNoRound(item.total_current, 7)}
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
                            <div className="ml-2 fyc">
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
