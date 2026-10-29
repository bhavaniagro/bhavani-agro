import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  ShoppingCart,
  Boxes,
  Factory,
  PackageCheck,
  Warehouse,
  Truck,
  Users,
  Building2,
  Landmark,
  Receipt,
  UserCheck,
  Wrench,
  FileText,
  BarChart3,
  Settings,
  AlertTriangle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useERP, ERPModule } from '../../context/ERPContext';
import { MODULE_PATHS } from '../../config/routes';

interface NavItem {
  id: ERPModule;
  label: string;
  icon: React.ElementType;
  badge?: number;
  roles?: string[];
}

export const Sidebar: React.FC = () => {
  const { 
    activeModule, 
    setActiveModule, 
    activeRole, 
    salesOrders, 
    rawMaterials, 
    dispatches,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    toggleSidebar
  } = useERP();

  const pendingOrders = salesOrders.filter(s => s.status === 'Production Required' || s.status === 'Pending').length;
  const lowStockRM = rawMaterials.filter(r => r.currentStock <= r.reorderLevel).length;
  const pendingDispatches = dispatches.filter(d => d.status === 'Ready' || d.status === 'Loaded').length;

  const navItems: NavItem[] = [
    { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'CRM & Sales', label: 'CRM & Sales', icon: TrendingUp, badge: pendingOrders > 0 ? pendingOrders : undefined },
    { id: 'Purchase', label: 'Purchase', icon: ShoppingCart },
    { id: 'Raw Material', label: 'Raw Material', icon: Boxes, badge: lowStockRM > 0 ? lowStockRM : undefined },
    { id: 'Production', label: 'Production', icon: Factory },
    { id: 'Finished Goods', label: 'Finished Goods', icon: PackageCheck },
    { id: 'Inventory', label: 'Inventory', icon: Warehouse },
    { id: 'Dispatch & Logistics', label: 'Dispatch & Logistics', icon: Truck, badge: pendingDispatches > 0 ? pendingDispatches : undefined },
    { id: 'Customers', label: 'Customers', icon: Users },
    { id: 'Suppliers', label: 'Suppliers', icon: Building2 },
    { id: 'Finance & Accounts', label: 'Finance & Accounts', icon: Landmark },
    { id: 'Expenses', label: 'Expenses', icon: Receipt },
    { id: 'Employees', label: 'Employees', icon: UserCheck },
    { id: 'Maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'Documents', label: 'Documents', icon: FileText },
    { id: 'Reports & Analytics', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'Settings', label: 'Settings', icon: Settings }
  ];

  // Role visibility filter (Owner/Admin sees all; specific roles see pertinent items)
  const isItemVisible = (id: ERPModule): boolean => {
    if (activeRole === 'Owner / Admin') return true;
    switch (activeRole) {
      case 'Sales':
        return ['Dashboard', 'CRM & Sales', 'Customers', 'Reports & Analytics', 'Documents'].includes(id);
      case 'Purchase':
        return ['Dashboard', 'Purchase', 'Suppliers', 'Raw Material', 'Documents'].includes(id);
      case 'Production Manager':
        return ['Dashboard', 'Production', 'Raw Material', 'Finished Goods', 'Maintenance', 'Reports & Analytics'].includes(id);
      case 'Warehouse':
        return ['Dashboard', 'Raw Material', 'Finished Goods', 'Inventory', 'Dispatch & Logistics'].includes(id);
      case 'Accounts':
        return ['Dashboard', 'Customers', 'Suppliers', 'Finance & Accounts', 'Expenses', 'Reports & Analytics', 'Documents'].includes(id);
      case 'Dispatch':
        return ['Dashboard', 'Dispatch & Logistics', 'Finished Goods', 'Customers'].includes(id);
      default:
        return true;
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {!isSidebarCollapsed && (
        <div
          onClick={() => setIsSidebarCollapsed(true)}
          className="fixed inset-0 bg-neutral-900/50 z-40 md:hidden backdrop-blur-2xs transition-opacity"
        />
      )}

      <aside
        className={`bg-white border-r border-neutral-200 flex flex-col shrink-0 h-full overflow-hidden transition-all duration-200 ease-in-out z-40 ${
          isSidebarCollapsed
            ? 'w-0 -translate-x-full md:translate-x-0 md:w-16 border-r-0 md:border-r'
            : 'w-64 fixed inset-y-0 left-0 md:static md:w-60 shadow-xl md:shadow-none'
        }`}
      >
      {/* Sidebar Header & Collapse Toggle */}
      {!isSidebarCollapsed ? (
        <div className="p-3 border-b border-neutral-100 flex items-center justify-between shrink-0">
          <div className="text-xs min-w-0 pr-2">
            <div className="font-semibold text-neutral-900 truncate">Plant 1 · Bhavnagar GIDC</div>
            <div className="text-[11px] text-neutral-500">Sole Prop · Est. 1985</div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="System operational" />
            <button
              type="button"
              onClick={toggleSidebar}
              className="p-1 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded cursor-pointer transition-colors"
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-2.5 border-b border-neutral-100 flex items-center justify-center shrink-0">
          <button
            type="button"
            onClick={toggleSidebar}
            className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-md cursor-pointer transition-colors"
            title="Expand sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation List */}
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto min-h-0">
        {navItems.filter(item => isItemVisible(item.id)).map(item => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          const path = MODULE_PATHS[item.id] || '/';

          return (
            <Link
              key={item.id}
              to={path}
              title={item.label}
              onClick={() => {
                setActiveModule(item.id);
                if (typeof window !== 'undefined' && window.innerWidth < 768) {
                  setIsSidebarCollapsed(true);
                }
              }}
              className={`w-full flex items-center ${
                isSidebarCollapsed ? 'justify-center px-2 py-2.5' : 'justify-between px-2.5 py-1.5'
              } rounded-md text-xs font-medium transition-colors cursor-pointer text-left relative ${
                isActive
                  ? 'bg-neutral-900 text-white font-semibold'
                  : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-400' : 'text-neutral-400'}`} />
                {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                isSidebarCollapsed ? (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500" />
                ) :
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono tabular-nums ${
                  isActive ? 'bg-neutral-800 text-emerald-300' : 'bg-neutral-200 text-neutral-800'
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Role Notice */}
      {!isSidebarCollapsed ? (
        <div className="p-3 border-t border-neutral-200 bg-neutral-50/70 text-[11px] text-neutral-600 shrink-0">
          <div className="flex items-center justify-between">
            <span className="font-medium text-neutral-800">Active View</span>
            <span className="font-mono text-[10px] text-neutral-500">{activeRole}</span>
          </div>
          {activeRole !== 'Owner / Admin' && (
            <div className="text-[10px] text-amber-700 mt-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 shrink-0" />
              <span>Filtered for {activeRole}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="p-2.5 border-t border-neutral-200 bg-neutral-50/70 flex justify-center shrink-0" title={`Active View: ${activeRole}`}>
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
        </div>
      )}
    </aside>
  </>
  );
};
