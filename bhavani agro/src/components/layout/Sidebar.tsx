import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  ShoppingCart,
  Boxes,
  Factory,
  FlaskConical,
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
  AlertTriangle
} from 'lucide-react';
import { useERP, ERPModule } from '../../context/ERPContext';

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
    qcInspections, 
    rawMaterials, 
    dispatches 
  } = useERP();

  const pendingQC = qcInspections.filter(q => q.overallStatus === 'Pending').length;
  const pendingOrders = salesOrders.filter(s => s.status === 'Production Required' || s.status === 'Pending').length;
  const lowStockRM = rawMaterials.filter(r => r.currentStock <= r.reorderLevel).length;
  const pendingDispatches = dispatches.filter(d => d.status === 'Ready' || d.status === 'Loaded').length;

  const navItems: NavItem[] = [
    { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'CRM & Sales', label: 'CRM & Sales', icon: TrendingUp, badge: pendingOrders > 0 ? pendingOrders : undefined },
    { id: 'Purchase', label: 'Purchase', icon: ShoppingCart },
    { id: 'Raw Material', label: 'Raw Material', icon: Boxes, badge: lowStockRM > 0 ? lowStockRM : undefined },
    { id: 'Production', label: 'Production', icon: Factory },
    { id: 'Quality Control', label: 'Quality Control', icon: FlaskConical, badge: pendingQC > 0 ? pendingQC : undefined },
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
        return ['Dashboard', 'Production', 'Raw Material', 'Quality Control', 'Finished Goods', 'Maintenance', 'Reports & Analytics'].includes(id);
      case 'Warehouse':
        return ['Dashboard', 'Raw Material', 'Finished Goods', 'Inventory', 'Dispatch & Logistics', 'Quality Control'].includes(id);
      case 'Accounts':
        return ['Dashboard', 'Customers', 'Suppliers', 'Finance & Accounts', 'Expenses', 'Reports & Analytics', 'Documents'].includes(id);
      case 'Dispatch':
        return ['Dashboard', 'Dispatch & Logistics', 'Finished Goods', 'Customers'].includes(id);
      default:
        return true;
    }
  };

  return (
    <aside className="w-60 bg-white border-r border-neutral-200 flex flex-col shrink-0 min-h-[calc(100vh-3.5rem)]">
      {/* Plant quick identity */}
      <div className="p-3 border-b border-neutral-100 flex items-center justify-between">
        <div className="text-xs">
          <div className="font-semibold text-neutral-900 truncate">Plant 1 · Bhavnagar GIDC</div>
          <div className="text-[11px] text-neutral-500">Sole Prop · Est. 1985</div>
        </div>
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="System operational" />
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {navItems.filter(item => isItemVisible(item.id)).map(item => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer text-left ${
                isActive
                  ? 'bg-neutral-900 text-white font-semibold'
                  : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-400' : 'text-neutral-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono tabular-nums ${
                  isActive ? 'bg-neutral-800 text-emerald-300' : 'bg-neutral-200 text-neutral-800'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Role Notice */}
      <div className="p-3 border-t border-neutral-200 bg-neutral-50/70 text-[11px] text-neutral-600">
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
    </aside>
  );
};
