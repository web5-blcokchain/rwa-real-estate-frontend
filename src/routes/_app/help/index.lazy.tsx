import { createLazyFileRoute } from '@tanstack/react-router'
import { Input } from 'antd'
import './index.scss'
import apply from '/src/assets/icons/apply.svg'
import editEmail from '/src/assets/icons/edit-email.svg'
import editFundsPwd from '/src/assets/icons/edit-funds-pwd.svg'
import editGoogle from '/src/assets/icons/edit-google.svg'
import editPhone from '/src/assets/icons/edit-phone.svg'
import editPwd from '/src/assets/icons/edit-pwd.svg'

export const Route = createLazyFileRoute('/_app/help/')({
  component: RouteComponent
})

function RouteComponent() {
  const { t } = useTranslation()
  const helpList = [
    { icon: editPwd, content: 'help-content.resetLoginPassword', url: '' },
    { icon: editFundsPwd, content: 'help-content.changeFundPassword', url: '' },
    { icon: editPhone, content: 'help-content.changePhoneNumber', url: '' },
    { icon: editEmail, content: 'help-content.bindEmail', url: '' },
    { icon: editGoogle, content: 'help-content.changeGoogleAuthenticator', url: '' },
    { icon: apply, content: 'help-content.recoveryRequest', url: '' }
  ]

  return (
    <div className="px-120px max-lg:px-20px max-xl:px-60px">
      <div className="mt-111px fccc max-lg:mt-24px max-xl:mt-60px">
        <div className="mb-6 text-40px font-bold max-lg:mb-2 max-xl:mb-4 max-lg:text-24px max-xl:text-32px">{t('help-content.title')}</div>
        <Input className="help-input h-52px bg-white text-5 max-lg:h-32px max-xl:h-44px max-lg:text-2 max-xl:text-3 !text-#B5B5B5" size="large" placeholder={t('help-content.placeholder')} prefix={<div className="i-bitcoin-icons:search-filled bg-#B5B5B5" />} />
      </div>
      <div className="mt-217px max-lg:mt-40px max-xl:mt-100px">
        <div className="pb-58px text-40px font-bold max-lg:pb-2 max-xl:pb-4 max-lg:text-32px max-xl:text-24px">{t('help-content.selfService')}</div>
        <div className="grid grid-cols-4 gap-10 max-lg:grid-cols-1 max-xl:grid-cols-2 max-lg:gap-3 max-xl:gap-6">
          {
            helpList.map(res => (
              <div key={res.content} className="fccc cursor-pointer gap-18px bg-#252932 py-28px text-center max-lg:gap-4 max-xl:gap-8 max-lg:py-8px max-xl:py-14px">
                <img className="h-65px fccc max-lg:h-24px max-xl:h-40px" src={res.icon} alt="" />
                <div className="text-22px max-lg:text-16px max-xl:text-18px max-lg:leading-5 max-xl:leading-6">{t(res.content)}</div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}
