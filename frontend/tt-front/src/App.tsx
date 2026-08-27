import "./App.css";
import { Route, Routes } from "react-router-dom";

import Login from "./pages/login/login";
import Projects from "./pages/projects/projects";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/projects" element={<Projects />} />
    </Routes>
  );
}

export default App;