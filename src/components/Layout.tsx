import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Clock,
  DollarSign,
  UserCircle,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
  { icon: Clock, label: 'Attendance', path: '/attendance' },
  { icon: DollarSign, label: 'Payroll', path: '/payroll' },
  { icon: UserCircle, label: 'Profile', path: '/profile' },
];

export default function Layout() {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200">
          <div className="h-full px-3 py-4 flex flex-col">
            <div className="mb-8 px-3 py-4">
              <h1 className="text-xl font-bold text-gray-800">Taskifiy - Hyaraxco</h1>
            </div>
            <nav className="flex-1 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className="flex items-center w-full px-3 py-2 text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900"
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
            <div className="border-t border-gray-200 pt-4">
              <button
                onClick={handleSignOut}
                className="flex items-center w-full px-3 py-2 text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
