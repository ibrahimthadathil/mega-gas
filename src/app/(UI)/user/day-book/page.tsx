// "use client";
// import React, { useMemo, useState } from 'react';
// import { 
//   ArrowDownCircle, 
//   ArrowUpCircle, 
//   Wallet, 
//   Calendar, 
//   Search, 
//   Filter,
//   FileText,
//   CreditCard,
//   User,
//   ShoppingBag,
//   Eye,
//   X,
//   Coins,
//   Truck,
//   Archive,
//   CheckCircle2
// } from 'lucide-react';

// // --- Utility Functions ---

// const formatCurrency = (amount) => {
//   return new Intl.NumberFormat('en-IN', {
//     style: 'currency',
//     currency: 'INR',
//     minimumFractionDigits: 2
//   }).format(amount);
// };

// const formatDate = (dateString) => {
//   if (!dateString) return '-';
//   const date = new Date(dateString);
//   return new Intl.DateTimeFormat('en-GB', {
//     day: '2-digit',
//     month: 'short',
//     year: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit'
//   }).format(date);
// };

// // Helper to safely parse JSON strings from the API response
// const safeJSONParse = (str) => {
//   try {
//     return str ? JSON.parse(str) : [];
//   } catch (e) {
//     console.error("Failed to parse JSON", e);
//     return [];
//   }
// };

// // --- Modal Component ---
// const DenominationModal = ({ entry, onClose }) => {
//   if (!entry) return null;

//   const notes = [
//     { label: '2000', count: entry.denominations[2000] },
//     { label: '500', count: entry.denominations[500] },
//     { label: '200', count: entry.denominations[200] },
//     { label: '100', count: entry.denominations[100] },
//     { label: '50', count: entry.denominations[50] },
//     { label: '20', count: entry.denominations[20] },
//     { label: '10', count: entry.denominations[10] },
//     { label: '5', count: entry.denominations[5] },
//   ].filter(n => n.count > 0); // Only show denominations that exist

//   const totalCash = notes.reduce((sum, n) => sum + (parseFloat(n.label) * n.count), 0);

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
//       <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
//         <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
//           <div className="flex items-center gap-2">
//             <Coins className="w-5 h-5" />
//             <h3 className="font-semibold text-lg">Cash Chest Status</h3>
//           </div>
//           <button 
//             onClick={onClose}
//             className="p-1 hover:bg-indigo-500 rounded-full transition-colors"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>
        
//         <div className="p-6">
//           <div className="mb-4">
//             <p className="text-xs text-slate-500 uppercase tracking-wide font-bold">Transaction Reference</p>
//             <p className="text-slate-800 font-mono text-sm">#{entry.refId}</p>
//             <div className="flex items-center gap-2 mt-1">
//                <p className="text-sm text-slate-600">Chest: <span className="font-semibold capitalize text-indigo-600">{entry.chest}</span></p>
//                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase border border-emerald-200">
//                  {entry.status}
//                </span>
//             </div>
//           </div>

//           <div className="border rounded-lg overflow-hidden border-slate-200">
//             <table className="w-full text-sm text-left">
//               <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
//                 <tr>
//                   <th className="px-4 py-3">Note</th>
//                   <th className="px-4 py-3 text-center">Count</th>
//                   <th className="px-4 py-3 text-right">Amount</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100">
//                 {notes.length > 0 ? (
//                   notes.map((note) => (
//                     <tr key={note.label}>
//                       <td className="px-4 py-2 font-medium text-slate-700">₹{note.label}</td>
//                       <td className="px-4 py-2 text-center text-slate-600">x {note.count}</td>
//                       <td className="px-4 py-2 text-right font-mono text-slate-800">
//                         {formatCurrency(parseFloat(note.label) * note.count)}
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="3" className="px-4 py-8 text-center text-slate-400 italic">
//                       No physical cash notes recorded.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//               <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
//                 <tr>
//                   <td colSpan="2" className="px-4 py-3 text-slate-600">Total Cash In Chest</td>
//                   <td className="px-4 py-3 text-right text-indigo-700 text-base">
//                     {formatCurrency(totalCash)}
//                   </td>
//                 </tr>
//               </tfoot>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- Main Component ---

// export default function CashBook() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterType, setFilterType] = useState('all');
//   const [selectedChest, setSelectedChest] = useState('all');
//   const [selectedStatus, setSelectedStatus] = useState('all');
//   const [selectedEntry, setSelectedEntry] = useState(null);

