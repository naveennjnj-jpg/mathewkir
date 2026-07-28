// pages/superadmin/AuditLogs.tsx
import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Filter,
  Download,
  ChevronDown,
  Calendar,
  User,
  Building2,
  Activity,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Loader2
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Types
interface AuditLog {
  id: string;
  timestamp: string;
  tenant: string;
  tenantId: string;
  user: string;
  userEmail: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  details: any;
  status: 'success' | 'failed';
  createdAt: string;
}

interface Tenant {
  tenant_id: string;
  name: string;
  subdomain: string;
}

const AuditLogs: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [selectedTenant, setSelectedTenant] = useState('all');
  const [selectedAction, setSelectedAction] = useState('all');
  const [dateRange, setDateRange] = useState('this-month');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const [summary, setSummary] = useState({ total: 0, success: 0, failed: 0 });

  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Action options
  const actionOptions = [
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

  // Date range options
  const dateRangeOptions = [
    { id: 'today', label: 'Today' },
    { id: 'this-week', label: 'This Week' },
    { id: 'this-month', label: 'This Month' },
    { id: 'last-month', label: 'Last Month' },
    { id: 'custom', label: 'Custom Range' },
  ];

  // Fetch tenants for filter
  const fetchTenants = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/tenants?limit=100`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setTenants(response.data.data);
      }
    } catch (error: any) {
      console.error('Error fetching tenants:', error);
    }
  };

  // Fetch audit logs
  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query params
      const params: any = {
        page,
        limit: 20,
        sortBy: 'created_at',
        sortOrder: 'desc',
      };

      if (selectedTenant !== 'all') {
        params.tenantId = selectedTenant;
      }

      if (selectedAction !== 'all') {
        params.action = selectedAction;
      }

      if (searchTerm) {
        params.search = searchTerm;
      }

      // Handle date range
      if (dateRange !== 'all') {
        const now = new Date();
        let startDate = new Date();
        
        switch (dateRange) {
          case 'today':
            startDate = new Date(now.setHours(0, 0, 0, 0));
            break;
          case 'this-week':
            startDate = new Date(now.setDate(now.getDate() - 7));
            break;
          case 'this-month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
          case 'last-month':
            startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            break;
          default:
            break;
        }
        
        params.startDate = startDate.toISOString();
      }

      const response = await axios.get(`${API_URL}/api/admin/audit-logs`, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setAuditLogs(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setTotalLogs(response.data.pagination.total);
        setSummary(response.data.summary);
      } else {
        setError(response.data.message || 'Failed to fetch audit logs');
        // Fallback to mock data
        setAuditLogs(getMockAuditLogs());
      }
    } catch (error: any) {
      console.error('Error fetching audit logs:', error);
      
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        setError('Cannot connect to server. Please make sure the backend is running.');
      } else {
        setError(error.response?.data?.message || 'Failed to fetch audit logs');
      }
      
      // Fallback to mock data
      setAuditLogs(getMockAuditLogs());
      setSummary({ total: 8, success: 6, failed: 2 });
    } finally {
      setLoading(false);
    }
  };

  // Mock data for fallback
  const getMockAuditLogs = (): AuditLog[] => [
    {
      id: '1',
      timestamp: '2026-01-20 14:30:25',
      tenant: 'TechCorp Solutions',
      tenantId: '1',
      user: 'John Doe',
      userEmail: 'john@techcorp.com',
      userId: '1',
      action: 'login',
      entityType: 'user',
      entityId: '1',
      details: { message: 'User logged in from IP 192.168.1.100', status: 'success' },
      status: 'success',
      createdAt: '2026-01-20T14:30:25Z'
    },
    {
      id: '2',
      timestamp: '2026-01-20 14:15:10',
      tenant: 'GreenLeaf Industries',
      tenantId: '2',
      user: 'Sarah Smith',
      userEmail: 'sarah@greenleaf.com',
      userId: '2',
      action: 'update',
      entityType: 'tenant',
      entityId: '2',
      details: { message: 'Updated tenant settings - Payment threshold changed to $5,000', status: 'success' },
      status: 'success',
      createdAt: '2026-01-20T14:15:10Z'
    },
    {
      id: '3',
      timestamp: '2026-01-20 13:45:30',
      tenant: 'InnovateWorks',
      tenantId: '3',
      user: 'Mike Johnson',
      userEmail: 'mike@innovate.com',
      userId: '3',
      action: 'create',
      entityType: 'user',
      entityId: '4',
      details: { message: 'Created new user account - james@innovate.com', status: 'success' },
      status: 'success',
      createdAt: '2026-01-20T13:45:30Z'
    },
    {
      id: '4',
      timestamp: '2026-01-20 13:20:15',
      tenant: 'TechCorp Solutions',
      tenantId: '1',
      user: 'Jane Wilson',
      userEmail: 'jane@techcorp.com',
      userId: '5',
      action: 'delete',
      entityType: 'transaction',
      entityId: '6',
      details: { message: 'Deleted transaction #TXN-2026-045 - Duplicate entry', status: 'failed' },
      status: 'failed',
      createdAt: '2026-01-20T13:20:15Z'
    },
    {
      id: '5',
      timestamp: '2026-01-20 12:55:00',
      tenant: 'PrimeEdge Solutions',
      tenantId: '7',
      user: 'Emma Davis',
      userEmail: 'emma@primeedge.com',
      userId: '8',
      action: 'approve',
      entityType: 'payout',
      entityId: '9',
      details: { message: 'Approved payout request #PAY-2026-089 - Amount $12,500', status: 'success' },
      status: 'success',
      createdAt: '2026-01-20T12:55:00Z'
    },
    {
      id: '6',
      timestamp: '2026-01-20 12:30:45',
      tenant: 'Apex Global',
      tenantId: '10',
      user: 'David Brown',
      userEmail: 'david@apex.com',
      userId: '11',
      action: 'export',
      entityType: 'report',
      entityId: '12',
      details: { message: 'Exported financial report - Q4 2025 - Format: PDF', status: 'success' },
      status: 'success',
      createdAt: '2026-01-20T12:30:45Z'
    },
    {
      id: '7',
      timestamp: '2026-01-20 12:10:20',
      tenant: 'GreenLeaf Industries',
      tenantId: '2',
      user: 'Sarah Smith',
      userEmail: 'sarah@greenleaf.com',
      userId: '2',
      action: 'reject',
      entityType: 'user',
      entityId: '13',
      details: { message: 'Rejected user registration - Email already exists', status: 'failed' },
      status: 'failed',
      createdAt: '2026-01-20T12:10:20Z'
    },
    {
      id: '8',
      timestamp: '2026-01-20 11:45:30',
      tenant: 'TechCorp Solutions',
      tenantId: '1',
      user: 'System Admin',
      userEmail: 'admin@system.com',
      userId: '14',
      action: 'update',
      entityType: 'system',
      entityId: '15',
      details: { message: 'System maintenance performed - Database optimization', status: 'success' },
      status: 'success',
      createdAt: '2026-01-20T11:45:30Z'
    },
  ];

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchAuditLogs();
      toast.success('Audit logs refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh audit logs');
    } finally {
      setRefreshing(false);
    }
  };

  // Handle apply filters
  const handleApplyFilters = () => {
    setPage(1);
    fetchAuditLogs();
    toast.success('Filters applied');
  };

  // Handle reset filters
  const handleResetFilters = () => {
    setSelectedTenant('all');
    setSelectedAction('all');
    setDateRange('this-month');
    setSearchTerm('');
    setPage(1);
    fetchAuditLogs();
    toast.success('Filters reset');
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Get action icon
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

  // Get action color
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

  // Get status badge
  const getStatusBadge = (status: string) => {
    if (status === 'success') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-600 dark:bg-green-500/15 dark:text-green-500">
          <CheckCircle className="w-3 h-3" />
          Success
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-600 dark:bg-red-500/15 dark:text-red-500">
        <XCircle className="w-3 h-3" />
        Failed
      </span>
    );
  };

  // Format timestamp safely
  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return 'N/A';
    try {
      const date = new Date(timestamp);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
    } catch {
      return timestamp;
    }
  };

  // Safely render details (fix for object rendering error)
  const renderDetails = (details: any): string => {
    if (!details) return 'No details';
    if (typeof details === 'string') return details;
    if (typeof details === 'object') {
      // If it's an object, try to get a message or stringify it
      return details.message || details.details || JSON.stringify(details);
    }
    return String(details);
  };

  // Fetch data on mount
  useEffect(() => {
    fetchTenants();
    fetchAuditLogs();
  }, []);

  // Fetch when page changes
  useEffect(() => {
    if (page > 1) {
      fetchAuditLogs();
    }
  }, [page]);

  // Show loading state
  if (loading && auditLogs.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-brand-500 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading audit logs...</p>
        </div>
      </div>
    );
  }

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
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
                <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]">
                  <Download className="w-4 h-4" />
                  Export Logs
                </button>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="mb-6 rounded-lg bg-red-50 p-4 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  <button
                    onClick={handleRefresh}
                    className="ml-auto text-sm text-red-600 dark:text-red-400 hover:text-red-700 font-medium"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {/* Summary Stats */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-4 mb-6">
              <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Entries</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white/90">{summary.total}</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
                <p className="text-sm text-gray-500 dark:text-gray-400">Successful</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-500">{summary.success}</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
                <p className="text-sm text-gray-500 dark:text-gray-400">Failed</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-500">{summary.failed}</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
                <p className="text-sm text-gray-500 dark:text-gray-400">Success Rate</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white/90">
                  {summary.total > 0 ? Math.round((summary.success / summary.total) * 100) : 0}%
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-5">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleApplyFilters()}
                    className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">Tenant</label>
                <div className="relative">
                  <select
                    value={selectedTenant}
                    onChange={(e) => setSelectedTenant(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                  >
                    <option key="all-tenants" value="all">All Tenants</option>
                    {tenants.map((tenant) => (
                      <option key={tenant.tenant_id} value={tenant.tenant_id}>
                        {tenant.name}
                      </option>
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
                    {actionOptions.map((action) => (
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
                    {dateRangeOptions.map((option) => (
                      <option key={option.id} value={option.id}>{option.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div className="flex items-end gap-2">
                <button
                  onClick={handleApplyFilters}
                  className="flex-1 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
                >
                  <Filter className="w-4 h-4 inline mr-2" />
                  Apply Filters
                </button>
                <button
                  onClick={handleResetFilters}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Audit Logs Table */}
            <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <h3 className="font-semibold text-gray-800 dark:text-white/90">Activity Log</h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">({totalLogs} entries)</span>
                </div>
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
                    {auditLogs.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                          <div className="flex flex-col items-center gap-2">
                            <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                            <p>No audit logs found</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500">
                              Try adjusting your search or filters
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                          <td className="px-4 py-3">
                            <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                              {formatTimestamp(log.timestamp || log.createdAt)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="flex items-center gap-1.5 text-sm text-gray-800 dark:text-white/90">
                              <Building2 className="w-3.5 h-3.5 text-gray-400" />
                              {log.tenant}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm">
                              <div className="font-medium text-gray-800 dark:text-white/90">
                                {log.user}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {log.userEmail}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${getActionColor(log.action)}`}>
                              {getActionIcon(log.action)}
                              {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate block">
                              {renderDetails(log.details)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {getStatusBadge(log.status)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Page {page} of {totalPages}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="px-3 py-1 rounded border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:text-gray-400"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      className="px-3 py-1 rounded border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:text-gray-400"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuditLogs;