import React from 'react';
import { ERPProvider, useERP } from './context/ERPContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';
import { QuickAddModal } from './components/modals/QuickAddModal';
import { PrintableDocumentModal } from './components/modals/PrintableDocumentModal';
import { DemoScenarioRunner } from './components/demo/DemoScenarioRunner';

// Modules
import { DashboardModule } from './components/modules/DashboardModule';
import { CRMSalesModule } from './components/modules/CRMSalesModule';
import { SalesOrdersModule } from './components/modules/SalesOrdersModule';
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
import { CostingProfitabilityModule } from './components/modules/CostingProfitabilityModule';
import { EmployeesModule } from './components/modules/EmployeesModule';
import { MaintenanceModule } from './components/modules/MaintenanceModule';
import { DocumentsModule } from './components/modules/DocumentsModule';
import { ReportsAnalyticsModule } from './components/modules/ReportsAnalyticsModule';
import { SettingsModule } from './components/modules/SettingsModule';

const MainContent: React.FC = () => {
  const { activeModule } = useERP();

  const renderModule = () => {
    switch (activeModule) {
      case 'Dashboard':
        return <DashboardModule />;
      case 'CRM & Sales':
        return <CRMSalesModule />;
      case 'Purchase':
        return <PurchaseModule />;
      case 'Raw Material':
        return <RawMaterialModule />;
      case 'Production':
        return <ProductionModule />;
      case 'Quality Control':
        return <QualityControlModule />;
      case 'Finished Goods':
        return <FinishedGoodsModule />;
      case 'Inventory':
        return <InventoryModule />;
      case 'Dispatch & Logistics':
        return <DispatchLogisticsModule />;
      case 'Customers':
        return <CustomersModule />;
      case 'Suppliers':
        return <SuppliersModule />;
      case 'Finance & Accounts':
        return <FinanceAccountsModule />;
      case 'Expenses':
        return <ExpensesModule />;
      case 'Employees':
        return <EmployeesModule />;
      case 'Maintenance':
        return <MaintenanceModule />;
      case 'Documents':
        return <DocumentsModule />;
      case 'Reports & Analytics':
        return <ReportsAnalyticsModule />;
      case 'Settings':
        return <SettingsModule />;
      default:
        return <DashboardModule />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col font-sans">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto max-w-[1600px] w-full mx-auto">
          {renderModule()}
        </main>
      </div>

      {/* Global Modals & Dialogs */}
      <GlobalSearchModal />
      <QuickAddModal />
      <PrintableDocumentModal />
      <DemoScenarioRunner />
    </div>
  );
};

export default function App() {
  return (
    <ERPProvider>
      <MainContent />
    </ERPProvider>
  );
}
