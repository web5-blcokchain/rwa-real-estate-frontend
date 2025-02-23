interface Props {
  picture: string
  title: string
  location: string
  price: number
  tokenPrice: number
  apy: number
}

const FeatureCard: FC<Props> = ({ title, picture, location, price, tokenPrice, apy }) => {
  return (
    <div className="rounded-xl bg-background-secondary">
      <div>
        <img src={picture} />
      </div>
      <div className="px-6 py-2 space-y-2">
        <div className="text-5">{title}</div>
        <div className="fbc text-4">
          <div className="text-[#b5b5b5]">{location}</div>
          <div>
            ¥
            {price}
            M
          </div>
        </div>

        <div className="fbc">
          <div className="text-3.5 text-[#b5b5b5]">
            {`Token Price: ${tokenPrice}`}
          </div>
          <div className="text-4">
            {`APY: ${apy}%`}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeatureCard
