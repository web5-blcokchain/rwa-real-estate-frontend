import type { MenuProps } from 'antd'
import { IImage } from '@/components/common/i-image'
import { Earnings } from '@/components/profile/earnings'
import { ProfileEdit } from '@/components/profile/edit'
import History from '@/components/profile/history'
import Overview from '@/components/profile/overview'
import PropertyTokens from '@/components/profile/propertyTokens'
import Recording from '@/components/profile/recording'
import { TransactionStatus } from '@/components/profile/transaction-status'
import { ProfileTab } from '@/enums/profile'
import { useProfileStore } from '@/stores/profile'
import { useUserStore } from '@/stores/user'
import { joinImagePath } from '@/utils/url'
import { shortAddress } from '@/utils/wallet'
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
  const userData = useUserStore(state => state.userData)
  const { selectedTab, setSelectedTab } = useProfileStore()

  const items: MenuItem[] = [
    getItem(`${t('aboutMe.menu_overview')}`, ProfileTab.Overview),
    getItem(`${t('aboutMe.menu_edit')}`, ProfileTab.Edit),
    getItem(`${t('aboutMe.menu_property_tokens')}`, ProfileTab.PropertyTokens),
    getItem(`${t('aboutMe.menu_earnings')}`, ProfileTab.Earnings),
    getItem(`${t('aboutMe.menu_history')}`, ProfileTab.History),
    getItem(`${t('aboutMe.menu_recording')}`, ProfileTab.Recording),
    getItem(`${t('aboutMe.menu_transaction_status')}`, ProfileTab.TransactionStatus)
  ]

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    setSelectedTab(e.key as ProfileTab)
  }

  useEffect(() => {
    // 这里可以添加一些逻辑，比如根据 selectedTab 获取数据
  }, [selectedTab])

  const renderContent = () => {
    switch (selectedTab) {
      case ProfileTab.Overview:
        return <Overview />
      case ProfileTab.Edit:
        return <ProfileEdit />
      case ProfileTab.PropertyTokens:
        return <PropertyTokens />
      case ProfileTab.Earnings:
        return <Earnings />
      case ProfileTab.History:
        return <History />
      case ProfileTab.Recording:
        return <Recording />
      case ProfileTab.TransactionStatus:
        return <TransactionStatus />
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
            <div className="mt-2 text-4 font-bold">{shortAddress(_get(userData, 'wallet_address', ''))}</div>
          </div>
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={[selectedTab]}
          selectedKeys={[selectedTab]}
          mode="inline"
          items={items}
          className="bg-[#181a1e]"
          onClick={handleMenuClick}
        />
      </Sider>

      <Layout className="page-layout-wrap bg-[#181a1e]">
        <Content>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  )
}
