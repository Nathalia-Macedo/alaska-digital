import { BrowserRouter, Routes, Route } from "react-router-dom"
import TelaLogin from "../Pages/Login"
import TelaCadastro from "../Pages/Cadastro"
import Dashboard from "../Pages/Dashboard"
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TelaLogin />} />
        <Route path="/cadastro" element={<TelaCadastro />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

