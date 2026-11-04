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
  ExternalLink,
  Menu,
  ChevronDown,
  AlertTriangle,
  CheckCircle2,
  Info
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { UserRole } from '../../types/erp';
import logo from '../../assets/logo.jpg';

export const Navbar: React.FC = () => {
  const {
    activeModule,
    activeRole,
    setActiveRole,
    alerts,
    markAlertRead,
    deleteAlert,
    clearAllReadAlerts,
    markAllAlertsRead,
    resetAlerts,
    setIsQuickAddOpen,
    setQuickAddType,
    setIsSearchOpen,
    setIsDemoRunnerOpen,
    isSidebarCollapsed,
    toggleSidebar
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
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-2.5 sm:px-6 bg-neutral-900 border-b border-neutral-800 shrink-0">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-1 sm:gap-2.5 min-w-0">
        <button
          type="button"
          onClick={toggleSidebar}
          className="md:hidden p-1.5 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-md transition-colors cursor-pointer shrink-0"
          title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label="Toggle sidebar"
        >
          <Menu className="w-4 h-4" />
        </button>
        <a
          href="#dashboard"
          className="flex items-center gap-1.5 sm:gap-2 min-w-0"
        >
          <img src={logo} alt="Amar Mine Chem Industries Logo" className="h-7 sm:h-9 w-auto object-contain shrink-0" />
          <span className="hidden sm:inline text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap">
            Amar Mine Chem Industries
          </span>
          <span className="sm:hidden text-xs font-bold tracking-tight text-white truncate max-w-[130px]">
            Amar Mine Chem
          </span>
        </a>
        <span className="hidden md:inline-block text-neutral-600">/</span>
        <span className="hidden md:inline-block text-xs font-medium text-neutral-400 whitespace-nowrap">
          {activeModule}
        </span>
      </div>



      {/* Zone 3: Primary Actions, Role Switcher, Quick Add, Alerts */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 h-full">

        {/* Notification Bell */}
        <div ref={alertMenuRef} className="relative flex items-center h-full">
          <button
            type="button"
            onClick={() => setShowAlertMenu(!showAlertMenu)}
            className={`relative w-8 h-8 flex items-center justify-center rounded-full transition-all cursor-pointer shadow-xs ${
              showAlertMenu
                ? 'bg-emerald-600 text-white ring-2 ring-emerald-400/40'
                : 'bg-white text-neutral-900 hover:bg-neutral-100'
            }`}
            title="Notifications & Alerts"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-neutral-900 font-mono">
                {unreadAlerts.length}
              </span>
            )}
          </button>

          {showAlertMenu && (
            <div className="fixed inset-x-3 top-16 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-[410px] bg-white border border-neutral-200 rounded-2xl shadow-2xl z-50 overflow-hidden text-xs animate-in fade-in slide-in-from-top-1 duration-150">
              {/* Dropdown Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-neutral-50/90 border-b border-neutral-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200/80 shadow-2xs shrink-0">
                    <Bell className="w-4 h-4 stroke-[2]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-neutral-900 text-xs tracking-tight">Notifications &amp; Alerts</span>
                      {unreadAlerts.length > 0 ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-mono">
                          {unreadAlerts.length} new
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-mono">
                          0 new
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-0.5">Plant operations &amp; manufacturing updates</p>
                  </div>
                </div>

                {unreadAlerts.length > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      markAllAlertsRead();
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 px-2 py-1 rounded-md transition-colors cursor-pointer shrink-0"
                    title="Mark all notifications as read"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              {/* Notification List */}
              <div className="max-h-80 sm:max-h-96 overflow-y-auto divide-y divide-neutral-100">
                {alerts.length === 0 ? (
                  <div className="py-10 px-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-3 text-emerald-700 shadow-2xs">
                      <Bell className="w-5 h-5 stroke-[1.75]" />
                    </div>
                    <h4 className="text-xs font-bold text-neutral-900">No Notifications</h4>
                    <p className="text-[11px] text-neutral-500 mt-1 max-w-[240px] mx-auto leading-relaxed">
                      All operational and manufacturing alerts have been cleared.
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        resetAlerts();
                      }}
                      className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md text-xs font-semibold cursor-pointer shadow-xs transition-colors"
                      title="Load sample notifications to test"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Load Sample Notifications</span>
                    </button>
                  </div>
                ) : (
                  alerts.map(alert => {
                    const isCritical = alert.type === 'critical';
                    const isWarning = alert.type === 'warning';

                    return (
                      <div
                        key={alert.id}
                        onClick={() => {
                          if (!alert.read) {
                            markAlertRead(alert.id);
                          }
                        }}
                        className={`p-3.5 transition-all cursor-pointer border-l-4 ${
                          !alert.read
                            ? isCritical
                              ? 'bg-rose-50/30 hover:bg-rose-50/60 border-l-rose-500'
                              : isWarning
                              ? 'bg-amber-50/30 hover:bg-amber-50/60 border-l-amber-500'
                              : 'bg-emerald-50/25 hover:bg-emerald-50/50 border-l-emerald-600'
                            : 'bg-white hover:bg-neutral-50/80 border-l-transparent text-neutral-600'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2.5">
                          <div className="flex items-start gap-2.5 flex-1 min-w-0">
                            <div className="mt-0.5 shrink-0">
                              {isCritical ? (
                                <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shadow-2xs">
                                  <AlertTriangle className="w-3 h-3" />
                                </div>
                              ) : isWarning ? (
                                <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shadow-2xs">
                                  <AlertTriangle className="w-3 h-3" />
                                </div>
                              ) : (
                                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-2xs">
                                  <CheckCircle2 className="w-3 h-3" />
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div
                                className={`font-bold text-xs leading-snug ${
                                  !alert.read ? 'text-neutral-900' : 'text-neutral-700'
                                }`}
                              >
                                <span>{alert.title}</span>
                              </div>

                              <p className="text-neutral-600 mt-1 text-[11px] leading-relaxed break-words">
                                {alert.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {!alert.read && (
                              <span
                                className="w-2 h-2 rounded-full bg-emerald-600 shrink-0"
                                title="Unread"
                              />
                            )}
                            <span className="text-[10px] font-mono text-neutral-400 whitespace-nowrap">
                              {alert.timestamp}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-2 mt-2.5 pt-2 border-t border-neutral-100">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-neutral-400">Module:</span>
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-700 font-mono">
                              {alert.module}
                            </span>
                          </div>

                          {alert.read && (
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60 font-mono">
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span>Read</span>
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteAlert(alert.id);
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 border border-rose-200 rounded-md transition-colors cursor-pointer shadow-2xs"
                                title="Delete this notification"
                              >
                                <Trash2 className="w-3 h-3 text-rose-600" />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Dropdown Footer */}
              {alerts.length > 0 && (
                <div className="px-4 py-2.5 bg-neutral-50/90 border-t border-neutral-200 flex items-center justify-between text-[11px] text-neutral-500">
                  <span className="font-mono">
                    {alerts.length} total notification{alerts.length === 1 ? '' : 's'}
                  </span>
                  {alerts.some(a => a.read) && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearAllReadAlerts();
                      }}
                      className="text-neutral-500 hover:text-rose-600 font-semibold transition-colors cursor-pointer inline-flex items-center gap-1"
                      title="Clear all read notifications"
                    >
                      <Trash2 className="w-3 h-3 text-neutral-400 group-hover:text-rose-600" />
                      <span>Clear all read</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Role Selector Dropdown */}
        <div ref={roleMenuRef} className="relative flex items-center h-full">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer shadow-2xs shrink-0 ${
              showRoleMenu
                ? 'bg-neutral-800 text-white border-neutral-600 ring-2 ring-white/10'
                : 'bg-neutral-800/80 text-neutral-200 border-neutral-700/70 hover:bg-neutral-800 hover:text-white hover:border-neutral-600'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="hidden sm:inline max-w-[120px] truncate font-medium">{activeRole}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 shrink-0 ${showRoleMenu ? 'rotate-180 text-white' : ''}`} />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-neutral-200 rounded-xl shadow-xl z-50 p-1.5 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-2.5 py-2 text-[11px] font-semibold text-neutral-400 border-b border-neutral-100 flex items-center justify-between">
                <span>Switch Role View</span>
                <span className="text-[10px] bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded font-mono font-medium">Role</span>
              </div>
              {roles.map(r => (
                <button
                  key={r}
                  onClick={() => {
                    setActiveRole(r);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-all cursor-pointer ${activeRole === r ? 'font-semibold text-emerald-800 bg-emerald-50/80 shadow-2xs' : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'}`}
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
