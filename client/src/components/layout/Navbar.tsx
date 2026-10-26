import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Plus,
  Bell,
  Sparkles,
  ShieldCheck,
  Check,
  Trash2,
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
    deleteAlert,
    markAllAlertsRead,
    setIsQuickAddOpen,
    setQuickAddType,
    setIsSearchOpen,
    setIsDemoRunnerOpen
  } = useERP();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showAlertMenu, setShowAlertMenu] = useState(false);

  const alertMenuRef = useRef<HTMLDivElement>(null);
  const roleMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showAlertMenu) setShowAlertMenu(false);
        if (showRoleMenu) setShowRoleMenu(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (showAlertMenu && alertMenuRef.current && !alertMenuRef.current.contains(e.target as Node)) {
        setShowAlertMenu(false);
      }
      if (showRoleMenu && roleMenuRef.current && !roleMenuRef.current.contains(e.target as Node)) {
        setShowRoleMenu(false);
      }
    };

    if (showAlertMenu || showRoleMenu) {
      window.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAlertMenu, showRoleMenu]);

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
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 sm:px-6 bg-white border-b border-neutral-200 shrink-0">
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
        <div ref={alertMenuRef} className="relative">
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
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-neutral-200 rounded-lg shadow-xl z-50 overflow-hidden text-xs">
              <div className="flex items-center justify-between px-3 py-2.5 bg-neutral-50/80 border-b border-neutral-200">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-neutral-900">Manufacturing Alerts</span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-neutral-200/70 text-neutral-600">
                    {unreadAlerts.length} unread
                  </span>
                </div>
                {unreadAlerts.length > 0 && (
                  <button
                    type="button"
                    onClick={() => markAllAlertsRead()}
                    className="text-[11px] text-emerald-700 hover:text-emerald-800 font-medium hover:underline cursor-pointer"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="max-h-80 sm:max-h-96 overflow-y-auto divide-y divide-neutral-100">
                {alerts.length === 0 ? (
                  <div className="py-8 px-4 text-center">
                    <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-2 text-neutral-400">
                      <Bell className="w-4 h-4 text-neutral-400 stroke-[1.5]" />
                    </div>
                    <p className="text-xs font-semibold text-neutral-700">No notifications</p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">All alerts have been cleared.</p>
                  </div>
                ) : (
                  alerts.map(alert => (
                    <div
                      key={alert.id}
                      onClick={() => {
                        if (!alert.read) markAlertRead(alert.id);
                      }}
                      className={`p-3 transition-colors ${
                        !alert.read
                          ? 'bg-amber-50/35 hover:bg-amber-50/55 cursor-pointer'
                          : 'bg-white hover:bg-neutral-50/70'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                          {!alert.read && (
                            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" title="Unread" />
                          )}
                          <span
                            className={`font-semibold text-xs leading-snug ${
                              alert.type === 'critical'
                                ? 'text-rose-700'
                                : alert.type === 'warning'
                                ? 'text-amber-800'
                                : 'text-blue-700'
                            }`}
                          >
                            {alert.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-neutral-400 whitespace-nowrap shrink-0">
                          {alert.timestamp}
                        </span>
                      </div>

                      <p className="text-neutral-600 mt-1 text-[11px] leading-relaxed">
                        {alert.description}
                      </p>

                      <div className="flex items-center justify-between gap-2 mt-2 pt-1.5 border-t border-neutral-100">
                        <div className="text-[10px] text-neutral-400 truncate">
                          Module: <span className="text-neutral-600 font-medium">{alert.module}</span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {!alert.read ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAlertRead(alert.id);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 border border-emerald-200/80 rounded transition-colors cursor-pointer shadow-2xs"
                              title="Mark as Read"
                            >
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Mark as Read</span>
                            </button>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-neutral-400">
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span>Read</span>
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteAlert(alert.id);
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 border border-rose-200/70 rounded transition-colors cursor-pointer shadow-2xs"
                                title="Delete Notification"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Role Selector Dropdown */}
        <div ref={roleMenuRef} className="relative">
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
