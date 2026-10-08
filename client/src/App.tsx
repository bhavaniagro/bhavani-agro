import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ERPProvider, useERP } from './context/ERPContext';
import { PATH_TO_MODULE } from './config/routes';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';
import { QuickAddModal } from './components/modals/QuickAddModal';
import { PrintableDocumentModal } from './components/modals/PrintableDocumentModal';
import { DemoScenarioRunner } from './components/demo/DemoScenarioRunner';
import { ToastContainer } from './components/common/Toast';

// Modules
import { DashboardModule } from './components/modules/DashboardModule';
import { CRMSalesModule } from './components/modules/CRMSalesModule';
import { PurchaseModule } from './components/modules/PurchaseModule';
import { RawMaterialModule } from './components/modules/RawMaterialModule';
import { ProductionModule } from './components/modules/ProductionModule';
import { QualityControlModule } from './components/modules/QualityControlModule';
import { FinishedGoodsModule } from './components/modules/FinishedGoodsModule';
import { InventoryModule } from './components/modules/InventoryModule';
import { DispatchLogisticsModule } from './components/modules/DispatchLogisticsModule';
import { CustomersModule } from './components/modules/CustomersModule';
import { SuppliersModule } from './components/modules/SuppliersModule';
import { FinanceAccountsModule } from './components/modules/FinanceAccountsModule';
import { ExpensesModule } from './components/modules/ExpensesModule';
import { EmployeesModule } from './components/modules/EmployeesModule';
import { MaintenanceModule } from './components/modules/MaintenanceModule';
import { DocumentsModule } from './components/modules/DocumentsModule';
import { ReportsAnalyticsModule } from './components/modules/ReportsAnalyticsModule';
import { SettingsModule } from './components/modules/SettingsModule';

const RouteSyncHandler: React.FC = () => {
  const location = useLocation();
  const { activeModule, setActiveModule } = useERP();

  useEffect(() => {
    const targetModule = PATH_TO_MODULE[location.pathname];
    if (targetModule && targetModule !== activeModule) {
      setActiveModule(targetModule);
    }
  }, [location.pathname]);

  return null;
};

const MainContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col font-sans">
      <RouteSyncHandler />
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto max-w-[1600px] w-full mx-auto">
          <Routes>
            <Route path="/" element={<DashboardModule />} />
            <Route path="/dashboard" element={<Navigate to="/" replace />} />
            <Route path="/sales" element={<CRMSalesModule />} />
            <Route path="/crm-sales" element={<Navigate to="/sales" replace />} />
            <Route path="/purchase" element={<PurchaseModule />} />
            <Route path="/raw-material" element={<RawMaterialModule />} />
            <Route path="/production" element={<ProductionModule />} />
            <Route path="/quality-control" element={<QualityControlModule />} />
            <Route path="/finished-goods" element={<FinishedGoodsModule />} />
            <Route path="/inventory" element={<InventoryModule />} />
            <Route path="/dispatch" element={<DispatchLogisticsModule />} />
            <Route path="/dispatch-logistics" element={<Navigate to="/dispatch" replace />} />
            <Route path="/customers" element={<CustomersModule />} />
            <Route path="/suppliers" element={<SuppliersModule />} />
            <Route path="/finance" element={<FinanceAccountsModule />} />
            <Route path="/finance-accounts" element={<Navigate to="/finance" replace />} />
            <Route path="/expenses" element={<ExpensesModule />} />
            <Route path="/employees" element={<EmployeesModule />} />
            <Route path="/maintenance" element={<MaintenanceModule />} />
            <Route path="/documents" element={<DocumentsModule />} />
            <Route path="/reports" element={<ReportsAnalyticsModule />} />
            <Route path="/reports-analytics" element={<Navigate to="/reports" replace />} />
            <Route path="/settings" element={<SettingsModule />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Global Modals & Dialogs */}
      <GlobalSearchModal />
      <QuickAddModal />
      <PrintableDocumentModal />
      <DemoScenarioRunner />
      <ToastWrapper />
    </div>
  );
};

const ToastWrapper: React.FC = () => {
  const { toasts, dismissToast } = useERP();
  return <ToastContainer toasts={toasts} onDismiss={dismissToast} />;
};

export default function App() {
  return (
    <BrowserRouter>
      <ERPProvider>
        <MainContent />
      </ERPProvider>
    </BrowserRouter>
  );
}
