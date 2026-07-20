// pages/superadmin/AuditLogs.tsx
import React, { useState } from 'react';

import {
  FileText,
  Search,
  Filter,
  Download,
  ChevronDown,
  Calendar,
  Eye,
  User,
  Building2,
  Clock,
  Activity,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

const AuditLogs: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedTenant, setSelectedTenant] = useState('all');
  const [selectedAction, setSelectedAction] = useState('all');
  const [dateRange, setDateRange] = useState('this-month');

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => { if (window.innerWidth < 1024) setIsSidebarOpen(false); };

  const tenants = [
    { id: 'all', name: 'All Tenants' },
    { id: 'techcorp', name: 'TechCorp Solutions' },
    { id: 'greenleaf', name: 'GreenLeaf Industries' },
    { id: 'innovate', name: 'InnovateWorks' },
  ];

  const actions = [
    { id: 'all', name: 'All Actions' },
    { id: 'login', name: 'Login' },
    { id: 'logout', name: 'Logout' },
    { id: 'create', name: 'Create' },
    { id: 'update', name: 'Update' },
    { id: 'delete', name: 'Delete' },
    { id: 'approve', name: 'Approve' },
    { id: 'reject', name: 'Reject' },
    { id: 'export', name: 'Export' },
  ];

  const auditLogs = [
    {
      id: 1,
      timestamp: '2026-01-20 14:30:25',
      tenant: 'TechCorp Solutions',
      user: 'John Doe (john@techcorp.com)',
      action: 'login',
      details: 'User logged in from IP 192.168.1.100',
      status: 'success'
    },
    {
      id: 2,
      timestamp: '2026-01-20 14:15:10',
      tenant: 'GreenLeaf Industries',
      user: 'Sarah Smith (sarah@greenleaf.com)',
      action: 'update',
      details: 'Updated tenant settings - Payment threshold changed to $5,000',
      status: 'success'
    },
    {
      id: 3,
      timestamp: '2026-01-20 13:45:30',
      tenant: 'InnovateWorks',
      user: 'Mike Johnson (mike@innovate.com)',
      action: 'create',
      details: 'Created new user account - james@innovate.com',
      status: 'success'
    },
    {
      id: 4,
      timestamp: '2026-01-20 13:20:15',
      tenant: 'TechCorp Solutions',
      user: 'Jane Wilson (jane@techcorp.com)',
      action: 'delete',
      details: 'Deleted transaction #TXN-2026-045 - Duplicate entry',
      status: 'failed'
    },
    {
      id: 5,
      timestamp: '2026-01-20 12:55:00',
      tenant: 'PrimeEdge Solutions',
      user: 'Emma Davis (emma@primeedge.com)',
      action: 'approve',
      details: 'Approved payout request #PAY-2026-089 - Amount $12,500',
      status: 'success'
    },
    {
      id: 6,
      timestamp: '2026-01-20 12:30:45',
      tenant: 'Apex Global',
      user: 'David Brown (david@apex.com)',
      action: 'export',
      details: 'Exported financial report - Q4 2025 - Format: PDF',
      status: 'success'
    },
    {
      id: 7,
      timestamp: '2026-01-20 12:10:20',
      tenant: 'GreenLeaf Industries',
      user: 'Sarah Smith (sarah@greenleaf.com)',
      action: 'reject',
      details: 'Rejected user registration - Email already exists',
      status: 'failed'
    },
    {
      id: 8,
      timestamp: '2026-01-20 11:45:30',
      tenant: 'TechCorp Solutions',
      user: 'System Admin',
      action: 'update',
      details: 'System maintenance performed - Database optimization',
      status: 'success'
    },
  ];

  const getActionIcon = (action: string) => {
    switch(action) {
      case 'login': return <User className="w-4 h-4" />;
      case 'logout': return <User className="w-4 h-4" />;
      case 'create': return <CheckCircle className="w-4 h-4" />;
      case 'update': return <Activity className="w-4 h-4" />;
      case 'delete': return <XCircle className="w-4 h-4" />;
      case 'approve': return <CheckCircle className="w-4 h-4" />;
      case 'reject': return <AlertTriangle className="w-4 h-4" />;
      case 'export': return <Download className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch(action) {
      case 'login': return 'text-blue-500';
      case 'logout': return 'text-gray-500';
      case 'create': return 'text-green-500';
      case 'update': return 'text-purple-500';
      case 'delete': return 'text-red-500';
      case 'approve': return 'text-green-500';
      case 'reject': return 'text-red-500';
      case 'export': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'success') {
      return <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-600 dark:bg-green-500/15 dark:text-green-500">
        <CheckCircle className="w-3 h-3" />
        Success
      </span>;
    }
    return <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-600 dark:bg-red-500/15 dark:text-red-500">
      <XCircle className="w-3 h-3" />
      Failed
    </span>;
  };

  return (
    <div className="flex h-screen overflow-hidden">

      <div className="relative flex flex-col flex-1 overflow-x-hidden overflow-y-auto">

        <main>
          <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
            {/* Header */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">Global Audit Logs</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Monitor all platform activities across all tenants
                </p>
              </div>
              <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]">
                <Download className="w-4 h-4" />
                Export Logs
              </button>
            </div>

            {/* Filters */}
            <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">Tenant</label>
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
                <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">Action</label>
                <div className="relative">
                  <select
                    value={selectedAction}
                    onChange={(e) => setSelectedAction(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                  >
                    {actions.map((action) => (
                      <option key={action.id} value={action.id}>{action.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">Date Range</label>
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

            {/* Audit Logs Table */}
            <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <h3 className="font-semibold text-gray-800 dark:text-white/90">Activity Log</h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">({auditLogs.length} entries)</span>
                </div>
                <button className="text-sm text-brand-500 hover:text-brand-600 font-medium">
                  View All →
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Timestamp</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tenant</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Details</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                            {log.timestamp}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-1.5 text-sm text-gray-800 dark:text-white/90">
                            <Building2 className="w-3.5 h-3.5 text-gray-400" />
                            {log.tenant}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {log.user}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${getActionColor(log.action)}`}>
                            {getActionIcon(log.action)}
                            {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {log.details}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {getStatusBadge(log.status)}
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

export default AuditLogs;