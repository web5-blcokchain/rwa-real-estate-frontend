import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_app/guidance/')({
  component: RouteComponent
})

function RouteComponent() {
  const typeList = ['功能指引', 'KYC&安全设置', '常见问题', '视频教学']
  const [selectType, setSelectType] = useState(0)

  return (
    <div className="flex gap-100px px-120px py-30px max-md:flex-col max-lg:gap-40px max-md:gap-8 max-lg:px-24px max-lg:py-16px max-md:px-2 max-md:py-2">
      <div>
        <div className="fyc gap-4 py-5 text-28px font-500 max-lg:py-3 max-md:py-2 max-lg:text-20px max-md:text-16px">
          <img className="size-26px max-lg:size-18px max-md:size-12px" src="/src/assets/icons/blocks-and-arrows.svg" alt="" />
          <div>新手指导</div>
        </div>
        <div className="w-254px flex flex-col gap-4 text-center text-26px max-lg:w-180px max-md:w-full max-lg:gap-2 max-md:gap-1 max-lg:text-18px max-md:text-14px">
          {
            typeList.map((res, index) => (
              <div onClick={() => setSelectType(index)} key={index} className={cn(selectType === index ? 'b-l-#F0B90B bg-#252932' : 'b-#191a1f', 'transition-all-300  cursor-pointer py-22px b-l-6 max-lg:py-12px max-lg:b-l-4 max-md:py-6px max-md:b-l-2 ')}>
                {res}
              </div>
            ))
          }
        </div>
      </div>
      <div className="flex-1 max-md:mt-6">
        {
          (() => {
            switch (selectType) {
              case 0: return (
                <div>
                  <div className="b-b-1 b-b-#252932 pb-18px pt-46px text-46px max-lg:pt-20px max-md:pt-8px max-lg:text-28px max-md:text-18px">功能指引</div>
                  <div className="flex flex-col gap-5 pt-9 text-6 max-lg:gap-2 max-md:gap-1 max-lg:pt-4 max-md:pt-2 max-lg:text-4 max-md:text-3">
                    <p>注册后，您将收到一封电子邮件，其中包含一个限时链接，用于验证您的帐户。这将带您进入您的帐户，您可以在其中验证您的电话号码。如果您在通过电子邮件或电话接收验证码时遇到任何问题，请通过ort@propy.com与我们联系。有时电子邮件设置会将验证电子邮件过滤到“促销"文件夹或垃圾邮件中，因此请检查这些文件夹。</p>
                    <p>如果您在接收验证码以验证您的电话号码时遇到问题，请通过 ort@propy.com 与我们联系。</p>
                  </div>
                </div>
              )
              case 1: return <div>KYC&安全设置</div>
              case 2: return <div>常见问题</div>
              case 3: return <div>视频教学</div>
            }
          })()
        }
      </div>
    </div>
  )
}
