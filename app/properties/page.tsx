export default function Properties() {
  return (
    <div className="p-8">
      <div className="text-8 font-medium">
        US Real Estate Assets
      </div>

      <div className="mt-4 text-4 text-[#898989]">
        Premium New York real estate investment opportunities through blockchain technology
      </div>

      <div className="mt-8">
        <div className="fyc flex-inline b b-white rounded-xl b-solid p-4 space-x-4">
          <div className="i-iconamoon-search size-5 bg-[#b5b5b5]"></div>
          <input
            type="text"
            placeholder="Search by New York location, property type"
            className="w-128 b-none bg-transparent outline-none"
          />
        </div>
      </div>
    </div>
  )
}