//   // --- Raw Data Input ---
//   const rawData = [
//     {
//       "reference_id": "482067c9-b1e8-45f9-bdc2-ce76919f37db",
//       "id": "ededb8d3-3eec-495b-8f65-8e1c122390c3",
//       "chest_name": "godown",
//       "note_2000": 0,
//       "note_500": 0,
//       "note_200": 0,
//       "note_100": 0,
//       "note_50": 0,
//       "note_20": 0,
//       "note_10": 0,
//       "coin_5": 0,
//       "created_at": "2026-01-05 18:30:00+00",
//       "source_reference_type": "sales slip",
//       "total_amount": "0.00",
//       "status": "Submitted",
//       "transaction_date": "2026-01-05 18:30:00+00",
//       "account_items": "[]",
//       "expenses": "[{\"amount\": 1000.00, \"description\": \"test expenses\", \"expenses_type\": \"Workshop\"}]",
//       "line_items": "[{\"qty\": 10, \"rate\": 474, \"total\": 4740, \"product_id\": \"dbfc15f6\", \"product_name\": \"5 BLUE REFILL\"}]",
//       "delivery_boy_names": "[\"MALI\", \"MUSTHAFASAL\"]",
//       "upi_payments": "[{\"amount\": 3740, \"upi_id\": \"Q457349543@ybl\"}]",
//       "online_payments": "[]"
//     },
//     {
//       "reference_id": "ec0867c5-3720-4c1e-9f69-1dc872f75d97",
//       "id": "9c6f5af1-ec92-4903-831e-13064aa713c2",
//       "chest_name": "office",
//       "note_2000": 0,
//       "note_500": 40,
//       "note_200": 10,
//       "note_100": 20,
//       "note_50": 18,
//       "note_20": 1,
//       "note_10": 1,
//       "coin_5": 0,
//       "created_at": "2026-01-09 18:30:00+00",
//       "source_reference_type": "sales slip",
//       "total_amount": "24930.00",
//       "status": "Submitted",
//       "transaction_date": "2026-01-09 18:30:00+00",
//       "account_items": "[{\"account_id\": \"248bc55c\", \"amount_paid\": 0, \"account_name\": \"PPP\", \"amount_received\": 10000}, {\"account_id\": \"d87ed490\", \"amount_paid\": 200, \"account_name\": \"sumesh\", \"amount_received\": 0}]",
//       "expenses": "[]",
//       "line_items": "[{\"qty\": 1, \"rate\": 7080, \"total\": 7080, \"product_id\": \"c0d8aec8\", \"product_name\": \"14 NC DBC\"}, {\"qty\": 10, \"rate\": 861.5, \"total\": 8615.0, \"product_id\": \"3774c7e1\", \"product_name\": \"14 REFILL\"}]",
//       "delivery_boy_names": "[\"RAFEEK\", \"SATHAR\", \"SHIHAB\"]",
//       "upi_payments": "[{\"amount\": 100, \"upi_id\": \"Q042304486@ybl\"}, {\"amount\": 254, \"upi_id\": \"Q042304486@ybl\"}]",
//       "online_payments": "[{\"amount\": 60, \"consumer_number\": \"76rt3\"}, {\"amount\": 7, \"consumer_number\": \"rfe\"}, {\"amount\": 143, \"consumer_number\": \"1\"}]"
//     }
//   ];

//   // --- Extract Filter Options ---
//   const uniqueChests = useMemo(() => {
//     return [...new Set(rawData.map(r => r.chest_name))].filter(Boolean);
//   }, [rawData]);

//   const uniqueStatuses = useMemo(() => {
//     return [...new Set(rawData.map(r => r.status))].filter(Boolean);
//   }, [rawData]);

//   // --- Data Transformation Logic ---
//   const transactionBlocks = useMemo(() => {
//     let blocks = [];

//     rawData.forEach((record) => {
//       const date = record.transaction_date;
//       const refId = record.reference_id.substring(0, 8).toUpperCase(); 
//       const chest = record.chest_name;
//       const id = record.id;
//       const status = record.status;
//       const deliveryBoys = safeJSONParse(record.delivery_boy_names);
      
//       const denominations = {
//         2000: record.note_2000 || 0,
//         500: record.note_500 || 0,
//         200: record.note_200 || 0,
//         100: record.note_100 || 0,
//         50: record.note_50 || 0,
//         20: record.note_20 || 0,
//         10: record.note_10 || 0,
//         5: record.coin_5 || 0,
//       };

//       const items = [];

//       // 1. Line Items
//       const lineItems = safeJSONParse(record.line_items);
//       lineItems.forEach(item => {
//         items.push({
//           id: `prod-${item.product_id}-${Math.random()}`,
//           description: item.product_name,
//           subText: `${item.qty} x ${item.rate}`,
//           category: 'Sale',
//           type: 'credit', 
//           amount: parseFloat(item.total)
//         });
//       });

//       // 2. Expenses
//       const expenses = safeJSONParse(record.expenses);
//       expenses.forEach(exp => {
//         items.push({
//           id: `exp-${Math.random()}`,
//           description: exp.description || exp.expenses_type,
//           subText: exp.expenses_type,
//           category: 'Expense',
//           type: 'debit',
//           amount: parseFloat(exp.amount)
//         });
//       });

//       // 3. Accounts
//       const accounts = safeJSONParse(record.account_items);
//       accounts.forEach(acc => {
//         if (acc.amount_received > 0) {
//           items.push({
//             id: `acc-in-${acc.account_id}-${Math.random()}`,
//             description: acc.account_name,
//             subText: 'Account Deposit',
//             category: 'Account',
//             type: 'credit',
//             amount: parseFloat(acc.amount_received)
//           });
//         }
//         if (acc.amount_paid > 0) {
//           items.push({
//             id: `acc-out-${acc.account_id}-${Math.random()}`,
//             description: acc.account_name,
//             subText: 'Account Payment',
//             category: 'Account',
//             type: 'debit',
//             amount: parseFloat(acc.amount_paid)
//           });
//         }
//       });

