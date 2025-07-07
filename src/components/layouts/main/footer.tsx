import { Link } from '@tanstack/react-router'

export default function MainFooter() {
  const { t } = useTranslation()
  return (
    <footer className="mt-32 bg-[#1e2024] px-8 py-14">
      <div className="flex items-center gap-y-12 md:grid-cols-4">
        <div className="flex items-center gap-11 pr-132px max-xl:pr-82px">
          <img className="w-171px max-xl:w-121px" src="/src/assets/images/logo.png" alt="" />
          <div className="mt-4 fyc gap-2 text-text">
            <div className="i-bxl-telegram size-12 max-xl:size-8"></div>
            <div className="i-ri-linkedin-fill size-12 max-xl:size-8"></div>
            <div className="i-mdi-twitter size-12 max-xl:size-8"></div>
          </div>
        </div>
        <div className="grid grid-cols-3 flex-1 [&_li]:w-fit [&_li]:cursor-pointer [&_li:hover]:text-[#e7bb41]">
          <div>
            <div className="text-4.5 text-[#898989]">{t('footer.about')}</div>
            <ul className="mt-4 text-4 text-[#b5b5b5] space-y-2">
              <li>{t('footer.company')}</li>
              <li>{t('footer.careers')}</li>
              <li><Link to="/article">{t('footer.news')}</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-4.5 text-[#898989]">{t('footer.products')}</div>
            <ul className="mt-4 text-4 text-[#b5b5b5] space-y-2">
              <li>{t('footer.properties')}</li>
              <li>{t('footer.token_market')}</li>
              <li>{t('footer.deFi_services')}</li>
            </ul>
          </div>

          <div>
            <div className="text-4.5 text-[#898989]">{t('footer.support')}</div>
            <ul className="mt-4 text-4 text-[#b5b5b5] space-y-2">
              <li><Link to="/help">{t('footer.help_center')}</Link></li>
              <li>{t('footer.contact_us')}</li>
              <li>{t('footer.legal')}</li>
            </ul>
          </div>

        </div>
      </div>
      <div className="mt-16 fcc text-center text-5 text-[#d2d2d2]">
        <div>
          © 2024 RealToken.
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
