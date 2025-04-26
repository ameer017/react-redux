import { Route, Routes } from "react-router-dom";
import Register from "./Components/Register";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login-user" element={<Login />} />
        <Route path="/profile" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
