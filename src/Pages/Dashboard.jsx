import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Edit2, Trash2, Search, Calendar, Filter } from "lucide-react"
import NovoProjetoModal from "../Components/NewProjectModal"
import ConfirmDeleteModal from "../Components/ConfirmDeleteModal"
import EditProjectModal from "../Components/EditProjectModal"
import Navbar from "../Components/NavBar"
const statusColors = {
  PAYMENT_CONFIRMED: "bg-green-500 text-white",
  ONBOARDING: "bg-blue-500 text-white",
  COPY: "bg-purple-500 text-white",
  DESIGN: "bg-pink-500 text-white",
  DEVELOPMENT: "bg-orange-500 text-white",
  COMPLETED: "bg-gray-500 text-white",
}

const statusNames = {
  PAYMENT_CONFIRMED: "Pagamento Confirmado",
  ONBOARDING: "Onboarding",
  COPY: "Copy",
  DESIGN: "Design",
  DEVELOPMENT: "Desenvolvimento",
  COMPLETED: "Concluído",
}

function Dashboard() {
  const [projects, setProjects] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filters, setFilters] = useState({
    status: "",
    clientName: "",
    startDate: "",
    endDate: "",
  })
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [projectToEdit, setProjectToEdit] = useState(null)
  const [username, setUsername] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const storedUsername = localStorage.getItem("username")
    if (storedUsername) {
      setUsername(storedUsername)
    } else {
      // Redirect to login if username is not found
      navigate("/login")
    }
    fetchProjects()
  }, [navigate])

  useEffect(() => {
    applyFilters()
  }, [projects, filters]) //Corrected dependency array

  const fetchProjects = async () => {
    try {
      const response = await fetch("https://alaskapi.onrender.com/projects")
      if (!response.ok) throw new Error("Falha ao carregar projetos")
      const data = await response.json()
      setProjects(data)
      setFilteredProjects(data)
    } catch (err) {
      setError("Erro ao carregar projetos. Tente novamente mais tarde.")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProject = (newProject) => {
    const formattedProject = {
      ...newProject,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setProjects((prevProjects) => [...prevProjects, formattedProject])
  }

  const formatDate = (dateString) => {
    if (!dateString || dateString === "invalidDate") {
      return "Data não disponível"
    }
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const applyFilters = () => {
    let filtered = [...projects]

    if (filters.status) {
      filtered = filtered.filter((project) => project.status === filters.status)
    }

    if (filters.clientName) {
      filtered = filtered.filter((project) =>
        project.clientName.toLowerCase().includes(filters.clientName.toLowerCase()),
      )
    }

    if (filters.startDate) {
      filtered = filtered.filter((project) => new Date(project.createdAt) >= new Date(filters.startDate))
    }

    if (filters.endDate) {
      filtered = filtered.filter((project) => new Date(project.createdAt) <= new Date(filters.endDate))
    }

    setFilteredProjects(filtered)
  }

  const StatusBadge = ({ status }) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}>
      {statusNames[status]}
    </span>
  )

  const handleDeleteClick = (project) => {
    setProjectToDelete(project)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async (projectId) => {
    try {
      const response = await fetch(`https://alaskapi.onrender.com/projects/${projectId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Falha ao excluir o projeto")
      }

      // Remove o projeto da lista
      setProjects(projects.filter((p) => p.id !== projectId))
      setFilteredProjects(filteredProjects.filter((p) => p.id !== projectId))
      setIsDeleteModalOpen(false)
    } catch (error) {
      console.error("Erro ao excluir projeto:", error)
      setError("Ocorreu um erro ao excluir o projeto. Por favor, tente novamente.")
    }
  }

  const handleEditClick = (project) => {
    setProjectToEdit(project)
    setIsEditModalOpen(true)
  }

  const handleEditProject = (updatedProject) => {
    setProjects(projects.map((p) => (p.id === updatedProject.id ? updatedProject : p)))
    setFilteredProjects(filteredProjects.map((p) => (p.id === updatedProject.id ? updatedProject : p)))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar username={username} />
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Projetos</h1>
              <p className="mt-1 text-sm text-gray-500">Gerencie seus projetos</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
            >
              Novo Projeto
            </button>
          </div>

          {/* Status Legend */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h2 className="text-lg font-medium text-gray-700 mb-3">Status dos Projetos</h2>
            <div className="flex flex-wrap gap-3">
              {Object.entries(statusNames).map(([key, value]) => (
                <div key={key} className="flex items-center">
                  <span className={`w-3 h-3 rounded-full ${statusColors[key].split(" ")[0]}`}></span>
                  <span className="ml-2 text-sm text-gray-600">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
              <Filter className="mr-2 h-5 w-5 text-gray-500" />
              Filtros
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md"
                >
                  <option value="">Todos</option>
                  {Object.entries(statusNames).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Cliente
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="clientName"
                    id="clientName"
                    value={filters.clientName}
                    onChange={handleFilterChange}
                    className="focus:ring-sky-500 focus:border-sky-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Buscar por cliente"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Data Inicial
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="startDate"
                    id="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                    className="focus:ring-sky-500 focus:border-sky-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Data Final
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="endDate"
                    id="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                    className="focus:ring-sky-500 focus:border-sky-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Projects Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              {filteredProjects.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Cliente
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Descrição
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Criado em
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Atualizado em
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProjects.map((project) => (
                      <tr key={project.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{project.clientName}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">{project.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={project.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(project.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(project.updatedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEditClick(project)}
                            className="text-sky-600 hover:text-sky-900 mr-3"
                          >
                            <Edit2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(project)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500 text-lg">Nenhum projeto encontrado com os filtros selecionados.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <NovoProjetoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateProject={handleCreateProject}
      />
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        project={projectToDelete}
      />
      <EditProjectModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onEditProject={handleEditProject}
        project={projectToEdit}
      />
    </div>
  )
}

export default Dashboard

