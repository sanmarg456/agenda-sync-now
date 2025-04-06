import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function Sidebar() {
  const location = useLocation();
  const { signOut } = useAuth();

  const navigation = [
    { name: 'Tasks', href: '/tasks', icon: '📝' },
    { name: 'Calendar', href: '/calendar', icon: '📅' },
    { name: 'Planner', href: '/planner', icon: '📋' },
    { name: 'Reminders', href: '/reminders', icon: '⏰' },
    { name: 'Settings', href: '/settings', icon: '⚙️' },
  ];

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="flex h-16 items-center justify-center border-b">
        <h1 className="text-xl font-bold text-gray-800">Agenda Sync</h1>
      </div>
      <nav className="mt-5 px-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                isActive
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="absolute bottom-0 w-64 p-4">
        <button
          onClick={signOut}
          className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
        >
          <span className="mr-3">🚪</span>
          Sign Out
        </button>
      </div>
    </div>
  );
} 