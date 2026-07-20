// pages/superadmin/TenantReconciliation.tsx
import React, { useState } from 'react';
import {
  Wallet,
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  Calendar,
  FileText,
  Filter,
  Search,
  Eye,
  Printer
} from 'lucide-react';

const TenantReconciliation: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedTenant, setSelectedTenant] = useState('all');
  const [dateRange, setDateRange] = useState('this-month');

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => { if (window.innerWidth < 1024) setIsSidebarOpen(false); };

  const tenants = [
    { id: 'all', name: 'All Tenants' },
    { id: 'techcorp', name: 'TechCorp Solutions' },
    { id: 'greenleaf', name: 'GreenLeaf Industries' },
    { id: 'innovate', name: 'InnovateWorks' },
    { id: 'primeedge', name: 'PrimeEdge Solutions' },
    { id: 'apex', name: 'Apex Global' },
  ];

  const summary = {
    totalCollected: '$1,247,500',
    totalPending: '$89,200',
    totalPayouts: '$1,158,300',
    collectionRate: '92.8%'
  };

  const recentTransactions = [
    { 
      id: 1, 
      tenant: 'TechCorp Solutions', 
      date: '2026-01-20 14:30', 
      amount: '$12,500', 
      type: 'collection', 
      status: 'completed',
      reference: 'INV-2026-001'
    },
    { 
      id: 2, 
      tenant: 'GreenLeaf Industries', 
      date: '2026-01-19 11:45', 
      amount: '$8,700', 
      type: 'collection', 
      status: 'completed',
      reference: 'INV-2026-002'
    },
    { 
      id: 3, 
      tenant: 'InnovateWorks', 
      date: '2026-01-18 09:20', 
      amount: '$5,000', 
      type: 'payout', 
      status: 'pending',
      reference: 'PAY-2026-003'
    },
    { 
      id: 4, 
      tenant: 'PrimeEdge Solutions', 
      date: '2026-01-17 16:10', 
      amount: '$3,200', 
      type: 'collection', 
      status: 'completed',
      reference: 'INV-2026-004'
    },
    { 
      id: 5, 
      tenant: 'Apex Global', 
      date: '2026-01-16 13:55', 
      amount: '$2,800', 
      type: 'collection', 
      status: 'failed',
      reference: 'INV-2026-005'
    },
    { 
      id: 6, 
      tenant: 'TechCorp Solutions', 
      date: '2026-01-15 10:30', 
      amount: '$6,400', 
      type: 'payout', 
      status: 'completed',
      reference: 'PAY-2026-006'
    },
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-500';
      case 'pending': return 'bg-yellow-50 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-500';
      case 'failed': return 'bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-500';
      default: return 'bg-gray-50 text-gray-600 dark:bg-gray-500/15 dark:text-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    if (type === 'collection') {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    }
    return <TrendingDown className="w-4 h-4 text-red-500" />;
  };

  return (
    <div className="flex h-screen overflow-hidden">

      <div className="relative flex flex-col flex-1 overflow-x-hidden overflow-y-auto">

        <main>
          <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
            {/* Header */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                  Tenant Financial Reconciliation
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Monitor and reconcile financial data across all tenants
                </p>
              </div>
              <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]">
                <Download className="w-4 h-4" />
                Export Report
              </button>
            </div>

            {/* Filters */}
            <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
                  Tenant
                </label>
                <div className="relative">
                  <select
                    value={selectedTenant}
                    onChange={(e) => setSelectedTenant(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                  >
                    {tenants.map((tenant) => (
                      <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
                  Date Range
                </label>
                <div className="relative">
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                  >
                    <option value="today">Today</option>
                    <option value="this-week">This Week</option>
                    <option value="this-month">This Month</option>
                    <option value="last-month">Last Month</option>
                    <option value="custom">Custom Range</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div className="flex items-end gap-2">
                <button className="flex-1 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors">
                  <Filter className="w-4 h-4 inline mr-2" />
                  Apply Filters
                </button>
                <button className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-green-50 p-3 dark:bg-green-500/15">
                    <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Collected</p>
                    <h4 className="text-xl font-bold text-gray-800 dark:text-white/90">{summary.totalCollected}</h4>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-yellow-50 p-3 dark:bg-yellow-500/15">
                    <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Pending</p>
                    <h4 className="text-xl font-bold text-gray-800 dark:text-white/90">{summary.totalPending}</h4>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-50 p-3 dark:bg-blue-500/15">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Payouts</p>
                    <h4 className="text-xl font-bold text-gray-800 dark:text-white/90">{summary.totalPayouts}</h4>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-purple-50 p-3 dark:bg-purple-500/15">
                    <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Collection Rate</p>
                    <h4 className="text-xl font-bold text-gray-800 dark:text-white/90">{summary.collectionRate}</h4>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Transactions Table */}
            <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <h3 className="font-semibold text-gray-800 dark:text-white/90">Recent Transactions</h3>
                <button className="text-sm text-brand-500 hover:text-brand-600 font-medium">
                  View All →
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tenant</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reference</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {recentTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                        <td className="px-4 py-3">
                          <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                            {transaction.tenant}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                          {new Date(transaction.date).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-white/90">
                          {transaction.amount}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1.5">
                            {getTypeIcon(transaction.type)}
                            <span className="text-sm capitalize text-gray-600 dark:text-gray-400">
                              {transaction.type}
                            </span>
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                          {transaction.reference}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(transaction.status)}`}>
                            {transaction.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                            {transaction.status === 'pending' && <Clock className="w-3 h-3" />}
                            {transaction.status === 'failed' && <AlertCircle className="w-3 h-3" />}
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors">
                            <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TenantReconciliation;