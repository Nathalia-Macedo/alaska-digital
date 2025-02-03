import { useState } from "react"
import { useNavigate } from "react-router-dom"

function TelaCadastro() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    usuario: "",
    senha: "",
  })
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState("")
  const [mostrarSenha, setMostrarSenha] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCarregando(true)
    setErro("")

    try {
      const response = await fetch("https://alaskapi.onrender.com/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.usuario,
          password: formData.senha,
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao cadastrar")
      }

      const data = await response.json()
      console.log("Cadastro bem-sucedido:", data)
      navigate("/") // Redireciona para o login após cadastro
    } catch (err) {
      setErro("Erro ao realizar cadastro. Tente novamente.")
    } finally {
      setCarregando(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-sky-100 to-white px-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-lg">
        <div className="flex flex-col items-center">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alaska.jpg-adbFDCVdCXlPJPJNIuiXFO9goEuSl6.jpeg"
            alt="Logo Alaska"
            className="w-32 h-32 object-contain mb-4"
          />
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">Criar conta</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Preencha os dados para se cadastrar</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="usuario" className="block text-sm font-medium text-gray-700">
                Usuário
              </label>
              <div className="mt-1">
                <input
                  id="usuario"
                  name="usuario"
                  type="text"
                  required
                  className="block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-sky-500 focus:outline-none focus:ring-sky-500 transition-colors duration-200 sm:text-sm"
                  placeholder="Digite seu usuário"
                  value={formData.usuario}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="mt-1 relative">
                <input
                  id="senha"
                  name="senha"
                  type={mostrarSenha ? "text" : "password"}
                  required
                  className="block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-sky-500 focus:outline-none focus:ring-sky-500 transition-colors duration-200 sm:text-sm pr-10"
                  placeholder="Digite sua senha"
                  value={formData.senha}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                >
                  {mostrarSenha ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 text-gray-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 text-gray-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {erro && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="text-sm text-red-700">{erro}</div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={carregando}
              className="group relative flex w-full justify-center rounded-lg border border-transparent bg-sky-500 py-2 px-4 text-sm font-medium text-white hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {carregando ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Cadastrando...
                </div>
              ) : (
                "Cadastrar"
              )}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <p className="text-center text-sm text-gray-600">
            Já tem uma conta?{" "}
            <a href="/" className="font-medium text-sky-600 hover:text-sky-500">
              Faça login
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default TelaCadastro

