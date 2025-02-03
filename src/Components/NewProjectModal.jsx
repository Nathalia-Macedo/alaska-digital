import { useState } from "react"

const statusOptions = [
  { value: "PAYMENT_CONFIRMED", label: "Pagamento Confirmado" },
  { value: "ONBOARDING", label: "Onboarding" },
  { value: "COPY", label: "Copy" },
  { value: "DESIGN", label: "Design" },
  { value: "DEVELOPMENT", label: "Desenvolvimento" },
  { value: "COMPLETED", label: "Concluído" },
]

function NovoProjetoModal({ isOpen, onClose, onCreateProject }) {
  const [formData, setFormData] = useState({
    clientName: "",
    description: "",
    status: "ONBOARDING",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const ownerId = localStorage.getItem("userId")
    if (!ownerId) {
      setError("ID do usuário não encontrado. Por favor, faça login novamente.")
      setIsLoading(false)
      return
    }

    const now = new Date().toISOString()

    try {
      const response = await fetch("https://alaskapi.onrender.com/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Adicione o token de autenticação se necessário
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          ownerId: ownerId,
          createdAt: now,
          updatedAt: now,
        }),
      })

      if (!response.ok) {
        throw new Error("Falha ao criar projeto")
      }

      const data = await response.json()
      onCreateProject(data)
      onClose()
    } catch (error) {
      console.error("Erro ao criar projeto:", error)
      setError("Ocorreu um erro ao criar o projeto. Por favor, tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg shadow-xl p-8 m-4 max-w-xl w-full">
        <h2 className="text-2xl font-bold mb-4">Criar Novo Projeto</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Cliente
            </label>
            <input
              type="text"
              id="clientName"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-sky-600 border border-transparent rounded-md shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center">
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
                  Criando...
                </span>
              ) : (
                "Criar Projeto"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NovoProjetoModal

