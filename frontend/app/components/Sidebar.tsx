type SidebarProps = {
  username: string;
  currentChannel: string;
  setCurrentChannel: (channel: string) => void;
};

export default function Sidebar({ username, currentChannel, setCurrentChannel }: SidebarProps) {
  return (
    <div className="w-64 bg-[#1e325c] text-white flex flex-col">
      <div className="p-4 font-bold text-xl border-b border-blue-900 shadow-sm">Mattermost Clone</div>
      <div className="flex-1 p-4 space-y-2">
        <div className="text-gray-400 text-xs font-semibold uppercase mb-2">Channels</div>
        {/* チャンネル切り替えボタン */}
        {["town-square", "off-topic", "random"].map((ch) => (
          <div
            key={ch}
            onClick={() => setCurrentChannel(ch)}
            className={`p-2 rounded cursor-pointer transition ${currentChannel === ch ? "bg-blue-700 font-bold" : "hover:bg-white/10"
              }`}
          >
            # {ch}
          </div>
        ))}
      </div>
      <div className="p-4 bg-black/20 text-sm italic">User: {username}</div>
    </div>
  )
}
