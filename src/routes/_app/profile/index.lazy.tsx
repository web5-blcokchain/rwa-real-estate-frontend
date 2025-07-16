import type { MenuProps } from 'antd'
import { IImage } from '@/components/common/i-image'
import { AssetsSummary } from '@/components/profile/assetsSummary'
import { DistributionRecord } from '@/components/profile/distributionRecord'
import { Earnings } from '@/components/profile/earnings'
import { ProfileEdit } from '@/components/profile/edit'
import History from '@/components/profile/history'
import { MyAssets } from '@/components/profile/myAssets'
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
    getItem(`${t('aboutMe.menu_transaction_status')}`, ProfileTab.TransactionStatus),
    getItem(`${t('aboutMe.menu_assets')}`, ProfileTab.Assets),
    getItem(`${t('aboutMe.menu_assets_summary')}`, ProfileTab.AssetsSummary),
    getItem(`${t('aboutMe.menu_distribution_record')}`, ProfileTab.DistributionRecord)
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
      case ProfileTab.Assets:
        return <MyAssets />
      case ProfileTab.AssetsSummary:
        return <AssetsSummary />
      case ProfileTab.DistributionRecord:
        return <DistributionRecord />
    }
  }

  return (
    <Layout className="aboutMe max-lg:w-full max-lg:flex max-lg:!flex-col">
      <Sider className="sider w-fit bg-[#191a1f] max-lg:!max-w-full max-lg:!w-full" width={256}>
        <div className="flex justify-start px-4 pb-6 pt-34px">
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
          className="bg-[#191a1f]"
          onClick={handleMenuClick}
        />
      </Sider>

      <Layout className="page-layout-wrap bg-[#191a1f] max-lg:!w-full">
        <Content>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  )
}