//       // 4. UPI Payments
//       const upiPayments = safeJSONParse(record.upi_payments);
//       upiPayments.forEach(upi => {
//         items.push({
//           id: `upi-${upi.upi_id}-${Math.random()}`,
//           description: 'UPI Payment',
//           subText: upi.upi_id,
//           category: 'UPI',
//           type: 'debit',
//           amount: parseFloat(upi.amount)
//         });
//       });

//       // 5. Online Payments
//       const onlinePayments = safeJSONParse(record.online_payments);
//       onlinePayments.forEach(online => {
//         items.push({
//           id: `online-${online.consumer_number}-${Math.random()}`,
//           description: 'Online Payment',
//           subText: `Ref: ${online.consumer_number}`,
//           category: 'Online',
//           type: 'debit',
//           amount: parseFloat(online.amount)
//         });
//       });

//       // Calculate Block Totals
//       const blockReceived = items.reduce((sum, item) => item.type === 'credit' ? sum + item.amount : sum, 0);
//       const blockPaid = items.reduce((sum, item) => item.type === 'debit' ? sum + item.amount : sum, 0);

//       blocks.push({
//         id,
//         date,
//         refId,
//         chest,
//         status,
//         denominations,
//         items,
//         deliveryBoys,
//         blockReceived,
//         blockPaid
//       });
//     });

//     return blocks.sort((a, b) => new Date(b.date) - new Date(a.date));
//   }, [rawData]);

//   // --- Filtering ---
//   const filteredBlocks = useMemo(() => {
//     return transactionBlocks.map(block => {
//       // 1. Meta Filters (Chest & Status)
//       if (selectedChest !== 'all' && block.chest !== selectedChest) return null;
//       if (selectedStatus !== 'all' && block.status !== selectedStatus) return null;

//       // 2. Search Filter (Ref / Chest name / Description)
//       const metaSearchMatch = 
//         block.refId.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         block.chest.toLowerCase().includes(searchTerm.toLowerCase());

//       // If search matches block-level info, we keep the block and all items
//       // UNLESS filterType is set
      
//       // 3. Item Level Filtering (Type & Search Description)
//       const matchingItems = block.items.filter(item => {
//         // Filter by Type
//         if (filterType === 'received' && item.type !== 'credit') return false;
//         if (filterType === 'paid' && item.type !== 'debit') return false;

//         // Filter by Search (if meta didn't match already)
//         if (!metaSearchMatch && !item.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        
//         return true;
//       });

//       // Return block if it has items remaining
//       if (matchingItems.length > 0) {
//         // Recalculate block totals for the filtered view? 
//         // Usually subtotals should reflect the *transaction* total, not the filtered view total 
//         // to avoid confusion, but we pass the original block totals.
//         return { ...block, items: matchingItems };
//       }

//       return null;
//     }).filter(Boolean); // Remove nulls
//   }, [transactionBlocks, searchTerm, filterType, selectedChest, selectedStatus]);

//   // --- Totals Calculation ---
//   const totals = useMemo(() => {
//     let received = 0;
//     let paid = 0;
//     filteredBlocks.forEach(block => {
//       block.items.forEach(item => {
//         if (item.type === 'credit') received += item.amount;
//         if (item.type === 'debit') paid += item.amount;
//       });
//     });
//     return { received, paid };
//   }, [filteredBlocks]);

//   // --- Render Helpers ---
//   const getCategoryIcon = (category) => {
//     switch (category) {
//       case 'Sale': return <ShoppingBag className="w-4 h-4 text-blue-500" />;
//       case 'Expense': return <FileText className="w-4 h-4 text-red-500" />;
//       case 'Account': return <User className="w-4 h-4 text-purple-500" />;
//       case 'UPI': 
//       case 'Online': return <CreditCard className="w-4 h-4 text-orange-500" />;
//       default: return <Wallet className="w-4 h-4 text-gray-500" />;
//     }
//   };

//   const getCategoryBadgeColor = (category) => {
//     switch (category) {
//       case 'Sale': return 'bg-blue-100 text-blue-700 border-blue-200';
//       case 'Expense': return 'bg-red-100 text-red-700 border-red-200';
//       case 'Account': return 'bg-purple-100 text-purple-700 border-purple-200';
//       case 'UPI':
//       case 'Online': return 'bg-orange-100 text-orange-700 border-orange-200';
//       default: return 'bg-gray-100 text-gray-700 border-gray-200';
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-slate-800 relative">
//       <DenominationModal entry={selectedEntry} onClose={() => setSelectedEntry(null)} />

//       <div className="max-w-6xl mx-auto space-y-6">
        
//         {/* Header Section */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//           <div>
//             <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
//               <Wallet className="w-8 h-8 text-indigo-600" />
//               Cash Book & Ledger
//             </h1>
//             <p className="text-slate-500 text-sm mt-1">
//               Grouped by Chest Transactions.
//             </p>
//           </div>
          
//           <div className="flex gap-4">
//             <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 min-w-[160px]">
//               <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
//                 <ArrowDownCircle className="w-4 h-4 text-emerald-500" /> Total Received
//               </div>
//               <div className="text-xl font-bold text-emerald-600">
//                 {formatCurrency(totals.received)}
//               </div>
//             </div>
//             <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 min-w-[160px]">
//               <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
//                 <ArrowUpCircle className="w-4 h-4 text-red-500" /> Total Paid
//               </div>
//               <div className="text-xl font-bold text-red-600">
//                 {formatCurrency(totals.paid)}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Controls Section */}
//         <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col xl:flex-row justify-between items-center gap-4">
          
