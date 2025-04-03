import type { MenuProps } from 'antd'
import { _useStore as useStore } from '@/_store/_userStore'
import maskGroup from '@/assets/images/mask-group.png'
import Earnings from '@/components/aboutMe/earnings/earnings'
import History from '@/components/aboutMe/history/history'
import Overview from '@/components/aboutMe/overview/overview'
import PropertyTokens from '@/components/aboutMe/propertyTokens/propertyTokens'
import Security from '@/components/aboutMe/security/security'

import { createLazyFileRoute } from '@tanstack/react-router'
import { Layout, Menu } from 'antd'
import React from 'react'
import './aboutMe.scss'

export const Route = createLazyFileRoute('/_app/aboutMe/')({
  component: RouteComponent
})

const baseUrl = import.meta.env.VITE_PUBLIC_API_URL

const { Content, Sider } = Layout

type MenuItem = Required<MenuProps>['items'][number]

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label
  } as MenuItem
}

function RouteComponent() {
  const { t } = useTranslation()
  const [selectedKey, setSelectedKey] = useState<string>('1') // 默认选中第一个菜单项
  const userData = useStore(state => state.userData)

  const items: MenuItem[] = [
    getItem(`${t('aboutMe.menu_overview')}`, '1'),
    getItem(`${t('aboutMe.menu_property_tokens')}`, '2'),
    getItem(`${t('aboutMe.menu_earnings')}`, '3'),
    getItem(`${t('aboutMe.menu_history')}`, '4'),
    getItem(`${t('aboutMe.menu_security')}`, '5')
  ]

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    setSelectedKey(e.key)
  }

  useEffect(() => {
    // 这里可以添加一些逻辑，比如根据 selectedKey 获取数据
  }, [selectedKey])

  const renderContent = () => {
    switch (selectedKey) {
      case '1':
        return <Overview />
      case '2':
        return <PropertyTokens />
      case '3':
        return <Earnings />
      case '4':
        return <History />
      case '5':
        return <Security />
      default:
        return <Overview />
    }
  }

  return (
    <Layout className="aboutMe">
      <Sider className="sider bg-[#181a1e]">
        <div className="flex justify-start pb-4 pr-4 pt-4">
          <div className="img-wrap h-16 w-16">
            <img src={`${baseUrl}${userData?.avatar}` || maskGroup} alt="" className="bg-[#797b80]" style={{ width: '100%', height: '100%' }} />
          </div>
          <div className="justify-space-between ml-3 mt-1 flex flex-col">
            <div className="text-[#b5b5b5]">{t('aboutMe.welcome')}</div>
            <div className="mt-2 text-4 font-bold">{userData?.nickname || ''}</div>
          </div>
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={['1']}
          mode="inline"
          items={items}
          className="bg-[#181a1e]"
          onClick={handleMenuClick}
        />
      </Sider>

      <Layout className="page-layout-wrap bg-[#181a1e]">
        <Content>
          {/* <Overview /> */}
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  )
}
