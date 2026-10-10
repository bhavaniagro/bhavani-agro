import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Bell, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  Layers, 
  ExternalLink 
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { UserRole } from '../../types/erp';

export const Navbar: React.FC = () => {
  const { 
    activeModule, 
    activeRole, 
    setActiveRole, 
    alerts, 
    markAlertRead, 
    setIsQuickAddOpen, 
    setQuickAddType, 
    setIsSearchOpen,
    setIsDemoRunnerOpen
  } = useERP();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showAlertMenu, setShowAlertMenu] = useState(false);

  const unreadAlerts = alerts.filter(a => !a.read);

  const roles: UserRole[] = [
    'Owner / Admin',
    'Sales',
    'Purchase',
    'Production Manager',
    'Warehouse',
    'Accounts',
    'Dispatch'
  ];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 sm:px-6 bg-white border-b border-neutral-200">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3">
        <a 
          href="#dashboard" 
          className="text-base sm:text-lg font-bold tracking-tight text-neutral-900 flex items-center gap-2 whitespace-nowrap"
        >
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600 inline-block"></span>
          Bhavani Agro &amp; Minerals ERP
        </a>
        <span className="hidden md:inline-block text-neutral-300">/</span>
        <span className="hidden md:inline-block text-xs font-medium text-neutral-500 whitespace-nowrap">
          {activeModule}
        </span>
      </div>



      {/* Zone 3: Primary Actions, Role Switcher, Quick Add, Alerts */}
      <div className="flex items-center gap-2 sm:gap-3">


        {/* Global Quick Add Button */}
        <button
          onClick={() => {
            setQuickAddType(null);
            setIsQuickAddOpen(true);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors cursor-pointer whitespace-nowrap shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowAlertMenu(!showAlertMenu)}
            className="relative p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors cursor-pointer"
            title="Notifications & Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadAlerts.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
            )}
          </button>

          {showAlertMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-neutral-200 rounded-lg shadow-lg z-50 p-2 text-xs">
              <div className="flex items-center justify-between p-2 border-b border-neutral-100">
                <span className="font-semibold text-neutral-900">Manufacturing Alerts</span>
                <span className="text-[11px] text-neutral-500">{unreadAlerts.length} unread</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-neutral-100 py-1">
                {alerts.map(alert => (
                  <div 
                    key={alert.id}
                    onClick={() => markAlertRead(alert.id)}
                    className={`p-2.5 hover:bg-neutral-50 rounded cursor-pointer transition-colors ${!alert.read ? 'bg-amber-50/40' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className={`font-semibold ${alert.type === 'critical' ? 'text-rose-700' : alert.type === 'warning' ? 'text-amber-800' : 'text-blue-700'}`}>
                        {alert.title}
                      </span>
                      <span className="text-[10px] text-neutral-400 whitespace-nowrap">{alert.timestamp}</span>
                    </div>
                    <p className="text-neutral-600 mt-0.5 text-[11px] leading-relaxed">{alert.description}</p>
                    <div className="text-[10px] text-neutral-400 mt-1">Module: {alert.module}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Role Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200/80 rounded border border-neutral-200 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-neutral-500" />
            <span className="max-w-[110px] truncate">{activeRole}</span>
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-neutral-200 rounded-lg shadow-lg z-50 p-1 text-xs">
              <div className="px-2 py-1.5 text-[11px] font-semibold text-neutral-400 border-b border-neutral-100">
                Switch Role View
              </div>
              {roles.map(r => (
                <button
                  key={r}
                  onClick={() => {
                    setActiveRole(r);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-left hover:bg-neutral-100 transition-colors ${activeRole === r ? 'font-semibold text-emerald-700 bg-emerald-50' : 'text-neutral-700'}`}
                >
                  <span>{r}</span>
                  {activeRole === r && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