//           {/* Search */}
//           <div className="relative w-full xl:w-96">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//             <input 
//               type="text" 
//               placeholder="Search items, references, or chests..." 
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
//             />
//           </div>

//           {/* Filters Row */}
//           <div className="flex flex-col sm:flex-row gap-2 w-full xl:w-auto overflow-x-auto pb-1 sm:pb-0">
             
//              {/* Chest Filter */}
//             <div className="relative min-w-[140px]">
//                <Archive className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//                <select
//                 value={selectedChest}
//                 onChange={(e) => setSelectedChest(e.target.value)}
//                 className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none capitalize cursor-pointer hover:bg-slate-100 transition-colors"
//                >
//                 <option value="all">All Chests</option>
//                 {uniqueChests.map(c => <option key={c} value={c}>{c}</option>)}
//                </select>
//                <ArrowDownCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
//             </div>

//             {/* Status Filter */}
//             <div className="relative min-w-[140px]">
//                <CheckCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//                <select
//                 value={selectedStatus}
//                 onChange={(e) => setSelectedStatus(e.target.value)}
//                 className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer hover:bg-slate-100 transition-colors"
//                >
//                 <option value="all">All Status</option>
//                 {uniqueStatuses.map(s => <option key={s} value={s}>{s}</option>)}
//                </select>
//                <ArrowDownCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
//             </div>

//           </div>

//         </div>

//         {/* Table Section */}
//         <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse">
//               <thead>
//                 <tr className="bg-slate-50 border-b border-slate-200">
//                   <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider w-32 bg-slate-50">
//                     Date
//                   </th>
//                   <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider w-44 bg-slate-50">
//                     Ref / Chest
//                   </th>
//                   <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50">
//                     Description & Line Items
//                   </th>
//                   <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right w-40 bg-slate-50">
//                     Cash Paid
//                   </th>
//                   <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right w-40 bg-slate-50">
//                     Cash Received
//                   </th>
//                 </tr>
//               </thead>
//               {/* We render a tbody per Transaction Block */}
//               {filteredBlocks.length > 0 ? (
//                 filteredBlocks.map((block) => (
//                   <tbody key={block.id} className="border-b border-slate-200 hover:bg-slate-50/50 transition-colors">
//                     {block.items.length > 0 ? (
//                       block.items.map((item, index) => (
//                         <tr key={item.id} className="group">
//                           {/* Row Span Columns: Render only for the first item */}
//                           {index === 0 && (
//                             <>
//                               <td rowSpan={block.items.length} className="py-4 px-6 align-top border-r border-slate-100 bg-white">
//                                 <div className="flex flex-col sticky top-0">
//                                   <span className="text-sm font-medium text-slate-700">
//                                     {formatDate(block.date).split(',')[0]}
//                                   </span>
//                                   <span className="text-xs text-slate-400">
//                                     {formatDate(block.date).split(',')[1]}
//                                   </span>
//                                 </div>
//                               </td>
//                               <td rowSpan={block.items.length} className="py-4 px-6 align-top border-r border-slate-100 bg-white min-w-[180px]">
//                                 <div className="flex flex-col gap-2 sticky top-0">
//                                   <div className="flex items-center gap-2">
//                                     <span className="inline-flex items-center px-2 py-1 rounded text-xs font-mono bg-slate-100 text-slate-600">
//                                       #{block.refId}
//                                     </span>
//                                   </div>
//                                   <div className="text-xs text-slate-500 font-medium capitalize flex items-center gap-1">
//                                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
//                                      {block.chest}
//                                   </div>
                                  
//                                   {/* THE EYE ICON - BLOCK LEVEL */}
//                                   <button 
//                                     onClick={() => setSelectedEntry(block)}
//                                     className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors w-fit border border-indigo-100"
//                                     title="View Chest Status"
//                                   >
//                                     <Eye className="w-3.5 h-3.5" />
//                                     <span>Chest Status</span>
//                                   </button>

//                                   {/* DELIVERY BOYS */}
//                                   {block.deliveryBoys && block.deliveryBoys.length > 0 && (
//                                     <div className="mt-2">
//                                       <div className="flex items-center gap-1 text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-1">
//                                         <Truck className="w-3 h-3" /> Delivery
//                                       </div>
//                                       <div className="flex flex-wrap gap-1">
//                                         {block.deliveryBoys.map(boy => (
//                                           <span key={boy} className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-200">
//                                             {boy}
//                                           </span>
//                                         ))}
//                                       </div>
//                                     </div>
//                                   )}

//                                   {/* BLOCK SUBTOTALS */}
//                                   <div className="mt-4 pt-3 border-t border-slate-100">
//                                     <div className="flex justify-between items-center text-xs mb-1">
//                                       <span className="text-slate-500">Paid:</span>
//                                       <span className="font-mono text-red-600 font-medium">{formatCurrency(block.blockPaid)}</span>
//                                     </div>
//                                     <div className="flex justify-between items-center text-xs">
//                                       <span className="text-slate-500">Rec:</span>
//                                       <span className="font-mono text-emerald-600 font-medium">{formatCurrency(block.blockReceived)}</span>
//                                     </div>
//                                   </div>

