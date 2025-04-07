export default function MainFooter() {
  const { t } = useTranslation()
  return (
    <footer className="mt-32 bg-[#1e2024] px-8 py-14">
      <div className="grid grid-cols-2 gap-y-12 md:grid-cols-4">
        <div>
          <div className="text-4.5 text-[#898989]">{t('footer.about')}</div>
          <ul className="mt-4 text-4 text-[#b5b5b5] space-y-2">
            <li>{t('footer.company')}</li>
            <li>{t('footer.careers')}</li>
            <li>{t('footer.news')}</li>
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
            <li>{t('footer.help_center')}</li>
            <li>{t('footer.contact_us')}</li>
            <li>{t('footer.legal')}</li>
          </ul>
        </div>

        <div>
          <div className="text-4.5 text-[#898989]">{t('footer.follow_us')}</div>
          <div className="mt-4 fyc gap-2 text-text">
            <div className="i-mdi-twitter size-5"></div>
            <div className="i-mdi-linkedin size-5"></div>
            <div className="i-ic-baseline-telegram size-5"></div>
          </div>
        </div>
      </div>

      <div className="mt-16 fbc text-5 text-[#d2d2d2]">
        <div>© 2024 RealToken. All rights reserved.</div>

        <div className="fyc gap-6">
          <div>Privacy Policy</div>
          <div>Terms of Service</div>
        </div>
      </div>
    </footer>
  )
}
