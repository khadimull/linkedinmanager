import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const navItems = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/accounts', label: 'Accounts', icon: '👤' },
  { path: '/campaigns', label: 'Campaigns', icon: '📢' },
  { path: '/leads', label: 'Leads', icon: '🎯' },
  { path: '/ai', label: 'AI Content', icon: '🤖' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-linkedin-500">
                  LinkedIn Manager
                </span>
              </div>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={'inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ' +
                      (location.pathname === item.path
                        ? 'text-linkedin-500 bg-linkedin-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50')
                    }
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-gray-700 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="sm:hidden bg-white border-b border-gray-200 px-4 py-2 flex space-x-2 overflow-x-auto">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={'flex-shrink-0 px-3 py-2 text-sm font-medium rounded-md ' +
              (location.pathname === item.path
                ? 'text-linkedin-500 bg-linkedin-50'
                : 'text-gray-600')
            }
          >
            {item.icon} {item.label}
          </Link>
        ))}
      </div>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