//                                 </div>
//                               </td>
//                             </>
//                           )}
                          
//                           {/* Item Columns */}
//                           <td className="py-4 px-6 align-top border-b border-slate-50 last:border-b-0">
//                             <div className="flex items-start gap-3">
//                               <div className={`mt-1 p-1.5 rounded-full shrink-0 ${item.category === 'Expense' ? 'bg-red-50' : item.category === 'UPI' || item.category === 'Online' ? 'bg-orange-50' : 'bg-blue-50'}`}>
//                                 {getCategoryIcon(item.category)}
//                               </div>
//                               <div>
//                                 <div className="text-sm font-semibold text-slate-800">
//                                   {item.description}
//                                 </div>
//                                 <div className="flex items-center gap-2 mt-1">
//                                   <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wide ${getCategoryBadgeColor(item.category)}`}>
//                                     {item.category}
//                                   </span>
//                                   {item.subText && (
//                                     <span className="text-xs text-slate-500">
//                                       {item.subText}
//                                     </span>
//                                   )}
//                                 </div>
//                               </div>
//                             </div>
//                           </td>
//                           <td className="py-4 px-6 align-top text-right border-b border-slate-50 last:border-b-0">
//                             {item.type === 'debit' ? (
//                               <span className="font-mono font-medium text-red-600">
//                                 {formatCurrency(item.amount)}
//                               </span>
//                             ) : (
//                               <span className="text-slate-200">-</span>
//                             )}
//                           </td>
//                           <td className="py-4 px-6 align-top text-right border-b border-slate-50 last:border-b-0">
//                             {item.type === 'credit' ? (
//                               <span className="font-mono font-medium text-emerald-600">
//                                 {formatCurrency(item.amount)}
//                               </span>
//                             ) : (
//                               <span className="text-slate-200">-</span>
//                             )}
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       // Fallback if no items exist for a block (unlikely based on raw data but good for safety)
//                       <tr>
//                         <td className="py-4 px-6 align-top">{formatDate(block.date)}</td>
//                         <td className="py-4 px-6 align-top">#{block.refId}</td>
//                         <td colSpan="3" className="py-4 px-6 text-slate-400 italic">No detailed items recorded</td>
//                       </tr>
//                     )}
//                   </tbody>
//                 ))
//               ) : (
//                  <tbody>
//                   <tr>
//                     <td colSpan="5" className="py-12 text-center text-slate-500">
//                       <div className="flex flex-col items-center justify-center gap-2">
//                         <Search className="w-8 h-8 text-slate-300" />
//                         <p>No transactions found matching your criteria.</p>
//                       </div>
//                     </td>
//                   </tr>
//                  </tbody>
//               )}
//               <tfoot className="bg-slate-50 border-t border-slate-200 font-bold text-slate-800">
//                 <tr>
//                   <td colSpan="3" className="py-4 px-6 text-right uppercase text-xs tracking-wider text-slate-500">
//                     Grand Totals
//                   </td>
//                   <td className="py-4 px-6 text-right text-red-600 text-base">
//                     {formatCurrency(totals.paid)}
//                   </td>
//                   <td className="py-4 px-6 text-right text-emerald-600 text-base">
//                     {formatCurrency(totals.received)}
//                   </td>
//                 </tr>
//                 <tr>
//                   <td colSpan="3" className="py-4 px-6 text-right uppercase text-xs tracking-wider text-slate-500 border-t border-slate-200">
//                     Net Balance
//                   </td>
//                   <td colSpan="2" className={`py-4 px-6 text-right text-lg border-t border-slate-200 ${(totals.received - totals.paid) >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
//                     {formatCurrency(totals.received - totals.paid)}
//                   </td>
//                 </tr>
//               </tfoot>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Wallet,
  Calendar,
  Search,
  Filter,
  FileText,
  CreditCard,
  User,
  ShoppingBag,
  Eye,
  X,
  Coins,
  Truck,
  Archive,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { UseRQ } from '@/hooks/useReactQuery';
import { getDayBook } from '@/services/client_api-Service/user/day-book/day-book-api';

// ─── Utility Functions ────────────────────────────────────────────────
const formatCurrency = (amount?: number | string) => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (typeof num !== 'number' || isNaN(num)) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(num);
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const getTodayDateString = () => new Date().toISOString().split('T')[0];

