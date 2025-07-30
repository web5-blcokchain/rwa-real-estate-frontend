import type { SwiperRef } from 'swiper/react'
import type { AutoplayOptions } from 'swiper/types'

import { Autoplay, FreeMode, Navigation, Thumbs } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import './style.scss'
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'

export const ImageSwiper: FC<{
  list: string[]
  autoplay?: boolean | AutoplayOptions | undefined
  className?: string
  swiperClass?: string
  navigation?: boolean
}> = ({
  list,
  autoplay,
  className,
  swiperClass,
  navigation
}) => {
  const [thumbsSwiper, _setThumbsSwiper] = useState<string | null>(null)
  const swiperRef = useRef<SwiperRef>(null)
  return (
    <div
      className={cn(className, 'swiper-content')}
      style={{
        '--swiper-navigation-color': '#e7bb41',
        '--swiper-pagination-color': '#e7bb41',
        '--swiper-navigation-size': '36px'
      } as Record<string, string>}
    >
      { navigation && list.length >= 2 && (
        <div
          className="swiper-button-next"
          onClick={(e) => {
            e.stopPropagation()
            swiperRef.current?.swiper.slideNext()
          }}
        >
        </div>
      )}
      { navigation && list.length >= 2 && (
        <div
          className="swiper-button-prev"
          onClick={(e) => {
            e.stopPropagation()
            swiperRef.current?.swiper.slidePrev()
          }}
        >
        </div>
      )}
      <Swiper
        ref={swiperRef}
        spaceBetween={10}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
          enabled: navigation && list.length >= 2
        }}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, (navigation && list.length >= 2 ? Navigation : undefined), Thumbs, (autoplay ? Autoplay : undefined) as any].filter(res => res)}
        className={cn('swiper-viewer !h-full', swiperClass)}
        autoplay={autoplay || {
          delay: 5000,
          disableOnInteraction: false
        }}
        loop
      >
        <div className="swiper-button-next"></div>

        {
          list.map(url => (
            <SwiperSlide key={url}>
              <img src={url} className="w-full max-h-128!" />
            </SwiperSlide>
          ))
        }
        <div className="swiper-button-prev"></div>
      </Swiper>
      {/* <Swiper
        onSwiper={setThumbsSwiper as () => void}
        spaceBetween={10}
        slidesPerView={6}
        freeMode
        watchSlidesProgress
        modules={[FreeMode, Navigation, Thumbs]}
        className="swiper-pagination"
      >
        {
          list.map(url => (
            <SwiperSlide key={url}>
              <img src={url} className="object-cover size-24!" />
            </SwiperSlide>
          ))
        }
      </Swiper> */}
    </div>
  )
}
