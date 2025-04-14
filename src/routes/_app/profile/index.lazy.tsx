import type { MenuProps } from 'antd'
import { IImage } from '@/components/common/i-image'
import Earnings from '@/components/profile/earnings/earnings'
import History from '@/components/profile/history/history'
import Overview from '@/components/profile/overview/overview'
import PropertyTokens from '@/components/profile/propertyTokens/propertyTokens'
import Security from '@/components/profile/security/security'

import { useUserStore } from '@/stores/user'
import { joinImagePath } from '@/utils/url'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Layout, Menu } from 'antd'
import React from 'react'
import './styles.scss'

export const Route = createLazyFileRoute('/_app/profile/')({
  component: RouteComponent
})

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
  const userData = useUserStore(state => state.userData)

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
          <div className="img-wrap size-16 shrink-0">
            <IImage
              src={joinImagePath(userData?.avatar)}
              alt="avatar"
              className="size-full shrink-0 bg-[#797b80]"
            />
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
