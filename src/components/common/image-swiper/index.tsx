import { FreeMode, Navigation, Thumbs } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import './style.scss'
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'

export const ImageSwiper: FC<{
  list: string[]
}> = ({
  list
}) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<string | null>(null)

  return (
    <div>
      <Swiper
        style={{
          '--swiper-navigation-color': '#fff',
          '--swiper-pagination-color': '#fff'
        } as Record<string, string>}
        spaceBetween={10}
        navigation
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="swiper-viewer"
      >
        {
          list.map(url => (
            <SwiperSlide key={url}>
              <img src={url} />
            </SwiperSlide>
          ))
        }
      </Swiper>
      <Swiper
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
              <img src={url} />
            </SwiperSlide>
          ))
        }
      </Swiper>
    </div>
  )
}
