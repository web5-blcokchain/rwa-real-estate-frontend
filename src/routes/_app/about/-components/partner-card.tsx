export const PartnerCard: FC<{
  picture: string
}> = ({
  picture
}) => {
  return (
    <div className="fcc rounded-xl bg-[#22252c] p-8">
      <img src={picture} />
    </div>
  )
}
