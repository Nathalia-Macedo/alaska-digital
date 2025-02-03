import { X } from "lucide-react"

function ConfirmDeleteModal({ isOpen, onClose, onConfirm, project }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Confirmar Exclusão</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>
        <p className="mb-4 text-gray-600">Tem certeza que deseja excluir o projeto "{project.clientName}"?</p>
        <div className="bg-gray-100 p-4 rounded-md mb-4">
          <p>
            <strong>Cliente:</strong> {project.clientName}
          </p>
          <p>
            <strong>Descrição:</strong> {project.description}
          </p>
          <p>
            <strong>Status:</strong> {project.status}
          </p>
        </div>
        <div className="flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(project.id)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDeleteModal

