import type { MenuProps } from 'antd'
import { IImage } from '@/components/common/i-image'
import Appeal from '@/components/profile/appeal'
import { AssetsSummary } from '@/components/profile/assetsSummary'
import DefaultWarning from '@/components/profile/defaultWarning'
import WarningInfo from '@/components/profile/defaultWarning/info'
import WarningRedemptionInfo from '@/components/profile/defaultWarning/redemption'
import { DistributionRecord } from '@/components/profile/distributionRecord'
import DividendStatistics from '@/components/profile/dividendStatistics'
import { Earnings } from '@/components/profile/earnings'
import { ProfileEdit } from '@/components/profile/edit'
import History from '@/components/profile/history'
import Message from '@/components/profile/message'
import { MyAssets } from '@/components/profile/myAssets'
import Overview from '@/components/profile/overview'
import PropertyTokens from '@/components/profile/propertyTokens'
import Recording from '@/components/profile/recording'
import RedemptionList from '@/components/profile/redemptionList'
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
    getItem(`${t('aboutMe.menu_message')}`, ProfileTab.Message),
    getItem(`${t('aboutMe.menu_property_tokens')}`, ProfileTab.PropertyTokens),
    // getItem(`${t('aboutMe.menu_earnings')}`, ProfileTab.Earnings),
    // getItem(`${t('aboutMe.menu_history')}`, ProfileTab.History),
    // getItem(`${t('aboutMe.menu_recording')}`, ProfileTab.Recording),
    // getItem(`${t('aboutMe.menu_transaction_status')}`, ProfileTab.TransactionStatus),
    getItem(`${t('aboutMe.menu_assets_summary')}`, ProfileTab.Assets),
    // getItem(`${t('aboutMe.menu_assets_summary')}`, ProfileTab.AssetsSummary),
    getItem(`${t('aboutMe.menu_distribution_record')}`, ProfileTab.DistributionRecord),
    getItem(`${t('aboutMe.menu_dividend_statistics')}`, ProfileTab.DividendStatistics),
    getItem(`${t('aboutMe.menu_appeal')}`, ProfileTab.Appeal),
    getItem(`${t('aboutMe.menu_default_warning')}`, ProfileTab.DefaultWarning),
    getItem(`${t('aboutMe.menu_redemption_list')}`, ProfileTab.RedemptionList)
  ]

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    setSelectedTab(e.key as ProfileTab)
    setSecondaryMenu(undefined)
  }

  useEffect(() => {
    // 这里可以添加一些逻辑，比如根据 selectedTab 获取数据
  }, [selectedTab])

  const [secondaryMenu, setSecondaryMenu] = useState<ProfileTab>()
  const [secondaryMenuProps, setSecondaryMenuProps] = useState<any>()

  const renderContent = () => {
    if (!secondaryMenu) {
      switch (selectedTab) {
        case ProfileTab.Overview:
          return <Overview /> // 概述
        case ProfileTab.Edit:
          return <ProfileEdit /> // 编辑设置
        case ProfileTab.PropertyTokens:
          return <PropertyTokens /> // 房产列表
        case ProfileTab.Earnings:
          return <Earnings />
        case ProfileTab.History:
          return <History />
        case ProfileTab.Recording:
          return <Recording />
        case ProfileTab.TransactionStatus:
          return <TransactionStatus />
        case ProfileTab.Assets:
          return <MyAssets /> // 购买记录
        case ProfileTab.AssetsSummary:
          return <AssetsSummary />
        case ProfileTab.DistributionRecord:
          return <DistributionRecord /> // 代币发放记录
        case ProfileTab.Message:
          return <Message /> // 消息中心
        case ProfileTab.DividendStatistics:
          return <DividendStatistics /> // 分红统计
        case ProfileTab.Appeal:
          return <Appeal /> // 申诉信息
        case ProfileTab.DefaultWarning:
          return <DefaultWarning setSecondaryMenu={setSecondaryMenu} setSecondaryMenuProps={setSecondaryMenuProps} /> // 违约警告
        case ProfileTab.RedemptionList:
          return <RedemptionList /> // 赎回列表
      }
    }
    else {
      switch (secondaryMenu) {
        case ProfileTab.WarningInfo:
          return <WarningInfo secondaryMenuProps={secondaryMenuProps} /> // 违约警告详情
        case ProfileTab.WarningRedemptionInfo:
          return <WarningRedemptionInfo secondaryMenuProps={secondaryMenuProps} /> // 赎回详情
      }
    }
    setTimeout(() => {
      document.querySelector('.app-content')?.scrollTo(0, 0)
      console.log(123)
    }, 200)
  }

  useEffect(() => {
    document.querySelector('.app-content')?.scrollTo(0, 0)
  }, [secondaryMenu, selectedTab])

  return (
    <Layout className="aboutMe max-lg:w-full max-lg:flex max-lg:!flex-col">
      <Sider className="sider w-fit bg-[#191a1f] max-lg:!max-w-full max-lg:!w-full" width={256}>
        <div>
          <div className="flex justify-start px-4 pb-6 pt-34px">
            <div className="img-wrap size-16 shrink-0">
              {userData?.avatar
                ? (
                    <IImage
                      src={joinImagePath(userData?.avatar)}
                      alt="avatar"
                      className="size-full shrink-0 bg-[#797b80]"
                    />
                  )
                : (
                    <div className="size-full rounded-full bg-#252932 p-2">
                      <div className="i-material-symbols-person h-full w-full text-[#9e9e9e]"></div>
                    </div>
                  )}
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
        </div>
      </Sider>

      <Layout className="page-layout-wrap bg-[#191a1f] max-lg:!w-full">
        <Content>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  )
}
