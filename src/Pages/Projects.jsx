import { useState, useEffect } from 'react'

function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newProject, setNewProject] = useState({ clientName: '', description: '' })
  const [showForm, setShowForm] = useState(false)

  const statusColors = {
    'PAYMENT_CONFIRMED': 'bg-green-100 text-green-800',
    'ONBOARDING': 'bg-blue-100 text-blue-800',
    'COPY': 'bg-purple-100 text-purple-800',
    'DESIGN': 'bg-pink-100 text-pink-800',
    'DEVELOPMENT': 'bg-yellow-100 text-yellow-800',
    'COMPLETED': 'bg-gray-100 text-gray-800'
  }

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('https://api-alaska-digital.onrender.com/api/projects', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error('Falha ao carregar projetos')

      const data = await response.json()
      setProjects(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('https://api-alaska-digital.onrender.com/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newProject)
      })

      if (!response.ok) throw new Error('Falha ao criar projeto')

      await fetchProjects()
      setNewProject({ clientName: '', description: '' })
      setShowForm(false)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`https://api-alaska-digital.onrender.com/api/projects/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (!response.ok) throw new Error('Falha ao atualizar status')

      await fetchProjects()
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Projetos</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md"
        >
          {showForm ? 'Cancelar' : 'Novo Projeto'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="clientName">
              Nome do Cliente
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="clientName"
              type="text"
              value={newProject.clientName}
              onChange={(e) => setNewProject({ ...newProject, clientName: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Descrição
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              required
            />
          </div>
          <div className="flex items-center justify-end">
            <button
              className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Criar Projeto
            </button>
          </div>
        </form>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {projects.map((project) => (
            <li key={project.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{project.clientName}</h3>
                  <p className="mt-1 text-sm text-gray-500">{project.description}</p>
                </div>
                <div className="ml-4">
                  <select
                    value={project.status}
                    onChange={(e) => handleStatusUpdate(project.id, e.target.value)}
                    className={`${statusColors[project.status]} text-sm rounded-full px-3 py-1 font-semibold`}
                  >
                    <option value="PAYMENT_CONFIRMED">Pagamento Confirmado</option>
                    <option value="ONBOARDING">Onboarding</option>
                    <option value="COPY">Copy</option>
                    <option value="DESIGN">Design</option>
                    <option value="DEVELOPMENT">Desenvolvimento</option>
                    <option value="COMPLETED">Concluído</option>
                  </select>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Projects