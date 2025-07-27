import { 
  Calendar, 
  Users, 
  Star, 
  Trophy, 
  Utensils, 
  Image, 
  BarChart3,
  MessageSquare,
  LogOut,
  Brain
} from "lucide-react";

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  userEmail: string;
  onSignOut: () => void;
}

const navigationItems = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "reservations", label: "Reservations", icon: Calendar },
  { id: "testimonials", label: "Testimonials", icon: MessageSquare },
  { id: "awards", label: "Awards", icon: Trophy },
  { id: "menu", label: "Menu", icon: Utensils },
  { id: "gallery", label: "Gallery", icon: Image },
];

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  userEmail,
  onSignOut
}: AdminSidebarProps) {
  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0 fixed inset-y-0 left-0' : 'lg:relative -translate-x-full lg:translate-x-0'
      }`} style={{ minHeight: '100vh' }}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div>
              <h1 className="text-xl font-bold text-slate-800">Admin Dashboard</h1>
              <p className="text-sm text-slate-500">Café Fausse</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
            >
              <Brain className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === item.id 
                      ? "bg-primary-50 text-primary-700 border border-primary-200" 
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center space-x-3 px-4 py-2 text-sm text-slate-600">
              <Users className="h-4 w-4" />
              <span>{userEmail}</span>
            </div>
            <button
              onClick={onSignOut}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
} 