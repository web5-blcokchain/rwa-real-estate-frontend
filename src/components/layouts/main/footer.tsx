import logo from '@/assets/images/logo.png'
import { Link } from '@tanstack/react-router'

export default function MainFooter() {
  const { t } = useTranslation()
  return (
    <footer className="header-padding mt-32 bg-[#1e2024] py-14 max-lg:mt-6 max-lg:py-7">
      <div className="flex items-center gap-y-12 md:grid-cols-4 max-md:flex-col">
        <div className="flex items-center gap-11 pr-132px max-md:w-full max-md:pr-0 max-xl:pr-82px">
          <img className="h-18 max-md:h-16" src={logo} alt="" />
          <div className="mt-4 fyc gap-4 text-text max-lg:gap-2">
            <div className="i-bxl-telegram size-10 max-lg:size-6 max-xl:size-8"></div>
            <div className="i-ri-linkedin-fill size-10 max-lg:size-6 max-xl:size-8"></div>
            <div className="i-ri:twitter-x-line size-10 max-lg:size-6 max-xl:size-8"></div>
          </div>
        </div>
        <div className="grid grid-cols-3 flex-1 [&_li]:w-fit max-md:w-full [&_li]:cursor-pointer [&_li:hover]:text-[#e7bb41]">
          <div>
            <div className="text-4.5 text-[#898989] max-lg:text-4">{t('footer.about')}</div>
            <ul className="mt-4 text-4 text-[#b5b5b5] space-y-2 max-lg:text-3.5">
              <li>{t('footer.company')}</li>
              <li>{t('footer.careers')}</li>
              <li><Link to="/news">{t('footer.news')}</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-4.5 text-[#898989] max-lg:text-4">{t('footer.products')}</div>
            <ul className="mt-4 text-4 text-[#b5b5b5] space-y-2 max-lg:text-3.5">
              <li>{t('footer.properties')}</li>
              <li>{t('footer.token_market')}</li>
              <li>{t('footer.deFi_services')}</li>
            </ul>
          </div>

          <div>
            <div className="text-4.5 text-[#898989] max-lg:text-4">{t('footer.support')}</div>
            <ul className="mt-4 text-4 text-[#b5b5b5] space-y-2 max-lg:text-3.5">
              <li><Link to="/help">{t('footer.help_center')}</Link></li>
              <li>{t('footer.contact_us')}</li>
              <li>{t('footer.legal')}</li>
            </ul>
          </div>

        </div>
      </div>
      <div className="mt-16 fcc text-center text-5 text-[#d2d2d2] max-lg:text-3.5">
        <div>
          © 2025 USD able.
          {t('footer.reserved')}
        </div>

        {/* <div className="fyc gap-6">
          <div>Privacy Policy</div>
          <div>Terms of Service</div>
        </div> */}
      </div>
    </footer>
  )
}