const safeJSONParse = <T = any>(str: any): T[] => {
  if (Array.isArray(str)) return str;
  if (typeof str !== 'string') return [];
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

// ─── Modal ─────────────────────────────────────────────────────────────
const DenominationModal = ({ entry, onClose }: { entry: any; onClose: () => void }) => {
  if (!entry) return null;

  const notes = [
    { label: '2000', count: entry.denominations?.[2000] ?? 0 },
    { label: '500',  count: entry.denominations?.[500]  ?? 0 },
    { label: '200',  count: entry.denominations?.[200]  ?? 0 },
    { label: '100',  count: entry.denominations?.[100]  ?? 0 },
    { label: '50',   count: entry.denominations?.[50]   ?? 0 },
    { label: '20',   count: entry.denominations?.[20]   ?? 0 },
    { label: '10',   count: entry.denominations?.[10]   ?? 0 },
    { label: '5',    count: entry.denominations?.[5]    ?? 0 },
  ].filter(n => n.count > 0);

  const totalCash = notes.reduce((sum, n) => sum + (Number(n.label) * n.count), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5" />
            <h3 className="font-semibold text-lg">Cash Chest Status</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-indigo-500 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-5">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wide">Transaction Ref</p>
            <p className="font-mono text-sm text-slate-800">#{entry.refId}</p>
            <div className="flex items-center gap-3 mt-1.5">
              <p className="text-sm text-slate-600">
                Chest: <span className="font-semibold text-indigo-600 capitalize">{entry.chest}</span>
              </p>
              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                {entry.status}
              </span>
            </div>
          </div>

          <div className="border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr className="border-b">
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Note</th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-600">Count</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-600">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {notes.length > 0 ? (
                  notes.map(note => (
                    <tr key={note.label}>
                      <td className="px-4 py-2.5 font-medium">₹{note.label}</td>
                      <td className="px-4 py-2.5 text-center text-slate-600">× {note.count}</td>
                      <td className="px-4 py-2.5 text-right font-mono">
                        {formatCurrency(Number(note.label) * note.count)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-10 text-center text-slate-400 italic">
                      No cash denominations recorded
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-slate-50 font-semibold">
                <tr className="border-t">
                  <td colSpan={2} className="px-4 py-3 text-slate-700">Total Cash</td>
                  <td className="px-4 py-3 text-right text-indigo-700">
                    {formatCurrency(totalCash)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────
export default function CashBook() {
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { register, watch, resetField } = useForm({
    defaultValues: {
      date: getTodayDateString(),
      chest: 'all',
      status: 'all',
      types: 'all',
      search: ''
    }
  });

  const filters = watch();
  const { date, chest, status, types, search } = filters;

  // ─── API ───────────────────────────────────────────────────────────────
  const { data: daybook, isLoading, error } = UseRQ(
    ['daybook', date, chest, status, types],
    () => getDayBook({
      date: date || undefined,
      chest: chest === 'all' ? undefined : chest,
      status: status === 'all' ? undefined : status,
      types: types === 'all' ? undefined : types
    })
  );

  const rawData = useMemo(() => daybook?.data ?? [], [daybook]);

  // ─── Filter Options ────────────────────────────────────────────────────
  const uniqueChests = useMemo(() =>
    [...new Set(rawData.map(r => r.chest_name).filter(Boolean))],
  [rawData]);

  const uniqueStatuses = useMemo(() =>
    [...new Set(rawData.map(r => r.status).filter(Boolean))],
  [rawData]);

  // ─── Transform Data ────────────────────────────────────────────────────
  const transactionBlocks = useMemo(() => {
    const blocks = rawData.map(record => {
      const refId = (record.reference_id ?? '').substring(0, 8).toUpperCase();
      const chest = record.chest_name ?? 'unknown';
      const statusVal = record.status ?? 'Unknown';

      const denominations = {
        2000: record.note_2000 ?? 0,
        500:  record.note_500  ?? 0,
        200:  record.note_200  ?? 0,
        100:  record.note_100  ?? 0,
        50:   record.note_50   ?? 0,
        20:   record.note_20   ?? 0,
        10:   record.note_10   ?? 0,
        5:    record.coin_5    ?? 0,
      };

      const items: any[] = [];

      // Line items
      safeJSONParse(record.line_items).forEach((item: any) => {
        items.push({
          id: `prod-${item.product_id ?? 'na'}-${Math.random().toString(36).slice(2)}`,
          description: item.product_name ?? 'Unknown Product',
          subText: item.qty && item.rate ? `${item.qty} × ${item.rate}` : '',
          category: 'Sale',
          type: 'credit',
          amount: Number(item.total) || 0
        });
      });

      // Expenses
      safeJSONParse(record.expenses).forEach((exp: any) => {
        items.push({
          id: `exp-${Math.random().toString(36).slice(2)}`,
          description: exp.description || exp.expenses_type || 'Expense',
          subText: exp.expenses_type || '',
          category: 'Expense',
          type: 'debit',
          amount: Number(exp.amount) || 0
        });
      });

      // Accounts
      safeJSONParse(record.account_items).forEach((acc: any) => {
        if (Number(acc.amount_received) > 0) {
          items.push({
            id: `acc-in-${acc.account_id ?? 'na'}-${Math.random().toString(36).slice(2)}`,
            description: acc.account_name ?? 'Account',
            subText: 'Received',
            category: 'Account',
            type: 'credit',
            amount: Number(acc.amount_received)
          });
        }
        if (Number(acc.amount_paid) > 0) {
          items.push({
            id: `acc-out-${acc.account_id ?? 'na'}-${Math.random().toString(36).slice(2)}`,
            description: acc.account_name ?? 'Account',
            subText: 'Paid',
            category: 'Account',
            type: 'debit',
            amount: Number(acc.amount_paid)
          });
        }
      });

      // UPI
      safeJSONParse(record.upi_payments).forEach((upi: any) => {
        items.push({
          id: `upi-${upi.upi_id ?? 'na'}-${Math.random().toString(36).slice(2)}`,
          description: 'UPI Payment',
          subText: upi.upi_id ?? '',
          category: 'UPI',
          type: 'debit',
          amount: Number(upi.amount) || 0
        });
      });

      // Online payments
      safeJSONParse(record.online_payments).forEach((online: any) => {
        items.push({
          id: `online-${online.consumer_number ?? 'na'}-${Math.random().toString(36).slice(2)}`,
          description: 'Online Payment',
          subText: online.consumer_number ? `Ref: ${online.consumer_number}` : '',
          category: 'Online',
          type: 'debit',
          amount: Number(online.amount) || 0
        });
      });

      const blockReceived = items.reduce((sum, i) => i.type === 'credit' ? sum + i.amount : sum, 0);
      const blockPaid     = items.reduce((sum, i) => i.type === 'debit'  ? sum + i.amount : sum, 0);

      return {
        id: record.id,
        date: record.transaction_date,
        refId,
        chest,
        status: statusVal,
        denominations,
        items,
        deliveryBoys: safeJSONParse(record.delivery_boy_names),
        blockReceived,
        blockPaid
      };
    });

    return blocks.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [rawData]);

  // ─── Client-side Filters ───────────────────────────────────────────────
  const searchedBlocks = useMemo(() => {
    if (!search.trim()) return transactionBlocks;
    const term = search.toLowerCase();
    return transactionBlocks.filter(block =>
      block.refId.toLowerCase().includes(term) ||
      block.chest.toLowerCase().includes(term) ||
      block.items.some(item => item.description.toLowerCase().includes(term))
    );
  }, [transactionBlocks, search]);

  const typeFilteredBlocks = useMemo(() => {
    if (types === 'all') return searchedBlocks;
    return searchedBlocks
      .map(block => {
        const matching = block.items.filter(item => {
          if (types === 'received' && item.type !== 'credit') return false;
          if (types === 'paid'    && item.type !== 'debit')  return false;
          return true;
        });
        return matching.length > 0 ? { ...block, items: matching } : null;
      })
      .filter(Boolean) as typeof transactionBlocks;
  }, [searchedBlocks, types]);

  // ─── Pagination ────────────────────────────────────────────────────────
  const paginatedBlocks = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return typeFilteredBlocks.slice(start, start + itemsPerPage);
  }, [typeFilteredBlocks, currentPage]);

  const totalPages = Math.ceil(typeFilteredBlocks.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [date, chest, status, types, search]);

  // ─── Totals (based on filtered view) ───────────────────────────────────
  const totals = useMemo(() => {
    let received = 0;
    let paid = 0;
    typeFilteredBlocks.forEach(b => {
      b.items.forEach(i => {
        if (i.type === 'credit') received += i.amount;
        if (i.type === 'debit')  paid     += i.amount;
      });
    });
    return { received, paid };
  }, [typeFilteredBlocks]);

  // ─── Icons & Colors ────────────────────────────────────────────────────
  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Sale':    return <ShoppingBag className="w-4 h-4 text-blue-500" />;
      case 'Expense': return <FileText   className="w-4 h-4 text-red-500" />;
      case 'Account': return <User       className="w-4 h-4 text-purple-500" />;
      case 'UPI':
      case 'Online':  return <CreditCard className="w-4 h-4 text-orange-500" />;
      default:        return <Wallet     className="w-4 h-4 text-gray-500" />;
    }
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'Sale':    return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Expense': return 'bg-red-100 text-red-700 border-red-200';
      case 'Account': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'UPI':
      case 'Online':  return 'bg-orange-100 text-orange-700 border-orange-200';
      default:        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading cash book...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-lg text-center">
          <p className="text-red-700 font-semibold mb-2">Failed to load data</p>
          <p className="text-slate-600 text-sm">{(error as any)?.message || 'Unknown error'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <DenominationModal entry={selectedEntry} onClose={() => setSelectedEntry(null)} />

      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Wallet className="w-8 h-8 md:w-10 md:h-10 text-indigo-600" />
              Cash Book
            </h1>
            <p className="text-slate-600 mt-1">
              {typeFilteredBlocks.length} transaction{typeFilteredBlocks.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border min-w-[160px]">
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                <ArrowDownCircle className="w-4 h-4 text-emerald-500" />
                Received
              </div>
              <div className="text-xl font-bold text-emerald-600">
                {formatCurrency(totals.received)}
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border min-w-[160px]">
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                <ArrowUpCircle className="w-4 h-4 text-red-500" />
                Paid
              </div>
              <div className="text-xl font-bold text-red-600">
                {formatCurrency(totals.paid)}
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-5 rounded-xl shadow-sm border space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                {...register('search')}
                placeholder="Search reference, chest, item..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              />
            </div>

            <div className="relative min-w-[200px]">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="date"
                {...register('date')}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-lg cursor-pointer focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="relative min-w-[150px]">
              <Archive className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                {...register('chest')}
                className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border rounded-lg appearance-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="all">All Chests</option>
                {uniqueChests.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="relative min-w-[150px]">
              <CheckCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                {...register('status')}
                className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border rounded-lg appearance-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="all">All Status</option>
                {uniqueStatuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="relative min-w-[150px]">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                {...register('types')}
                className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border rounded-lg appearance-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="all">All Types</option>
                <option value="received">Cash Received</option>
                <option value="paid">Cash Paid</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-slate-50 border-b">
                  <th className="py-4 px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider w-32">Date</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider w-56">Ref / Chest</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider">Description</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right w-44">Paid</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right w-44">Received</th>
                </tr>
              </thead>

              <tbody>
                {paginatedBlocks.length > 0 ? (
                  paginatedBlocks.map(block => {
                    if (block.items.length === 0) return null;

                    return (
                      <React.Fragment key={block.id}>
                        {block.items.map((item, idx) => (
                          <tr key={item.id} className="group border-b last:border-b-0 hover:bg-slate-50/70">
                            {idx === 0 && (
                              <>
                                <td rowSpan={block.items.length} className="py-5 px-6 align-top border-r bg-white/80">
                                  <div className="flex flex-col">
                                    <span className="text-sm font-medium text-slate-800">
                                      {formatDate(block.date).split(',')[0]}
                                    </span>
                                    <span className="text-xs text-slate-500">
                                      {formatDate(block.date).split(',')[1] || ''}
                                    </span>
                                  </div>
                                </td>

                                <td rowSpan={block.items.length} className="py-5 px-6 align-top border-r bg-white/80">
                                  <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded">
                                        #{block.refId}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm">
                                      <span className="w-2 h-2 rounded-full bg-slate-400" />
                                      <span className="font-medium capitalize">{block.chest}</span>
                                    </div>

                                    <button
                                      onClick={() => setSelectedEntry(block)}
                                      className="flex items-center gap-2 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded border border-indigo-100 w-fit mt-1"
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                      Chest Status
                                    </button>

                                    {block.deliveryBoys?.length > 0 && (
                                      <div className="mt-2">
                                        <div className="text-[10px] uppercase text-slate-500 font-bold mb-1 flex items-center gap-1.5">
                                          <Truck className="w-3 h-3" />
                                          Delivery Boys
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                          {block.deliveryBoys.map((boy: string) => (
                                            <span
                                              key={boy}
                                              className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded border"
                                            >
                                              {boy}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    <div className="mt-4 pt-3 border-t text-xs">
                                      <div className="flex justify-between mb-1.5">
                                        <span className="text-slate-600">Paid:</span>
                                        <span className="font-mono text-red-600 font-medium">
                                          {formatCurrency(block.blockPaid)}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-slate-600">Received:</span>
                                        <span className="font-mono text-emerald-600 font-medium">
                                          {formatCurrency(block.blockReceived)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </>
                            )}

                            <td className="py-5 px-6">
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-full shrink-0 mt-0.5 ${
                                  item.category === 'Expense' ? 'bg-red-50' :
                                  (item.category === 'UPI' || item.category === 'Online') ? 'bg-orange-50' :
                                  'bg-blue-50'
                                }`}>
                                  {getCategoryIcon(item.category)}
                                </div>
                                <div>
                                  <div className="font-medium text-slate-800">{item.description}</div>
                                  <div className="flex items-center gap-2 mt-1.5">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${getCategoryBadge(item.category)}`}>
                                      {item.category}
                                    </span>
                                    {item.subText && (
                                      <span className="text-xs text-slate-500">{item.subText}</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="py-5 px-6 text-right font-mono">
                              {item.type === 'debit' ? (
                                <span className="text-red-600 font-medium">{formatCurrency(item.amount)}</span>
                              ) : (
                                <span className="text-transparent">-</span>
                              )}
                            </td>

                            <td className="py-5 px-6 text-right font-mono">
                              {item.type === 'credit' ? (
                                <span className="text-emerald-600 font-medium">{formatCurrency(item.amount)}</span>
                              ) : (
                                <span className="text-transparent">-</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-slate-500">
                      <div className="flex flex-col items-center gap-3">
                        <Search className="w-10 h-10 text-slate-300" />
                        <p className="text-lg">No transactions found</p>
                        <p className="text-sm text-slate-400">Try changing filters or search term</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>

              <tfoot className="bg-slate-50 border-t font-semibold">
                <tr>
                  <td colSpan={3} className="py-5 px-6 text-right uppercase text-xs text-slate-600">
                    Grand Totals
                  </td>
                  <td className="py-5 px-6 text-right text-red-700 text-lg">
                    {formatCurrency(totals.paid)}
                  </td>
                  <td className="py-5 px-6 text-right text-emerald-700 text-lg">
                    {formatCurrency(totals.received)}
                  </td>
                </tr>
                <tr className="border-t">
                  <td colSpan={3} className="py-5 px-6 text-right uppercase text-xs text-slate-600">
                    Net Balance
                  </td>
                  <td colSpan={2} className={`py-5 px-6 text-right text-xl font-bold ${
                    totals.received - totals.paid >= 0 ? 'text-emerald-700' : 'text-red-700'
                  }`}>
                    {formatCurrency(totals.received - totals.paid)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-slate-600">
              Showing {(currentPage - 1) * itemsPerPage + 1} – {Math.min(currentPage * itemsPerPage, typeFilteredBlocks.length)} of {typeFilteredBlocks.length}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border disabled:opacity-40 hover:bg-slate-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  if (page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                          page === currentPage
                            ? 'bg-indigo-600 text-white'
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  }
                  if (Math.abs(page - currentPage) === 2) {
                    return <span key={page} className="px-2 text-slate-400">...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border disabled:opacity-40 hover:bg-slate-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
