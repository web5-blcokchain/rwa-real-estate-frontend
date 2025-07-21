import dayjs from 'dayjs'

export const documentType = ['home.document.blog', 'home.document.resource', 'home.document.community', 'home.document.doc']
function Document({ data, index }: { data: any, index: number }) {
  const { t } = useTranslation()
  return (
    <div className="cursor-pointer">
      <img className="w-full" src={data.img} alt="" />
      <div className="py-22px max-lg:py-8px max-md:py-2px max-xl:py-14px">
        <div className="text-30px font-bold leading-10 max-lg:text-16px max-md:text-2 max-xl:text-22px max-lg:leading-7 max-md:leading-4 max-xl:leading-8">
          {t(data.title)}
        </div>
        <div className="text-20px text-#A7A9AD leading-[30px] max-lg:text-12px max-md:text-6px max-xl:text-16px max-lg:leading-5 max-md:leading-9px max-xl:leading-6">
          {t(data.content)}
        </div>
      </div>
      <div className="fyc gap-20px px-10px max-lg:gap-4 max-xl:gap-8 max-lg:px-2px max-xl:px-6px max-md:text-5px max-md:leading-30px">
        <span key={documentType[index]}>{t(documentType[index])}</span>
        <span>{dayjs(data.date).format(`M${t('common.month')}D，YYYY`)}</span>
      </div>
    </div>
  )
}

export default Document
