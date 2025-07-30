import document1 from '@/assets/images/home/document-1.png'
import document2 from '@/assets/images/home/document-2.png'
import document3 from '@/assets/images/home/document-3.png'
import Document, { documentType } from '@/components/profile/document'
import { createLazyFileRoute } from '@tanstack/react-router'
import { ConfigProvider, Pagination, Tabs } from 'antd'
import './index.scss'

export const Route = createLazyFileRoute('/_app/news/')({
  component: RouteComponent
})

function RouteComponent() {
  const { t, i18n } = useTranslation()
  const documentList = [
    { title: 'home.document.upgrade', content: 'home.document.upgradeDesc', type: 0, date: '2025/4/28', img: document1 },
    { title: 'home.document.upgrade', content: 'home.document.upgradeDesc', type: 0, date: '2025/4/28', img: document2 },
    { title: 'home.document.upgrade', content: 'home.document.upgradeDesc', type: 0, date: '2025/4/28', img: document3 },
    { title: 'home.document.upgrade', content: 'home.document.upgradeDesc', type: 0, date: '2025/4/28', img: document3 },
    { title: 'home.document.upgrade', content: 'home.document.upgradeDesc', type: 0, date: '2025/4/28', img: document3 },
    { title: 'home.document.upgrade', content: 'home.document.upgradeDesc', type: 0, date: '2025/4/28', img: document3 }
  ]
  const [tabsKey, setTabsKey] = useState(0)
  const tabOfDocument = (index: number) => {
    return (
      <div className="grid grid-cols-3 gap-x-[29px] gap-y-[43px] rounded-14px max-lg:grid-cols-2 max-lg:gap-3 max-xl:gap-6">
        {
          documentList.map((res) => {
            return <Document key={res.title} data={res} index={index} />
          })
        }
      </div>
    )
  }
  const [activeKey, setActiveKey] = useState('1')
  useEffect(() => {
    // 语言变化后触发 Tabs 的宽度重计算
    setTabsKey(prev => prev + 1)
  }, [i18n.language])

  return (
    <div className="news-tables px-102px max-lg:px-24px max-md:px-12px">
      <ConfigProvider
        theme={{
          // 1. 单独使用暗色算法
          components: {
            Tabs: {

            }
          }

          // 2. 组合使用暗色算法与紧凑算法
          // algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
        }}
      >
        <Tabs
          activeKey={activeKey}
          key={tabsKey}
          onChange={setActiveKey}
          className="mt-77px max-lg:mt-0px"
          defaultActiveKey="1"
          items={[
            { label: t(documentType[0]), key: '1', children: tabOfDocument(0) },
            { label: t(documentType[1]), key: '2', children: tabOfDocument(1) },
            { label: t(documentType[2]), key: '3', children: tabOfDocument(2) },
            { label: t(documentType[3]), key: '4', children: tabOfDocument(3) }
          ]}
        />
      </ConfigProvider>
      <div className="fcc py-10">
        <Pagination defaultCurrent={1} total={50} />
      </div>
    </div>
  )
}
