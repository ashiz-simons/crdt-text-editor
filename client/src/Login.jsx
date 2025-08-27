import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !roomId.trim()) return;
    navigate(`/editor/${roomId}?username=${encodeURIComponent(username)}`);
  };

  const createNewRoom = () => {
    const newRoomId = crypto.randomUUID();
    if (!username.trim()) return;
    navigate(`/editor/${newRoomId}?username=${encodeURIComponent(username)}`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="login-card w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          📝 Join a Collaboration Room
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your name"
              className="login-input w-full"
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Room ID
            </label>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter room ID"
              className="login-input w-full"
            />
          </div>
          <div className="login-actions">
            <button type="submit" className="login-button w-full">
              Enter Room
            </button>
            <button
              type="button"
              onClick={createNewRoom}
              className="login-button w-full"
            >
              Create New Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
