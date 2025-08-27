import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login"; 
import Editor from "./editor/Editor";
import UserCounter from "./editor/UserCounter";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Page */}
        <Route path="/" element={<Login />} />

        {/* Editor Page with roomId */}
        <Route
          path="/editor/:roomId"
          element={
            <div className="app-container">
              <h1>📝 Real-Time Collaborative Editor</h1>
              <UserCounter />
              <Editor />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
