import { useNavigate } from "react-router-dom"
import { LogOut, User } from "lucide-react"
import logo from '../Assets/alaska.jpg'
const Navbar = ({ username }) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("userId")
    localStorage.removeItem("username")
    // Redirect to login page
    navigate("/")
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <img className="h-8 w-auto" src={logo} alt="Logo" />
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center">
              <User className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-gray-700 font-medium">{username}</span>
            </div>
            <button
              onClick={handleLogout}
              className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:text-gray-900 focus:bg-gray-100"
            >
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Sair</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

