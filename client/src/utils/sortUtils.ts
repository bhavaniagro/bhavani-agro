/**
 * Universal Sorting Utility for Amar Mine Chem Industries ERP
 * Ensures latest entries (newest first) appear at the top of all tables across all modules.
 */
export function sortByLatest<T extends Record<string, any>>(items: T[]): T[] {
  if (!items || !Array.isArray(items) || items.length <= 1) {
    return items ? [...items] : [];
  }

  return [...items].sort((a, b) => {
    // 1. Compare Date/Time fields (newest timestamp first)
    const dateA = a.createdAt || a.date || a.orderDate || a.invoiceDate || a.inspectionDate || 
                  a.productionDate || a.dispatchDate || a.entryDate || a.joiningDate || 
                  a.uploadDate || a.timestamp || a.manufacturingDate || a.installationDate;
    const dateB = b.createdAt || b.date || b.orderDate || b.invoiceDate || b.inspectionDate || 
                  b.productionDate || b.dispatchDate || b.entryDate || b.joiningDate || 
                  b.uploadDate || b.timestamp || b.manufacturingDate || b.installationDate;

    if (dateA && dateB) {
      const timeA = new Date(dateA).getTime();
      const timeB = new Date(dateB).getTime();
      if (!isNaN(timeA) && !isNaN(timeB) && timeA !== timeB) {
        return timeB - timeA; // Descending: newest date first
      }
    } else if (dateA && !dateB) {
      return -1;
    } else if (!dateA && dateB) {
      return 1;
    }

    // 2. Compare reference code / identifier numbers (e.g. SO-2609-090 vs SO-2609-081, CUST-010 vs CUST-001)
    const codeA = a.orderNumber || a.poNumber || a.grnNumber || a.invoiceNumber || a.qcNumber || 
                  a.productionOrderNumber || a.dispatchNumber || a.transactionNumber || 
                  a.expenseNumber || a.code || a.employeeCode || a.machineCode || 
                  a.batchNumber || a.sku || '';
    const codeB = b.orderNumber || b.poNumber || b.grnNumber || b.invoiceNumber || b.qcNumber || 
                  b.productionOrderNumber || b.dispatchNumber || b.transactionNumber || 
                  b.expenseNumber || b.code || b.employeeCode || b.machineCode || 
                  b.batchNumber || b.sku || '';

    if (codeA && codeB && codeA !== codeB) {
      // Extract numeric portions (e.g. 2609040 vs 2609035)
      const numA = parseInt(String(codeA).replace(/\D+/g, ''), 10);
      const numB = parseInt(String(codeB).replace(/\D+/g, ''), 10);
      if (!isNaN(numA) && !isNaN(numB) && numA !== numB) {
        return numB - numA; // Higher numeric sequence first
      }
      return String(codeB).localeCompare(String(codeA));
    }

    // 3. Compare IDs (e.g. cust-172974... or cust-10 vs cust-1)
    if (a.id && b.id && a.id !== b.id) {
      const numIdA = parseInt(String(a.id).replace(/\D+/g, ''), 10);
      const numIdB = parseInt(String(b.id).replace(/\D+/g, ''), 10);
      if (!isNaN(numIdA) && !isNaN(numIdB) && numIdA !== numIdB) {
        return numIdB - numIdA;
      }
      return String(b.id).localeCompare(String(a.id));
    }

    return 0;
  });
}
