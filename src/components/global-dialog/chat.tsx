export const Chat: FC = () => {
  return (
    <div className="h-full fccc px-2">
      <div className="h-full w-full flex items-start gap-2">
        <div className="rounded-full bg-[#e2e3e8] p-2">
          <div className="i-material-symbols-person size-5 bg-[#626774]"></div>
        </div>
        <div className="space-y-1">
          <div className="rounded-md bg-[#acacac] p-2 text-white">Hello! How can I assist you today?</div>
          <div className="text-3 text-[#f9f9f9]">11:35 AM</div>
        </div>
      </div>

      <div className="w-full">
        <div className="my-2 fyc gap-2 rounded-md bg-[#acacac] px-2 py-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="h-8 w-full bg-transparent text-white outline-none placeholder-gray-2"
          />
          <button className="bg-transparent">
            <div className="i-lsicon-send-filled size-6 bg-primary-2 clickable"></div>
          </button>
        </div>
      </div>
    </div>
  )
}
