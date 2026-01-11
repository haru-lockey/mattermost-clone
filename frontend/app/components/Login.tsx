type LoginProps = {
  username: string;
  setUsername: (name: string) => void;
  onLogin: () => void;
};

export default function Login({ username, setUsername, onLogin }: LoginProps) {
  return (
    <div className="flex h-screen items-center justify-center bg-[#1e325c]">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96 text-center text-black">
        <h1 className="text-2xl font-bold mb-6">Mattermostへようこそ</h1>
        <input
          className="w-full border p-3 rounded mb-4"
          placeholder="ユーザー名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={() => username && onLogin()} className="w-full bg-blue-600 text-white p-3 rounded font-bold">参加する</button>
      </div>
    </div>
  );
}
