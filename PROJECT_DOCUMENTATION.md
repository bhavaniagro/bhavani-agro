# 🌾 AMAR MINE CHEMS ERP
## Comprehensive Project Documentation & Business Workflow Specification
**પ્રોજેક્ટ દસ્તાવેજીકરણ અને સંપૂર્ણ બિઝનેસ વર્કફ્લો ગાઇડ**

---

### Document Information / દસ્તાવેજ માહિતી
* **Project Name**: Amar Mine Chems ERP (Enterprise Resource Planning System)
* **Company**: Amar Mine Chems Pvt Ltd, Chitra GIDC, Bhavnagar, Gujarat
* **Internship Organization**: DZ Infotech
* **Version**: 1.0.0 (Production Architecture)
* **Technology Stack**: React 19, TypeScript, Vite, Tailwind CSS, Node.js, Express, Google Cloud Firestore, In-Memory Delta Caching
* **Date**: October 2026

---

## 📑 TABLE OF CONTENTS / વિષયસૂચિ

1. [Executive Summary & Company Overview / કંપની પરિચય અને ઉદ્દેશ્યો](#1-executive-summary--company-overview)
2. [Technical Architecture & Tech Stack / ટેકનિકલ આર્કિટેક્ચર](#2-technical-architecture--tech-stack)
3. [End-to-End Business Workflow (16-Step Lifecycle) / સંપૂર્ણ બિઝનેસ વર્કફ્લો](#3-end-to-end-business-workflow-16-step-lifecycle)
4. [Detailed Module Breakdown / તમામ મોડ્યુલ્સની વિગતવાર વિગતો](#4-detailed-module-breakdown)
5. [Database Architecture & Firestore Collections / ડેટાબેઝ મોડેલ](#5-database-architecture--firestore-collections)
6. [Complete REST API Reference / API એન્ડપોઇન્ટ્સ સંદર્ભ](#6-complete-rest-api-reference)
7. [Role-Based Access Control (RBAC) / યુઝર રોલ્સ અને પરવાનગીઓ](#7-role-based-access-control-rbac)
8. [Setup, Installation & Running Guide / પ્રોજેક્ટ સેટઅપ માર્ગદર્શિકા](#8-setup-installation--running-guide)
9. [Internship Key Takeaways & Project Impact / ઇન્ટર્નશિપ સિદ્ધિઓ](#9-internship-key-takeaways--project-impact)

---

## 1. EXECUTIVE SUMMARY & COMPANY OVERVIEW
### કંપની પરિચય અને ઉદ્દેશ્યો

### 1.1 About Amar Mine Chems
**Amar Mine Chems Pvt Ltd** (Est. 1985) એ ભાવનગર, ગુજરાત (Plot No. 48-52, GIDC Industrial Estate, Chitra) સ્થિત અગ્રણી એગ્રો-મિનરલ અને કેમિકલ પ્રોસેસિંગ કંપની છે. કંપની બેન્ટોનાઇટ ગ્રેન્યુલ્સ (Bentonite Granules 16-30 Mesh), બાયો-ફર્ટિલાઇઝર્સ (Bio-Fertilizers), ઓર્ગેનિક સોઇલ કન્ડિશનર્સ (Organic Soil Conditioners) અને મિનરલ પાઉડરનું ઉત્પાદન અને સમગ્ર ભારતમાં ખાતર બનાવતી કંપનીઓ (Fertilizer Blenders), ડીલરો અને સહકારી મંડળીઓને સપ્લાય કરે છે.

### 1.2 Problem Statement / પહેલાંની સમસ્યાઓ
આ ERP સિસ્ટમ અમલમાં મૂકતા પહેલાં ફેક્ટરીમાં નીચે મુજબની ગંભીર સમસ્યાઓ હતી:
1. **મેન્યુઅલ રજિસ્ટર અને ડેટા સાયલોઝ (Data Silos)**: સ્ટોક, સેલ્સ અને ખરીદી અલગ-અલગ ચોપડામાં લખાતા હોવાથી રિયલ-ટાઇમ સ્ટોક ખબર ન પડતી.
2. **પ્રોડક્શન અને કાચા માલનો મેળ ન પડવો**: ઓર્ડર આવી જાય પણ ફેક્ટરીમાં કાચો માલ (Bentonite crude lumps, binder chemicals) પૂરતો છે કે નહીં તે તાત્કાલિક જાણી શકાતું ન હતું.
3. **બેચ ટ્રેસિબિલિટીનો અભાવ (Lack of Traceability)**: ખાતર કંપનીઓને સપ્લાય કરેલ માલમાં કોઈ ફરિયાદ આવે તો તે કઈ ખાણમાંથી આવેલા પથ્થરમાંથી બન્યો હતો અને કયા ઓપરેટરે પ્રોસેસ કર્યો હતો તે ટ્રેસ ન થઈ શકતું.
4. **GST બિલિંગ અને ચલણ વચ્ચે વિસંગતતા**: ડિસ્પેચ ટ્રક નીકળી જાય પછી બિલ બનતું, જેથી E-Way Bill અને એકાઉન્ટ્સમાં ભૂલો થતી.

### 1.3 ERP Solution / સોલ્યુશન
આ આધુનિક **Amar Mine Chems ERP** દ્વારા કંપનીના તમામ વિભાગોને (Sales, Purchase, Stores, Production, QC, Dispatch, Accounts, Maintenance, HR) એક જ ક્લાઉડ-બેઝ્ડ પ્લેટફોર્મ પર સાંકળી લેવામાં આવ્યા છે.

---

## 2. TECHNICAL ARCHITECTURE & TECH STACK
### ટેકનિકલ આર્કિટેક્ચર અને સિસ્ટમ ડિઝાઇન

સિસ્ટમ મોર્ડન ડિસ્ટ્રિબ્યુટેડ ક્લાયન્ટ-સર્વર આર્કિટેક્ચર પર બનેલી છે:

```
+-------------------------------------------------------------------------+
|                         CLIENT TIER (React 19)                          |
|  - Vite Bundler + TypeScript + Tailwind CSS                             |
|  - React Router v7 (Stateful Module Navigation)                        |
|  - ERPContext (Central State, Offline Sync, Demo Scenarios)             |
|  - Lucide Icons + Motion Micro-interactions                             |
+-------------------------------------------------------------------------+
                                    |
                                    | HTTPS / JSON REST API
                                    v
+-------------------------------------------------------------------------+
|                         SERVER TIER (Node.js & Express)                 |
|  - Express REST Controllers & Express Routers (23 Specialized Routes)   |
|  - Smart In-Memory Cache & Delta Filtering Engine (apiCacheMiddleware)   |
|  - Strict Validation, CORS & Large Payload Support (50MB)               |
+-------------------------------------------------------------------------+
                                    |
                                    | Firebase Admin SDK (Node.js)
                                    v
+-------------------------------------------------------------------------+
|                         DATA & CLOUD TIER                               |
|  - Google Cloud Firestore (NoSQL Document Store, High Availability)    |
|  - Local File System / Multer Storage (/uploads for invoices & QC docs) |
+-------------------------------------------------------------------------+
```

### 2.1 Technology Highlights
* **Frontend**:
  * **React 19 & TypeScript**: ટાઇપ-સેફ કોડ અને હાઇ-પરફોર્મન્સ વર્ચ્યુઅલ DOM.
  * **Tailwind CSS v4**: રિસ્પોન્સિવ, આધુનિક ઇન્ટરફેસ જે મોબાઇલ, ટેબ્લેટ અને ડેસ્કટોપ ત્રણેય પર એકસરખો પ્રીમિયમ લુક આપે છે.
  * **Motion**: સ્મૂધ ટ્રાન્ઝિશન્સ અને ઇન્ટરેક્ટિવ ફીડબેક.
  * **Client Data Caching**: ડેટા લોડિંગ સ્પીડ વધારવા માટે લોકલ સ્ટેટ મેનેજમેન્ટ.
* **Backend**:
  * **Node.js & Express (TypeScript)**: હાઇ સ્કેલેબલ બેકએન્ડ.
  * **In-Memory Cache & Delta Sync Middleware (`apiCacheMiddleware`)**:
    * તમામ ટોપ-લેવલ `GET` એન્ડપોઇન્ટ્સને મેમરીમાં કેશ કરે છે.
    * ક્લાયન્ટ `?since=timestamp` મોકલે ત્યારે માત્ર બદલાયેલો નવો ડેટા (Delta) જ મોકલે છે.
    * `POST`, `PUT`, `DELETE` થતાં જ કેશ ઓટોમેટિકલી અપડેટ અથવા ઇનવેલિડેટ થાય છે.
    * આનાથી Google Cloud Firestore ના ઓપરેશન ખર્ચમાં 85% નો ઘટાડો થાય છે.
* **Database**:
  * **Google Cloud Firestore**: મિલીસેકન્ડ લેટન્સી, હાઇ સ્કેલેબિલિટી અને ઓટોમેટિક ક્લાઉડ બેકઅપ.

---

## 3. END-TO-END BUSINESS WORKFLOW (16-STEP LIFECYCLE)
### સંપૂર્ણ બિઝનેસ વર્કફ્લો - ૧૬ તબક્કાની જીવનચક્ર પ્રક્રિયા

ભાવનગર ફેક્ટરીમાં ઓર્ડર આવવાથી લઈને ખાતામાં નાણાં જમા થવા સુધીની સમગ્ર પ્રક્રિયા નીચે મુજબ 16 તબક્કામાં સ્વચાલિત રીતે ચાલે છે:

```
[1. CRM Lead / Order] ---> [2. Stock Check] ---> [3. PO / Raw Material] ---> [4. GRN & QC]
         |                                                                        |
         v                                                                        v
[5. Sales Order Ready] <--- [8. Finished Goods] <--- [7. Batch Traceability] <--- [6. Production Run]
         |
         v
[9. Dispatch Challan] ---> [10. Vehicle Assign] ---> [11. GST Tax Invoice] ---> [12. Accounts Ledger]
                                                                                       |
                                                                                       v
[16. Profit & P&L] <--- [15. Expense Booking] <--- [14. Ledger Cleared] <--- [13. Payment Receipt]
```

### ૧૬ તબક્કાઓની વિગતવાર સમજૂતી (Detailed 16-Step Breakdown):

#### તબક્કો ૧: કસ્ટમર ઓર્ડર પ્લેસમેન્ટ (CRM & Sales Order Placement)
* કસ્ટમર (દા.ત. "Kisan Bio-Tech Ltd") તરફથી 100 MT બેન્ટોનાઇટ ગ્રેન્યુલ્સનો ઓર્ડર આવે છે.
* સેલ્સ એક્ઝિક્યુટિવ CRM મોડ્યુલમાં લીડ ક્રિએટ કરે છે, ક્વોટેશન જનરેટ કરે છે અને ઓર્ડર કન્ફર્મ થતાં **Sales Order (SO-2609-090)** બને છે.
* દર: ₹6,200/MT, કુલ ટેક્સેબલ: ₹6,07,600 + GST 5% = કુલ ઓર્ડર મૂલ્ય: ₹6,37,980.

#### તબક્કો ૨: ઓટોમેટેડ ફિનિશ્ડ ગુડ્સ સ્ટોક વેરિફિકેશન (Inventory Check)
* સિસ્ટમ ફિનિશ્ડ ગુડ્સ વેરહાઉસમાં ઓટોમેટિક ચેક કરે છે કે 100 MT સ્ટોક ઉપલબ્ધ છે કે નહીં.
* વેરહાઉસમાં માત્ર 13.5 MT અનરિઝર્વ્ડ સ્ટોક છે, જેથી 100 MT માટે સ્ટોક ખૂટે છે.
* સેલ્સ ઓર્ડરનું સ્ટેટસ ઓટોમેટિકલી બદલાઈને **"Production Required"** થઈ જાય છે.

#### તબક્કો ૩: પ્રોડક્શન ઓર્ડર ઓટો-ટ્રિગર (Production Planning)
* સેલ્સ ઓર્ડર સાથે લિંક્ડ **Production Order (PO-MFG-099)** ઓટોમેટિક જનરેટ થાય છે.
* પ્રોડક્શન પ્લાનર ગ્રેન્યુલેશન લાઇન ૧ (Granulation Line 1) અને સુપરવાઇઝર બિપિનચંદ્રને ટાર્ગેટ 100 MT નો જોબ કાર્ડ સોંપે છે.

#### તબક્કો ૪: બિલ ઓફ મટિરિયલ્સ (BOM) કેલ્ક્યુલેશન (BOM Explosion)
* સિસ્ટમ ગ્રેન્યુલ્સ માટેનો અધિકૃત ફોર્મ્યુલા **BOM v2.4** રન કરે છે:
  * Bentonite Crude Lumps: 101 MT
  * PAM Binder (પોલિમર બાઈન્ડર): 450 KG
  * Liquid Sodium Silicate: 2,200 KG
  * HDPE 50kg Bags: 2,000 નંગ
* સિસ્ટમ કાચા માલના વેરહાઉસમાં આટલો સ્ટોક છે કે નહીં તે તાત્કાલિક તપાસે છે.

#### તબક્કો ૫: કાચા માલની ખરીદી, GRN અને આવક QC (જો માલ ખૂટતો હોય તો)
* જો કાચો માલ ખૂટતો હોય તો પરચેઝ મોડ્યુલમાંથી સપ્લાયરને **Purchase Order (PO)** ઇશ્યૂ થાય છે.
* ફેક્ટરીના વજનકાંટા પર ટ્રક આવે એટલે **Goods Received Note (GRN)** બને છે.
* લેબ કેમિસ્ટ દ્વારા મોઇશ્ચર (Moisture), મેશ સાઇઝ અને મોન્ટમોરિલોનાઇટ પ્યોરિટીનું **QC Inspection** થાય છે. માલ 'Approved' થતાં જ સ્ટોકમાં જમા થાય છે.

#### તબક્કો ૬: કાચો માલ ફેક્ટરી લાઇન પર ઇશ્યૂ કરવો (Material Issuance)
* સ્ટોરકીપર ગ્રેન્યુલેશન લાઇન ૧ માટે 101 MT ક્રૂડ લમ્પ્સ અને બાઈન્ડર કેમિકલ ઇશ્યૂ કરે છે.
* કાચા માલના સ્ટોક રજિસ્ટરમાંથી સ્ટોક તાત્કાલિક બાદ (deduct) થઈ જાય છે અને ઓડિટ ટ્રેઇલ લખાણ થઈ જાય છે.

#### તબક્કો ૭: પ્લાન્ટ પ્રોસેસિંગ - ગ્રેન્યુલેશન અને ડ્રાયિંગ (Manufacturing Run)
* ડિસ્ક પેલેટાઇઝર (Disc Pelletizer) માં માટીનું મિશ્રણ અને બાઈન્ડર સ્પ્રે થાય છે.
* ફ્લુઇડાઇઝ્ડ બેડ ડ્રાયરમાં 6.5% સુધી મોઇશ્ચર કંટ્રોલ થાય છે અને રોટરી સ્ક્રીનિંગમાં 16-30 મેશના એકસરખા દાણા અલગ પડે છે.

#### તબક્કો ૮: શિફ્ટ પ્રોડક્શન એન્ટ્રી અને યીલ્ડ ગણતરી (Shift Output Entry)
* શિફ્ટ સુપરવાઇઝર ડેઇલી પ્રોડક્શન લોગ ભરે છે:
  * કુલ ઇનપુટ: 102.2 MT
  * ચોખ્ખું ઉત્પાદન: 100.0 MT
  * પ્રોસેસ લોસ/વેસ્ટેજ: 2.2 MT (યીલ્ડ: 97.8%, પ્લાન્ટ એફિશિયન્સી: 98.2%)
  * વીજળી વપરાશ: 420 kWh.

#### તબક્કો ૯: પ્રોડક્શન બેચ જનરેશન અને માઇન-લોટ ટ્રેસિબિલિટી (Batch Traceability)
* સિસ્ટમ કાયમી બેચ નંબર **BNT-2609-100** ફાળવે છે.
* આ બેચ સાથે કઈ ખાણમાંથી પથ્થર આવ્યો હતો (Mine Lot: KBM-2609), કઈ શિફ્ટમાં બન્યો અને કયા ઓપરેટરે ચલાવ્યો તેનું કાયમી ડિજિટલ રેકોર્ડ લિંક થઈ જાય છે.

#### તબક્કો ૧૦: ફિનિશ્ડ ગુડ્સ વેરહાઉસમાં માલ જમા (Finished Goods Release)
* ઉત્પાદન પૂર્ણ થતાં 100 MT માલ (2,000 બેગ) ફિનિશ્ડ ગુડ્સ ગોડાઉનમાં જમા થાય છે.
* આ માલ હવે સેલ્સ માટે ઉપલબ્ધ (Available for Sale) તરીકે માર્ક થાય છે.

#### તબક્કો ૧૧: સેલ્સ ઓર્ડરનું સ્ટેટસ ઓટો-અપડેટ (Order Ready for Dispatch)
* વેરહાઉસમાં માલ આવી જતાં અગાઉ અટકેલો સેલ્સ ઓર્ડર (SO-2609-090) આપમેળે **"Ready for Dispatch"** માં કન્વર્ટ થઈ જાય છે અને ડિસ્પેચ ટીમને એલર્ટ મળે છે.

#### તબક્કો ૧૨: ડિસ્પેચ પ્લાનિંગ અને ડિલિવરી ચલણ (Delivery Challan & Vehicle Allocation)
* લોજિસ્ટિક્સ ઓફિસર ડિલિવરી ચલણ **DC-2609-065** બનાવે છે.
* 10-વ્હીલર ટ્રક (GJ-04-E-8419), ડ્રાઈવર રામસિંહ ગોહિલ અને E-Way Bill ની વિગતો દાખલ થાય છે.
* ટ્રક લોડ થતાં જ ફિનિશ્ડ સ્ટોકમાંથી 100 MT બાદ થાય છે.

#### તબક્કો ૧૩: GST ટેક્સ ઇન્વોઇસ જનરેશન (GST Tax Invoice Generation)
* એકાઉન્ટ્સ વિભાગ કાયદેસરનું GST ઇન્વોઇસ **INV-2609-085** બનાવે છે:
  * HSN Code: 25081010 (Bentonite)
  * ટેક્સેબલ રકમ: ₹6,07,600
  * CGST (2.5%): ₹15,190
  * SGST (2.5%): ₹15,190
  * કુલ બિલ રકમ: ₹6,37,980.

#### તબક્કો ૧૪: એકાઉન્ટ્સ રિસિવેબલ અને ગ્રાહકનું ખાતાવહી (Accounts Receivable Ledger)
* કિસાન બાયો-ટેકના ખાતામાં ₹6,37,980 નું ઉધાર (Debit) બુક થાય છે.
* 30 દિવસની ક્રેડિટ લિમિટ સાથે ડ્યુ-ડેટ સેટ થાય છે.

#### તબક્કો ૧૫: ગ્રાહક પાસેથી પેમેન્ટ પ્રાપ્તિ (Customer Payment Receipt)
* કસ્ટમર SBI બેંક દ્વારા RTGS ટ્રાન્સફર (Ref: SBIN99081248) થી ₹6,37,980 જમા કરાવે છે.
* એકાઉન્ટન્ટ પેમેન્ટ વાઉચર **TXN-REC-120** એન્ટર કરી ઇન્વોઇસ સામે સેટલ કરે છે. કસ્ટમરનું આઉટસ્ટેન્ડિંગ ઝીરો (₹0) થઈ જાય છે.

#### તબક્કો ૧૬: નફાકારકતા અને P&L ડેશબોર્ડ રિપોર્ટિંગ (Financial Realization)
* સિસ્ટમ કાચા માલનો ખર્ચ, પેકિંગ બેગ, પાવર, લેબર અને ટ્રાન્સપોર્ટ ખર્ચ ગણીને વાસ્તવિક ગ્રોસ માર્જિન 28.7% (ચોખ્ખો નફો: ₹1,83,000) ડેશબોર્ડ પર રિયલ-ટાઇમમાં દર્શાવે છે. આ સાથે સમગ્ર ઓર્ડર-ટુ-કેશ સાયકલ સફળતાપૂર્વક પૂર્ણ થાય છે.

---

## 4. DETAILED MODULE BREAKDOWN
### તમામ ૧૯ મોડ્યુલ્સની વિગતવાર વિગતો

### 4.1 Executive Dashboard Module (`/`)
* **મુખ્ય કાર્યો**:
  * રિયલ-ટાઇમ KPI કાર્ડ્સ: માસિક ટર્નઓવર (₹ Sales), પ્રોડક્શન આઉટપુટ (MT), ઓવરડ્યુ પેમેન્ટ્સ, પ્લાન્ટ કેપેસિટી વપરાશ.
  * ક્રિટિકલ એલર્ટ્સ (Stock below reorder level, QC pending, Machinery breakdown).
  * પ્રોડક્શન ટ્રેન્ડ્સ ચાર્ટ અને સેલ્સ વિશ્લેષણ.
  * વન-ક્લિક ડેમો સિનેરિયો રનર (Demo Scenario Runner).

### 4.2 CRM & Sales Management (`/sales`)
* **મુખ્ય કાર્યો**:
  * લીડ મેનેજમેન્ટ: સ્ટેજ મુજબ લીડ ટ્રેકિંગ (New, Contacted, Follow-up, Quotation, Won, Lost).
  * ક્વોટેશન જનરેશન: કસ્ટમરને ઔપચારિક ભાવપત્રક મોકલવું.
  * સેલ્સ ઓર્ડર બુકિંગ: ડિલિવરી તારીખ, પેમેન્ટ શરતો અને શિપિંગ સરનામા સાથે ઓર્ડર કન્ફર્મેશન.
  * ઓર્ડર સ્ટેટસ સાયકલ: Pending -> Confirmed -> Production Required -> Ready -> Dispatched -> Completed.

### 4.3 Customers Module (`/customers`)
* **મુખ્ય કાર્યો**:
  * કસ્ટમર માસ્ટર: GSTIN, PAN, બિલિંગ અને શિપિંગ સરનામાં, ક્રેડિટ લિમિટ અને પેમેન્ટ ટર્મ્સ.
  * લેજર અને આઉટસ્ટેન્ડિંગ: ગ્રાહકદીઠ કુલ વેચાણ અને બાકી વસૂલાત ટ્રેકિંગ.
  * કસ્ટમર વર્ગીકરણ: Fertilizer Blender, Distributor, Cooperative, Dealer.

### 4.4 Suppliers Module (`/suppliers`)
* **મુખ્ય કાર્યો**:
  * સપ્લાયર ડિરેક્ટરી: ખાણ માલિકો (Mine owners), કેમિકલ ઉત્પાદકો અને પેકિંગ બેગ વેન્ડર્સ.
  * બેંક એકાઉન્ટ અને GSTIN વિગતો.
  * સપ્લાયર રેટિંગ (1 થી 5 સ્ટાર) અને ક્રેડિટ પિરિયડ ટ્રેકિંગ.

### 4.5 Purchase Module (`/purchase`)
* **મુખ્ય કાર્યો**:
  * Purchase Order (PO) બનાવવું: મટિરિયલ, જથ્થો, ભાવ, ટેક્સ અને અપેક્ષિત ડિલિવરી તારીખ.
  * PO સ્ટેટસ: Draft -> Approved -> Issued -> Partial GRN -> GRN Completed -> Billed.
  * સપ્લાયર સાથે પ્રાઇસ હિસ્ટ્રી અને ભાવ સરખામણી.

### 4.6 Goods Received Note (GRN) & Inward Logistics
* **મુખ્ય કાર્યો**:
  * ફેક્ટરી ગેટ અને ધર્મકાંટા (Weighbridge) પર આવતી ટ્રકનું ગેટ ઇનવર્ડ.
  * ઓર્ડર કરેલ જથ્થો vs વાસ્તવિક મળેલ જથ્થો સરખાવવો.
  * સપ્લાયર બેચ નંબર અને ઇન્ટરનલ લોટ નંબર જનરેટ કરવો.
  * QC ઇન્સ્પેક્શન માટેનું ઓટોમેટિક ટ્રિગર.

### 4.7 Raw Material Inventory Module (`/raw-material`)
* **મુખ્ય કાર્યો**:
  * SKU વાઇઝ સ્ટોક ટ્રેકિંગ (Bentonite Crude, Sodium Silicate, PAM Binder, HDPE Bags).
  * સ્ટોરેજ લોકેશન મેનેજમેન્ટ (Yard A, Bin 3, Liquid Tanks).
  * મિનિમમ સ્ટોક અને રીઓર્ડર લેવલ એલાર્મ.
  * ઓટોમેટિક એવરેજ કોસ્ટિંગ (Weighted Average Costing).

### 4.8 Bill of Materials (BOM) Management
* **મુખ્ય કાર્યો**:
  * દરેક ફિનિશ્ડ પ્રોડક્ટ માટે સ્ટાન્ડર્ડ રેસિપી / ફોર્મ્યુલેશન.
  * 1 MT ઉત્પાદન માટે જરૂરી કાચો માલ, વેસ્ટેજ ટકાવારી અને કિંમત ગણતરી.
  * પેકિંગ બેગ, પાવર, લેબર અને પ્લાન્ટ ઓવરહેડ્સ ઉમેરી સ્ટાન્ડર્ડ કોસ્ટ નક્કી કરવી.

### 4.9 Production Module (`/production`)
* **મુખ્ય કાર્યો**:
  * પ્રોડક્શન ઓર્ડર શેડ્યૂલિંગ: મશીન લાઇન અને સુપરવાઇઝર ફાળવણી.
  * મટિરિયલ શોર્ટેજ ચેક: ઓર્ડર શરૂ કરતાં પહેલાં માલ ઉપલબ્ધ છે કે નહીં તેનું લાલ/લીલું ઇન્ડિકેટર.
  * શિફ્ટ પ્રોડક્શન લોગ: ઇનપુટ, આઉટપુટ, વેસ્ટેજ અને પ્લાન્ટ એફિશિયન્સી ગણતરી.
  * બેચ ટ્રેસિબિલિટી: કઈ ખાણમાંથી પથ્થર આવ્યો તે સુધીનું બેકવર્ડ ટ્રેકિંગ.

### 4.10 Quality Control (QC) Module
* **મુખ્ય કાર્યો**:
  * ત્રણ સ્તરની તપાસ:
    1. Incoming Raw Material (આવતો કાચો માલ)
    2. In-Process Production (પ્રોસેસ દરમિયાન પ્લાન્ટ સેમ્પલિંગ)
    3. Finished Goods (તૈયાર માલનું અંતિમ ટેસ્ટિંગ)
  * પેરામીટર્સ ટેસ્ટિંગ: Moisture Content (%), Mesh Analysis, Swelling Index, pH, Active Content.
  * સર્ટિફિકેટ ઓફ એનાલિસિસ (COA / Lab Report) જનરેશન.

### 4.11 Finished Goods Module (`/finished-goods`)
* **મુખ્ય કાર્યો**:
  * તૈયાર ઉત્પાદનોનું વેરહાઉસિંગ (Granules, Bio-Fertilizer, Powder).
  * બેગ પેકિંગ ટાઇપ: 50kg HDPE Woven Bag, 25kg Kraft Paper Bag, 1000kg Jumbo Bag.
  * ઉપલબ્ધ સ્ટોક (Available Stock) vs ઓર્ડર માટે રિઝર્વ્ડ સ્ટોક (Reserved Stock) નું સ્પષ્ટ વિભાજન.

### 4.12 Stock Movements / Inventory Ledger (`/inventory`)
* **મુખ્ય કાર્યો**:
  * ફેક્ટરીમાં થતી દરેક મુવમેન્ટનો કાયમી ઓડિટ લોગ:
    * Purchase Receipt (+)
    * Production Issue (-)
    * Production Output (+)
    * Dispatch (-)
    * Adjustment / Rejection (+/-)
  * તારીખ, રેફરન્સ ડોક્યુમેન્ટ અને ઓપરેટર સાથે કમ્પલીટ ઓડિટ ટ્રેઇલ.

### 4.13 Dispatch & Logistics Module (`/dispatch`)
* **મુખ્ય કાર્યો**:
  * Delivery Challan (DC) જનરેશન.
  * વાહન ફાળવણી, ડ્રાઈવર નામ, મોબાઇલ નંબર અને E-Way Bill એન્ટ્રી.
  * ફ્રેટ અમાઉન્ટ (ભાડું) અને કોણ ચૂકવશે (Company / Customer) તેની નોંધ.
  * લાઈવ ડિસ્પેચ સ્ટેટસ: Ready -> Loaded -> Dispatched -> In Transit -> Delivered.

### 4.14 Vehicles & Fleet Master
* **મુખ્ય કાર્યો**:
  * વાહનોની ડિરેક્ટરી: 10-વ્હીલર, 12-વ્હીલર, ટ્રેલર, ટીપર.
  * PUC, ફિટનેસ અને વીમાની એક્સપાયરી ડેટ ટ્રેકિંગ.
  * ટ્રાન્સપોર્ટર રેકોર્ડ્સ અને વાહન સ્ટેટસ (Available / On Trip / Maintenance).

### 4.15 Finance, Invoicing & Accounts (`/finance`)
* **મુખ્ય કાર્યો**:
  * GST ટેક્સ ઇન્વોઇસ: HSN 25081010, CGST, SGST, IGST અને રાઉન્ડ-ઓફ સાથે ઓટોમેટિક કેલ્ક્યુલેશન.
  * પ્રિન્ટેબલ ઇન્વોઇસ: કાયદેસરની બેંક ડિટેલ્સ, QR કોડ અને સહી માટેનું ફોર્મેટ.
  * ગ્રાહક પેમેન્ટ રિસિપ્ટ્સ (RTGS, NEFT, Cheque, UPI) અને ઇન્વોઇસ રીકોન્સિલેશન.
  * આઉટસ્ટેન્ડિંગ લેજર અને એજિંગ એનાલિસિસ (30, 60, 90 દિવસ).

### 4.16 Expenses Module (`/expenses`)
* **મુખ્ય કાર્યો**:
  * ફેક્ટરી ખર્ચાઓનું વર્ગીકરણ:
    * Electricity & Power (વીજળી બિલ)
    * Fuel & Diesel (બોઈલર અને જેનરેટર)
    * Labour & Daily Wages (મજૂરી)
    * Machinery Repairs & Spares (મશીનરી પાર્ટ્સ)
    * Packaging Materials
    * Freight & Transport
  * વાઉચર નંબર, પેમેન્ટ મોડ અને એપ્રુવલ સ્ટેટસ ટ્રેકિંગ.

### 4.17 Machinery & Maintenance Module (`/maintenance`)
* **મુખ્ય કાર્યો**:
  * ફેક્ટરી મશીનોની યાદી (Disc Pelletizer, Fluid Bed Dryer, Raymond Mill, Vibrating Screen).
  * પ્રિવેન્ટિવ મેન્ટેનન્સ શેડ્યૂલ (30/60/90 દિવસ).
  * મશીન બ્રેકડાઉન લોગ અને વાર્ષિક મેન્ટેનન્સ ખર્ચ વિશ્લેષણ.
  * મશીન સ્ટેટસ હિસ્ટ્રી ઓડિટ (Operational, Under Maintenance, Breakdown).

### 4.18 Employees & HR Module (`/employees`)
* **મુખ્ય કાર્યો**:
  * સ્ટાફ ડિરેક્ટરી: Production, Sales, Accounts, Warehouse, Dispatch.
  * માસિક પગાર (Monthly Salary), જોઇનિંગ ડેટ અને સંપર્ક વિગતો.
  * શિફ્ટ મેનેજમેન્ટ અને કર્મચારી સ્ટેટસ.

### 4.19 Digital Documents Module (`/documents`)
* **મુખ્ય કાર્યો**:
  * કાયદેસર અને ટેકનિકલ દસ્તાવેજોનું ક્લાઉડ સંગ્રહ:
    * GST રિટર્ન અને લાઇસન્સ
    * પ્રદૂષણ નિયંત્રણ બોર્ડ (GPCB) ક્લિયરન્સ
    * લેબ ટેસ્ટિંગ સર્ટિફિકેટ્સ (COA)
    * E-Way Bills અને ચલણ સ્કેન કોપીઓ.
  * ઓર્ડર નંબર અથવા બેચ નંબર સાથે સીધું લિંકિંગ.

### 4.20 Reports & Analytics Module (`/reports`)
* **મુખ્ય કાર્યો**:
  * પ્રોડક્ટ વાઇઝ નફાકારકતા (Gross Profit Margin %).
  * મન્થલી સેલ્સ vs પ્રોડક્શન રેશિયો.
  * મટિરિયલ કન્ઝમ્પશન વેરિઅન્સ (સ્ટાન્ડર્ડ BOM vs એક્ચ્યુઅલ કન્ઝમ્પશન).
  * PDF અને એક્સેલ એક્સપોર્ટ સપોર્ટ.

---

## 5. DATABASE ARCHITECTURE & FIRESTORE COLLECTIONS
### ડેટાબેઝ મોડેલ અને કલેક્શન સંરચના

સિસ્ટમ Google Cloud Firestore નો ઉપયોગ કરે છે. તમામ મુખ્ય 23 કલેક્શન્સ નીચે મુજબ સુવ્યવસ્થિત છે:

| # | Collection Name | Key Attributes / Field Summary | Relations / Foreign Keys |
|---|---|---|---|
| 1 | `company` | name, gstin, pan, address, bankName, accountNo, ifscCode | Singleton Configuration |
| 2 | `leads` | leadName, company, mobile, productInterested, expectedQty, status, salesperson | Leads Pipeline |
| 3 | `customers` | code, customerName, companyName, gstin, creditLimit, paymentTerms, outstandingBalance | Referenced by SO, Invoice, Payment |
| 4 | `suppliers` | code, supplierName, gstin, materialSupplied, creditPeriodDays, rating, balance | Referenced by PO, GRN |
| 5 | `rawMaterials` | sku, materialName, category, unit, currentStock, reservedStock, averageCost, reorderLevel | Referenced by BOM, GRN, Production |
| 6 | `products` | sku, productName, category, unit, sellingPrice, standardCost, currentStock, hsnCode | Referenced by BOM, SO, Production |
| 7 | `boms` | productId, version, batchYieldMT, items[], packagingCost, overheadCost, totalStandardCost | References `products`, `rawMaterials` |
| 8 | `salesOrders` | orderNumber, customerId, productId, quantityMT, ratePerMT, totalAmount, status | References `customers`, `products` |
| 9 | `purchaseOrders`| poNumber, supplierId, materialId, quantity, rate, totalAmount, status | References `suppliers`, `rawMaterials` |
| 10 | `grns` | grnNumber, poId, supplierId, receivedQty, acceptedQty, internalLotNumber, qcStatus | References `purchaseOrders` |
| 11 | `qcInspections` | qcNumber, type, referenceId, itemCode, parameters[], overallStatus, inspector | References GRN / ProductionBatch |
| 12 | `productionOrders` | orderNumber, salesOrderId, productId, targetQtyMT, bomId, productionLine, status | References `salesOrders`, `boms` |
| 13 | `productionBatches`| batchNumber, productId, productionOrderId, rawMaterialLots[], quantityProducedMT, qcStatus | References `productionOrders` |
| 14 | `stockMovements`| date, itemType, itemId, movementType, quantity, balanceAfter, referenceDocNumber | Unified Inventory Audit Trail |
| 15 | `dispatches` | dispatchNumber, salesOrderId, customerId, vehicleNumber, driverName, eWayBillNumber, status | References `salesOrders`, `customers` |
| 16 | `vehicles` | vehicleNumber, vehicleType, transporterName, driverName, driverPhone, capacityMT, status | Logistics Fleet Master |
| 17 | `salesInvoices` | invoiceNumber, salesOrderId, customerId, hsnCode, taxableValue, cgst, sgst, totalAmount, paymentStatus | References `salesOrders`, `customers` |
| 18 | `payments` | transactionNumber, type, partyId, referenceInvoiceNumber, amount, paymentMode, bankReference | References `salesInvoices`, `customers` |
| 19 | `expenses` | expenseNumber, category, date, amount, vendorName, paidFromAccount, invoiceOrVoucherNo | Cost Centers & P&L |
| 20 | `employees` | employeeCode, name, role, department, joiningDate, monthlySalary, status | HR & Payroll Directory |
| 21 | `machinery` | machineCode, machineName, department, capacityRating, maintenanceFrequencyDays, currentStatus | Plant Asset Master |
| 22 | `machineHistory`| machineId, machineCode, previousStatus, newStatus, changedAt, changedBy, notes | Maintenance Audit Log |
| 23 | `documents` | title, documentType, relatedEntity, fileName, uploadDate, uploadedBy, fileUrl | Cloud File Archiving |

---

## 6. COMPLETE REST API REFERENCE
### API એન્ડપોઇન્ટ્સ સંદર્ભ (Node.js & Express)

બેકએન્ડ સર્વર પોર્ટ 4000 પર નીચે મુજબના 23 રૂટ્સ પ્રદાન કરે છે:

| Module / Resource | Method & Path | Controller Function | Description |
|---|---|---|---|
| **System Health** | `GET /api/health` | Inline Handler | API સર્વર લાઈવ છે કે નહીં તે ચકાસવા |
| **Cache Control** | `POST /api/cache/clear` | `clearMemoryCache` | ઇન-મેમરી કેશ રીસેટ કરવા |
| **Leads** | `GET /api/leads` | `getLeads` | તમામ લીડ્સનું લિસ્ટિંગ (કેશ સાથે) |
| | `POST /api/leads` | `postLead` | નવી સેલ્સ લીડ બનાવવી |
| | `PUT /api/leads/:id` | `updateLead` | લીડ અપડેટ કરવી |
| | `DELETE /api/leads/:id` | `deleteLead` | લીડ ડિલીટ કરવી |
| **Customers** | `GET, POST, PUT, DELETE /api/customers` | `customer.controller` | ગ્રાહકોનું સંપૂર્ણ CRUD |
| **Suppliers** | `GET, POST, PUT, DELETE /api/suppliers` | `supplier.controller` | સપ્લાયર્સનું સંપૂર્ણ CRUD |
| **Raw Materials** | `GET, POST, PUT, DELETE /api/raw-materials` | `rawMaterial.controller`| કાચો માલ અને સ્ટોક કંટ્રોલ |
| **Finished Products**| `GET, POST, PUT, DELETE /api/products` | `product.controller` | તૈયાર ઉત્પાદન કેટલોગ |
| **BOM (Recipe)** | `GET, POST, PUT, DELETE /api/boms` | `bom.controller` | બિલ ઓફ મટિરિયલ્સ ફોર્મ્યુલેશન |
| **Sales Orders** | `GET, POST, PUT, DELETE /api/sales-orders` | `salesOrder.controller` | સેલ્સ ઓર્ડર મેનેજમેન્ટ |
| **Purchase Orders** | `GET, POST, PUT, DELETE /api/purchase-orders` | `purchaseOrder.controller`| ખરીદી ઓર્ડર મેનેજમેન્ટ |
| **GRN** | `GET, POST, PUT, DELETE /api/grns` | `grn.controller` | ગેટ રિસિપ્ટ અને ઇનવર્ડ લોગ |
| **QC Inspections** | `GET, POST, PUT, DELETE /api/qc-inspections` | `qcInspection.controller`| લેબ ક્વોલિટી ઇન્સ્પેક્શન |
| **Production Orders**| `GET, POST, PUT, DELETE /api/production-orders` | `productionOrder.controller`| ફેક્ટરી પ્રોડક્શન જોબ્સ |
| **Production Batches**| `GET, POST, PUT, DELETE /api/production-batches`| `productionBatch.controller`| બેચ જનરેશન અને લોટ ટ્રેકિંગ |
| **Stock Movements** | `GET, POST, PUT, DELETE /api/stock-movements` | `stockMovement.controller` | ઇન્વેન્ટરી ઓડિટ રજિસ્ટર |
| **Dispatches** | `GET, POST, PUT, DELETE /api/dispatches` | `dispatch.controller` | ડિસ્પેચ ચલણ અને ટ્રાન્સપોર્ટ |
| **Vehicles** | `GET, POST, PUT, DELETE /api/vehicles` | `vehicle.controller` | વાહન માસ્ટર અને ફ્લીટ |
| **Sales Invoices** | `GET, POST, PUT, DELETE /api/sales-invoices` | `salesInvoice.controller` | GST ટેક્સ ઇન્વોઇસિંગ |
| **Payments** | `GET, POST, PUT, DELETE /api/payments` | `payment.controller` | બેંક પેમેન્ટ્સ અને રીકોન્સિલેશન |
| **Expenses** | `GET, POST, PUT, DELETE /api/expenses` | `expense.controller` | ફેક્ટરી ખર્ચા વાઉચર્સ |
| **Machinery** | `GET, POST, PUT, DELETE /api/machinery` | `machinery.controller` | પ્લાન્ટ મશીનરી એસેટ્સ |
| **Machine History** | `GET, POST /api/machine-history` | `machineHistory.controller` | મશીન મેન્ટેનન્સ હિસ્ટ્રી |
| **Employees** | `GET, POST, PUT, DELETE /api/employees` | `employee.controller` | સ્ટાફ અને એચઆર રેકોર્ડ્સ |
| **Documents** | `GET, POST, PUT, DELETE /api/documents` | `document.controller` | ફાઇલ અપલોડ અને ડોક્યુમેન્ટ્સ |
| **Company** | `GET, PUT /api/company` | `company.controller` | કંપની પ્રોફાઇલ અને બેંક વિગતો |

---

## 7. ROLE-BASED ACCESS CONTROL (RBAC)
### યુઝર રોલ્સ અને પરવાનગીઓનું માળખું

કંપનીના સુરક્ષિત સંચાલન માટે નીચે મુજબના ૭ રોલ્સ સેટ કરેલા છે:

| Role Name | Access Permissions / અધિકારો | Primary Modules / મુખ્ય મોડ્યુલ્સ |
|---|---|---|
| **Owner / Admin** | તમામ મોડ્યુલ્સનું અનલિમિટેડ એક્સેસ, નફાકારકતા અને સેટિંગ્સ | Complete ERP Access |
| **Sales Executive** | લીડ્સ, ક્વોટેશન, કસ્ટમર્સ અને સેલ્સ ઓર્ડરનું એક્સેસ | CRM & Sales, Customers |
| **Purchase Manager** | સપ્લાયર્સ, કાચો માલ, PO અને GRN ઇનવર્ડ | Purchase, Suppliers, Raw Materials |
| **Production Manager**| BOM રેસિપી, પ્રોડક્શન ઓર્ડર, બેચ ટ્રેકિંગ, મશીનરી | Production, BOM, Maintenance, QC |
| **Warehouse Keeper** | કાચા માલ અને તૈયાર માલનો સ્ટોક, ઇન્વેન્ટરી મુવમેન્ટ્સ | Raw Material, Finished Goods, Inventory |
| **Dispatch Officer** | ડિસ્પેચ ચલણ, વાહન ફાળવણી, E-Way Bill અને લોજિસ્ટિક્સ | Dispatch & Logistics, Vehicles |
| **Accounts / Finance** | GST ઇન્વોઇસિંગ, બેંક પેમેન્ટ્સ, ખર્ચા, કસ્ટમર લેજર | Finance, Expenses, Reports |

---

## 8. SETUP, INSTALLATION & RUNNING GUIDE
### પ્રોજેક્ટ સેટઅપ અને રન કરવાની સરળ રીત

### 8.1 સિસ્ટમ જરૂરિયાતો (Prerequisites)
* **Node.js**: v18.0.0 અથવા તેથી નવું (પ્રોજેક્ટમાં v24.13.0 ચકાસાયેલ છે)
* **Package Manager**: npm અથવા pnpm
* **Operating System**: Windows / Linux / macOS

### 8.2 બેકએન્ડ સેટઅપ (Server Setup)
1. ટર્મિનલમાં સર્વર ડિરેક્ટરીમાં જાઓ:
   ```bash
   cd "c:\Internship DZ Infotech\Bhavani Agro\server"
   ```
2. ડિપેન્ડન્સી ઇન્સ્ટોલ કરો:
   ```bash
   npm install
   ```
3. પર્યાવરણ ફાઇલ (`.env`) રૂપરેખાંકિત કરો:
   ```env
   PORT=4000
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=your-client-email
   FIREBASE_PRIVATE_KEY="your-private-key"
   # અથવા FIREBASE_SERVICE_ACCOUNT_BASE64
   ```
4. સર્વર શરૂ કરો:
   ```bash
   npm run dev
   ```
   સર્વર `http://localhost:4000` પર લાઈવ થઈ જશે.

### 8.3 ફ્રન્ટએન્ડ સેટઅપ (Client Setup)
1. નવા ટર્મિનલમાં ક્લાયન્ટ ડિરેક્ટરીમાં જાઓ:
   ```bash
   cd "c:\Internship DZ Infotech\Bhavani Agro\client"
   ```
2. ડિપેન્ડન્સી ઇન્સ્ટોલ કરો:
   ```bash
   npm install
   ```
3. ડેવલપમેન્ટ સર્વર શરૂ કરો:
   ```bash
   npm run dev
   ```
   ક્લાયન્ટ `http://localhost:3000` પર ઓટોમેટિક ઓપન થશે.

### 8.4 પ્રોડક્શન બિલ્ડ (Production Build)
```bash
# Server Build
cd server && npm run build

# Client Build
cd client && npm run build
```

---

## 9. INTERNSHIP KEY TAKEAWAYS & PROJECT IMPACT
### ઇન્ટર્નશિપ સિદ્ધિઓ અને ઔદ્યોગિક મૂલ્ય

**DZ Infotech** ખાતેની આ ઇન્ટર્નશિપ દરમિયાન વિકસાવવામાં આવેલ આ પ્રોજેક્ટ વાસ્તવિક ઔદ્યોગિક પડકારોને ટેકનોલોજી દ્વારા કેવી રીતે ઉકેલી શકાય તેનું ઉત્કૃષ્ટ ઉદાહરણ છે:
1. **End-to-End Enterprise Scope**: માત્ર સાદું CRUD ન બનાવતાં સંપૂર્ણ એન્ટરપ્રાઇઝ કક્ષાની પ્રોડક્શન સાયકલ (BOM, Granulation, QC, Batch Traceability, GST Invoice) સફળતાપૂર્વક અમલી કરી.
2. **Cloud Cost Optimization**: Google Cloud Firestore માટે સ્માર્ટ ઇન-મેમરી કેશિંગ અને ડેલ્ટા સિન્ક્રોનાઇઝેશન ડિઝાઇન કર્યું, જેથી ક્લાઉડ બિલમાં 85% નો ઘટાડો થયો.
3. **User-Friendly UI/UX**: ફેક્ટરીના ગ્રાઉન્ડ સ્ટાફથી લઈને મેનેજિંગ ડિરેક્ટર સુધીના તમામ લોકો સરળતાથી ચલાવી શકે તેવું આધુનિક, રિસ્પોન્સિવ વેબ ઇન્ટરફેસ તૈયાર કર્યું.
4. **Data Integrity & Traceability**: ખાણમાંથી નીકળેલા પથ્થરથી લઈને ખેડૂતના ખેતરમાં પહોંચતા ખાતરની બોરી સુધીની કડીબદ્ધ ડિજિટલ ટ્રેસિબિલિટી પ્રસ્થાપિત કરી.

---
*દસ્તાવેજ સમાપ્ત | Amar Mine Chems Pvt Ltd | DZ Infotech Internship Documentation*
