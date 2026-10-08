import React, { useState } from 'react';
import { 
  X, 
  Play, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  Check, 
  Eye, 
  ChevronRight 
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';

interface ScenarioStep {
  stepNumber: number;
  phase: string;
  title: string;
  description: string;
  actionLabel: string;
  moduleTarget: any;
  metricChange: string;
}

export const DemoScenarioRunner: React.FC = () => {
  const { 
    isDemoRunnerOpen, 
    setIsDemoRunnerOpen, 
    demoStep, 
    setDemoStep, 
    runDemoStepAction, 
    setActiveModule, 
    resetAllData 
  } = useERP();

  const [isRunningAll, setIsRunningAll] = useState(false);

  if (!isDemoRunnerOpen) return null;

  const steps: ScenarioStep[] = [
    {
      stepNumber: 1,
      phase: 'CRM & Sales',
      title: 'Customer Order Placement (100 MT Bentonite Granules)',
      description: 'Customer "Kisan Bio-Tech Ltd" issues an order for 100 MT of Bentonite Granules (16-30 Mesh) at ₹6,200/MT (Total ₹6,37,980 with GST).',
      actionLabel: '1. Create Sales Order',
      moduleTarget: 'CRM & Sales',
      metricChange: 'Sales Order SO-2609-090 created'
    },
    {
      stepNumber: 2,
      phase: 'Inventory Check',
      title: 'Automated Finished Goods Stock Verification',
      description: 'System automatically queries Finished Goods storage. Available unreserved stock is 13.5 MT, which is insufficient for a 100 MT order.',
      actionLabel: '2. Check Stock Availability',
      moduleTarget: 'Finished Goods',
      metricChange: 'Status marked "Production Required"'
    },
    {
      stepNumber: 3,
      phase: 'Production Planning',
      title: 'Auto-Trigger Production Requirement & Order Creation',
      description: 'ERP automatically creates Production Order PO-MFG-099 linked to Sales Order, assigning Granulation Line 1 and Supervisor Bipinchandra.',
      actionLabel: '3. Create Production Order',
      moduleTarget: 'Production',
      metricChange: 'PO-MFG-099 generated with target 100 MT'
    },
    {
      stepNumber: 4,
      phase: 'BOM Calculation',
      title: 'BOM Explosion & Raw Material Requirement Breakdown',
      description: 'System runs BOM v2.4 explosion: 101 MT Bentonite Crude Lumps, 450 kg PAM Binder, 2,200 kg Liquid Silicate, and 2,000 HDPE bags.',
      actionLabel: '4. Calculate BOM & Verify Materials',
      moduleTarget: 'Production',
      metricChange: 'Material availability confirmed: 0 shortage'
    },
    {
      stepNumber: 5,
      phase: 'Material Issue',
      title: 'Raw Material Issue & Stock Reservation Deduction',
      description: 'Store keeper issues raw material batches. Raw Material inventory is automatically deducted in real time.',
      actionLabel: '5. Issue Materials to Line 1',
      moduleTarget: 'Raw Material',
      metricChange: '101 MT Bentonite Crude deducted from Yard'
    },
    {
      stepNumber: 6,
      phase: 'Manufacturing Run',
      title: 'Pelletizer Granulation & Fluidized Bed Drying',
      description: 'Granulation Line 1 processes feed through disc pelletizer, liquid binder atomization, drying to 6.5% moisture, and rotary screening.',
      actionLabel: '6. Start Plant Granulation',
      moduleTarget: 'Production',
      metricChange: 'Production Order status: In Production'
    },
    {
      stepNumber: 7,
      phase: 'Production Entry',
      title: 'Log Production Entry & Batch Output (Yield 97.8%)',
      description: 'Supervisor enters shift log: 102.2 MT input, 100.0 MT net output, 2.2 MT process loss. Efficiency 98.2%.',
      actionLabel: '7. Record Production Entry',
      moduleTarget: 'Production',
      metricChange: 'Batch BNT-2609-100 created (100 MT)'
    },
    {
      stepNumber: 8,
      phase: 'Batch Traceability',
      title: 'Generate Production Batch with Full Lot Traceability',
      description: 'Batch BNT-2609-100 is permanently indexed with raw material mine lot numbers, operator ID, and machinery log.',
      actionLabel: '8. Verify Batch Traceability',
      moduleTarget: 'Production',
      metricChange: 'Traceability linked to Mine Lot KBM-2609'
    },
    {
      stepNumber: 9,
      phase: 'Quality Control',
      title: 'Lab Testing (Moisture 6.5%, Swell 28ml, 16-30 Mesh 94.2%)',
      description: 'QC Chemist Manish Trivedi runs sieve retention, moisture analysis, and swelling index tests. All parameters pass standard.',
      actionLabel: '9. Perform QC Lab Analysis',
      moduleTarget: 'Quality Control',
      metricChange: 'Inspection QC-2609-065: Approved'
    },
    {
      stepNumber: 10,
      phase: 'Inventory Release',
      title: 'Batch Released to Finished Goods Available for Sale',
      description: 'Upon QC approval, 100 MT is added to Finished Goods inventory and made immediately available for commercial dispatch.',
      actionLabel: '10. Release to Finished Goods',
      moduleTarget: 'Finished Goods',
      metricChange: 'Finished stock increased by +100 MT'
    },
    {
      stepNumber: 11,
      phase: 'Sales Order Update',
      title: 'Sales Order Status Automatically Updates to "Ready"',
      description: 'With goods in warehouse, Sales Order SO-2609-090 switches from "Production Required" to "Ready for Dispatch".',
      actionLabel: '11. Confirm Sales Order Ready',
      moduleTarget: 'CRM & Sales',
      metricChange: 'SO status updated to "Ready"'
    },
    {
      stepNumber: 12,
      phase: 'Dispatch & Logistics',
      title: 'Create Delivery Challan & Assign Transport Vehicles',
      description: 'Logistics officer generates Delivery Challan DC-2609-065, allocates 10-wheeler truck GJ-04-E-8419, driver Ramsinh Gohil, and E-Way bill.',
      actionLabel: '12. Issue Delivery Challan',
      moduleTarget: 'Dispatch & Logistics',
      metricChange: 'Challan DC-2609-065 issued, stock deducted'
    },
    {
      stepNumber: 13,
      phase: 'Invoicing & Tax',
      title: 'Generate GST Tax Invoice with HSN 25081010',
      description: 'Accounts generates GST Tax Invoice INV-2609-085 for ₹6,37,980 (Taxable: ₹6,07,600 + CGST: ₹15,190 + SGST: ₹15,190).',
      actionLabel: '13. Generate Tax Invoice',
      moduleTarget: 'Finance & Accounts',
      metricChange: 'Invoice INV-2609-085 created'
    },
    {
      stepNumber: 14,
      phase: 'Accounts Receivable',
      title: 'Receivable Entry & Customer Outstanding Ledger Updated',
      description: '₹6,37,980 is automatically booked into Accounts Receivable under Kisan Bio-Tech ledger with 30-day payment terms.',
      actionLabel: '14. View Receivables Ledger',
      moduleTarget: 'Finance & Accounts',
      metricChange: 'Kisan Bio-Tech balance +₹6,37,980'
    },
    {
      stepNumber: 15,
      phase: 'Payment Receipt',
      title: 'Record Customer Bank Payment (RTGS Transfer)',
      description: 'Customer transfers ₹6,37,980 via SBI RTGS ref #SBIN99081248 to commercial current account.',
      actionLabel: '15. Enter RTGS Receipt',
      moduleTarget: 'Finance & Accounts',
      metricChange: 'Payment Voucher TXN-REC-120 logged'
    },
    {
      stepNumber: 16,
      phase: 'Financial Closure',
      title: 'Customer Balance Cleared & Product Profitability Realized',
      description: 'Invoice is marked "Paid", customer balance updated, and gross manufacturing margin of 28.7% (₹1,83,000) is reported on dashboard.',
      actionLabel: '16. View Updated Dashboard & Profit',
      moduleTarget: 'Dashboard',
      metricChange: 'Complete transaction cycle completed!'
    }
  ];

  const handleStepAction = (stepNum: number) => {
    runDemoStepAction(stepNum);
    const target = steps.find(s => s.stepNumber === stepNum)?.moduleTarget;
    if (target) setActiveModule(target);
  };

  const handleRunAll = async () => {
    setIsRunningAll(true);
    for (let s = 1; s <= 16; s++) {
      handleStepAction(s);
      await new Promise(r => setTimeout(r, 600));
    }
    setIsRunningAll(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/70 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-neutral-200 bg-neutral-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-emerald-500 text-neutral-900">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-sm tracking-tight">Complete End-to-End Manufacturing Transaction Demo</div>
              <div className="text-[11px] text-neutral-400">Section 39 Master Workflow: Order 100 MT Bentonite Granules → Finished Goods → Cash</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRunAll}
              disabled={isRunningAll}
              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-semibold rounded text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isRunningAll ? 'Executing Cycle...' : 'Auto-Play Entire 16-Step Cycle'}</span>
            </button>
            <button
              onClick={() => setIsDemoRunnerOpen(false)}
              className="p-1 hover:bg-neutral-800 rounded text-neutral-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stepper Progress Indicator */}
        <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between overflow-x-auto text-xs">
          <div className="flex items-center gap-2 text-neutral-700">
            <span className="font-semibold text-neutral-900">Active Stage:</span>
            <span className="px-2 py-0.5 rounded font-mono text-[11px] bg-neutral-200">
              Step {demoStep} of 16
            </span>
            <span className="text-neutral-500">· {steps[Math.min(demoStep - 1, 15)]?.title}</span>
          </div>
          <button
            onClick={() => {
              resetAllData();
              setDemoStep(1);
            }}
            className="text-[11px] text-neutral-500 hover:text-neutral-800 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo DB</span>
          </button>
        </div>

        {/* Steps List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 divide-y divide-neutral-100">
          {steps.map((st) => {
            const isCompleted = demoStep > st.stepNumber;
            const isCurrent = demoStep === st.stepNumber;

            return (
              <div 
                key={st.stepNumber}
                className={`pt-3 first:pt-0 flex items-start justify-between gap-4 p-3 rounded-lg transition-colors ${
                  isCurrent 
                    ? 'bg-emerald-50/70 border border-emerald-300' 
                    : isCompleted 
                    ? 'bg-neutral-50/50 opacity-90' 
                    : 'opacity-70'
                }`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                    isCompleted 
                      ? 'bg-emerald-600 text-white' 
                      : isCurrent 
                      ? 'bg-neutral-900 text-white ring-2 ring-emerald-500' 
                      : 'bg-neutral-200 text-neutral-600'
                  }`}>
                    {isCompleted ? <Check className="w-4 h-4" /> : st.stepNumber}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                        {st.phase}
                      </span>
                      {isCompleted && (
                        <span className="text-[10px] text-emerald-700 font-medium bg-emerald-100/70 px-1.5 py-0.2 rounded">
                          Executed &amp; Saved
                        </span>
                      )}
                      {isCurrent && (
                        <span className="text-[10px] text-neutral-900 font-semibold bg-amber-200/80 px-1.5 py-0.2 rounded">
                          Ready to Execute
                        </span>
                      )}
                    </div>
                    <div className="font-semibold text-xs text-neutral-900 mt-0.5">{st.title}</div>
                    <div className="text-[11px] text-neutral-600 mt-1 leading-relaxed">{st.description}</div>
                    <div className="text-[10px] font-mono text-emerald-800 mt-1">
                      Result: {st.metricChange}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <button
                    onClick={() => handleStepAction(st.stepNumber)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isCurrent
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                        : isCompleted
                        ? 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    <span>{st.actionLabel}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      setActiveModule(st.moduleTarget);
                      setIsDemoRunnerOpen(false);
                    }}
                    className="text-[10px] text-neutral-500 hover:text-neutral-800 flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    <span>View {st.moduleTarget}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-neutral-100 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-600">
          <span>Every action updates persistent ERP database tables, stock ledgers, and accounts in real-time.</span>
          <button
            onClick={() => setIsDemoRunnerOpen(false)}
            className="px-3 py-1 bg-white border border-neutral-300 hover:bg-neutral-50 rounded text-neutral-700 font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
