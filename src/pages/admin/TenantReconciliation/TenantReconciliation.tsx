// pages/superadmin/TenantReconciliation.tsx
import React, { useState, useEffect, useMemo } from 'react';
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
  Printer,
  RefreshCw,
  Loader2,
  X,
  Building2,
  Users
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Types
interface Transaction {
  id: string;
  tenantId: string;
  tenantName: string;
  date: Date;
  amount: number;
  type: 'collection' | 'payout';
  status: 'completed' | 'pending' | 'failed';
  reference: string;
  description?: string;
  paymentMethod?: string;
  verifiedBy?: string;
  verifierName?: string;
  createdAt: Date;
}

interface Tenant {
  id: string;
  name: string;
  subdomain: string;
}

interface Summary {
  totalCollected: number;
  totalPending: number;
  totalPayouts: number;
  collectionRate: number;
  totalTenants: number;
  activeTenants: number;
  totalContributions: number;
  totalPayoutCount: number;
}

interface TransactionDetail {
  id: string;
  type: 'collection' | 'payout';
  amount: number;
  status: string;
  reference: string;
  paymentMethod?: string;
  paidAt?: string;
  payoutDate?: string;
  notes?: string;
  createdAt: Date;
  tenant: {
    tenant_id: string;
    name: string;
    subdomain: string;
    bank_account_ref?: string;
  };
  member?: {
    user_id: string;
    full_name: string;
    email: string;
    phone?: string;
  };
  beneficiary?: {
    beneficiary_id: string;
    name: string;
    relationship?: string;
    contact_info?: string;
  };
  event?: {
    event_id: string;
    purpose: string;
    fixed_amount: number;
    deadline: string;
    status: string;
  };
  verifier?: {
    full_name: string;
    email: string;
  };
  recorder?: {
    full_name: string;
    email: string;
  };
}

const TenantReconciliation: React.FC = () => {
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [selectedTenant, setSelectedTenant] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [dateRange, setDateRange] = useState('this-month');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  // Modal states
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionDetail | null>(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Filter and paginate transactions
  const filteredTransactions = useMemo(() => {
    let filtered = [...allTransactions];

    // Filter by tenant
    if (selectedTenant !== 'all') {
      filtered = filtered.filter(t => t.tenantId === selectedTenant);
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(t => t.type === selectedType);
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(t => t.status === selectedStatus);
    }

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        t.tenantName.toLowerCase().includes(search) ||
        t.reference.toLowerCase().includes(search) ||
        (t.description && t.description.toLowerCase().includes(search)) ||
        (t.paymentMethod && t.paymentMethod.toLowerCase().includes(search))
      );
    }

    // Filter by date range
    const now = new Date();
    let startDate = new Date();
    let endDate = new Date();

    switch (dateRange) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'this-week':
        const day = now.getDay();
        startDate.setDate(now.getDate() - day);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'this-month':
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'last-month':
        startDate.setMonth(now.getMonth() - 1);
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      default:
        // this-month is default
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        endDate.setHours(23, 59, 59, 999);
    }

    filtered = filtered.filter(t => {
      const date = new Date(t.date);
      return date >= startDate && date <= endDate;
    });

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return filtered;
  }, [allTransactions, selectedTenant, selectedType, selectedStatus, searchTerm, dateRange]);

  // Calculate summary from filtered data
  const summary = useMemo(() => {
    const totalCollected = filteredTransactions
      .filter(t => t.type === 'collection' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalPending = filteredTransactions
      .filter(t => t.status === 'pending')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalPayouts = filteredTransactions
      .filter(t => t.type === 'payout' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalContributions = filteredTransactions
      .filter(t => t.type === 'collection')
      .length;
    
    const totalPayoutCount = filteredTransactions
      .filter(t => t.type === 'payout')
      .length;
    
    const collectionRate = totalCollected + totalPending > 0 
      ? (totalCollected / (totalCollected + totalPending)) * 100 
      : 0;

    return {
      totalCollected,
      totalPending,
      totalPayouts,
      collectionRate,
      totalTenants: tenants.length,
      activeTenants: tenants.length,
      totalContributions,
      totalPayoutCount
    };
  }, [filteredTransactions, tenants]);

  // Get current page items
  const currentTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTransactions.slice(startIndex, endIndex);
  }, [filteredTransactions, currentPage, itemsPerPage]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  // Fetch all transactions
  const fetchAllTransactions = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_URL}/api/admin/alltransaction`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setAllTransactions(response.data.data.transactions || []);
        setTenants(response.data.data.tenants || []);
        setCurrentPage(1);
      } else {
        setError(response.data.message || 'Failed to fetch transactions');
        // Fallback to mock data
        setAllTransactions(getMockTransactions());
        setTenants(getMockTenants());
      }
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        setError('Cannot connect to server. Please make sure the backend is running.');
      } else {
        setError(error.response?.data?.message || 'Failed to fetch transactions');
      }
      
      // Fallback to mock data
      setAllTransactions(getMockTransactions());
      setTenants(getMockTenants());
    } finally {
      setLoading(false);
    }
  };

  // Fetch transaction details
  const fetchTransactionDetails = async (id: string, type: string) => {
    setLoadingDetails(true);
    try {
      const response = await axios.get(`${API_URL}/api/admin/reconciliation/transactions/${id}`, {
        params: { type },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setSelectedTransaction(response.data.data);
        setShowTransactionModal(true);
      } else {
        toast.error('Failed to load transaction details');
      }
    } catch (error: any) {
      console.error('Error fetching transaction details:', error);
      toast.error(error.response?.data?.message || 'Failed to load transaction details');
    } finally {
      setLoadingDetails(false);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAllTransactions();
    toast.success('Data refreshed successfully');
    setRefreshing(false);
  };

  // Handle reset filters
  const handleResetFilters = () => {
    setSelectedTenant('all');
    setSelectedType('all');
    setSelectedStatus('all');
    setDateRange('this-month');
    setSearchTerm('');
    setCurrentPage(1);
    toast.success('Filters reset');
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Handle view details
  const handleViewDetails = (transaction: Transaction) => {
    fetchTransactionDetails(transaction.id, transaction.type);
  };

  // Mock data
  const getMockTransactions = (): Transaction[] => {
    const now = new Date();
    return [
      {
        id: '1',
        tenantId: '1',
        tenantName: 'TechCorp Solutions',
        date: new Date(now.setHours(now.getHours() - 2)),
        amount: 12500,
        type: 'collection',
        status: 'completed',
        reference: 'INV-2026-001',
        description: 'Monthly membership fees - January 2026',
        paymentMethod: 'Bank Transfer',
        createdAt: new Date()
      },
      {
        id: '2',
        tenantId: '2',
        tenantName: 'GreenLeaf Industries',
        date: new Date(now.setHours(now.getHours() - 5)),
        amount: 8700,
        type: 'collection',
        status: 'completed',
        reference: 'INV-2026-002',
        description: 'Fundraising event contributions',
        paymentMethod: 'Credit Card',
        createdAt: new Date()
      },
      {
        id: '3',
        tenantId: '3',
        tenantName: 'InnovateWorks',
        date: new Date(now.setHours(now.getHours() - 8)),
        amount: 5000,
        type: 'payout',
        status: 'pending',
        reference: 'PAY-2026-003',
        description: 'Beneficiary payout - John Smith',
        createdAt: new Date()
      },
      {
        id: '4',
        tenantId: '4',
        tenantName: 'PrimeEdge Solutions',
        date: new Date(now.setHours(now.getHours() - 12)),
        amount: 3200,
        type: 'collection',
        status: 'completed',
        reference: 'INV-2026-004',
        description: 'Event ticket sales',
        paymentMethod: 'Cash',
        createdAt: new Date()
      },
      {
        id: '5',
        tenantId: '5',
        tenantName: 'Apex Global',
        date: new Date(now.setHours(now.getHours() - 18)),
        amount: 2800,
        type: 'collection',
        status: 'failed',
        reference: 'INV-2026-005',
        description: 'Member contribution - payment declined',
        paymentMethod: 'Credit Card',
        createdAt: new Date()
      },
      {
        id: '6',
        tenantId: '1',
        tenantName: 'TechCorp Solutions',
        date: new Date(now.setHours(now.getHours() - 24)),
        amount: 6400,
        type: 'payout',
        status: 'completed',
        reference: 'PAY-2026-006',
        description: 'Beneficiary payout - Sarah Johnson',
        createdAt: new Date()
      }
    ];
  };

  const getMockTenants = (): Tenant[] => [
    { id: '1', name: 'TechCorp Solutions', subdomain: 'techcorp' },
    { id: '2', name: 'GreenLeaf Industries', subdomain: 'greenleaf' },
    { id: '3', name: 'InnovateWorks', subdomain: 'innovate' },
    { id: '4', name: 'PrimeEdge Solutions', subdomain: 'primeedge' },
    { id: '5', name: 'Apex Global', subdomain: 'apex' },
  ];

  // Get status color
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-500';
      case 'pending': return 'bg-yellow-50 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-500';
      case 'failed': return 'bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-500';
      default: return 'bg-gray-50 text-gray-600 dark:bg-gray-500/15 dark:text-gray-500';
    }
  };

  // Get type icon
  const getTypeIcon = (type: string) => {
    if (type === 'collection') {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    }
    return <TrendingDown className="w-4 h-4 text-red-500" />;
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const icons = {
      completed: <CheckCircle className="w-3 h-3" />,
      pending: <Clock className="w-3 h-3" />,
      failed: <AlertCircle className="w-3 h-3" />
    };

    return (
      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(status)}`}>
        {icons[status as keyof typeof icons]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Format timestamp
  const formatTimestamp = (date: Date) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
    } catch {
      return 'Invalid Date';
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchAllTransactions();
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTenant, selectedType, selectedStatus, dateRange, searchTerm]);

  // Show loading state
  if (loading && allTransactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-brand-500 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading reconciliation data...</p>
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
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                  Tenant Financial Reconciliation
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Monitor and reconcile financial data across all tenants
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
                  Export Report
                </button>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="mb-6 rounded-lg bg-red-50 p-4 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
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

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-green-50 p-3 dark:bg-green-500/15">
                    <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Collected</p>
                    <h4 className="text-xl font-bold text-gray-800 dark:text-white/90">
                      {formatCurrency(summary.totalCollected)}
                    </h4>
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
                    <h4 className="text-xl font-bold text-gray-800 dark:text-white/90">
                      {formatCurrency(summary.totalPending)}
                    </h4>
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
                    <h4 className="text-xl font-bold text-gray-800 dark:text-white/90">
                      {formatCurrency(summary.totalPayouts)}
                    </h4>
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
                    <h4 className="text-xl font-bold text-gray-800 dark:text-white/90">
                      {summary.collectionRate.toFixed(1)}%
                    </h4>
                  </div>
                </div>
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
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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
                    <option value="all">All Tenants</option>
                    {tenants.map((tenant) => (
                      <option key={tenant.id} value={tenant.id}>
                        {tenant.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">Type</label>
                <div className="relative">
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                  >
                    <option value="all">All Types</option>
                    <option value="collection">Collection</option>
                    <option value="payout">Payout</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">Status</label>
                <div className="relative">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                  >
                    <option value="all">All Statuses</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
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
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Reset Filters Button */}
            <div className="mb-6 flex justify-end">
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
              >
                <X className="w-4 h-4" />
                Reset Filters
              </button>
            </div>

            {/* Transactions Table */}
            <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-gray-400" />
                  <h3 className="font-semibold text-gray-800 dark:text-white/90">Transactions</h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ({filteredTransactions.length} entries)
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-green-600 dark:text-green-400">
                    ✓ {filteredTransactions.filter(t => t.status === 'completed').length}
                  </span>
                  <span className="text-yellow-600 dark:text-yellow-400">
                    ⏳ {filteredTransactions.filter(t => t.status === 'pending').length}
                  </span>
                  <span className="text-red-600 dark:text-red-400">
                    ✗ {filteredTransactions.filter(t => t.status === 'failed').length}
                  </span>
                </div>
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
                    {currentTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                          <div className="flex flex-col items-center gap-2">
                            <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                            <p>No transactions found</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500">
                              Try adjusting your search or filters
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      currentTransactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                          <td className="px-4 py-3">
                            <span className="flex items-center gap-1.5 text-sm text-gray-800 dark:text-white/90">
                              <Building2 className="w-3.5 h-3.5 text-gray-400" />
                              {transaction.tenantName}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                              {formatTimestamp(transaction.date)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                              {formatCurrency(transaction.amount)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1.5 text-sm capitalize text-gray-600 dark:text-gray-400">
                              {getTypeIcon(transaction.type)}
                              {transaction.type}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {transaction.reference}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {getStatusBadge(transaction.status)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => handleViewDetails(transaction)}
                              className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                              title="View details"
                            >
                              <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300" />
                            </button>
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
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                    {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} results
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:text-gray-400"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
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

      {/* Transaction Details Modal */}
      {showTransactionModal && selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 dark:bg-gray-900">
            <button
              onClick={() => setShowTransactionModal(false)}
              className="absolute right-4 top-4 p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">
              Transaction Details
            </h2>

            {loadingDetails ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
                    <p className="font-medium text-gray-800 dark:text-white/90 capitalize">
                      {selectedTransaction.type}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Amount</p>
                    <p className="font-medium text-gray-800 dark:text-white/90">
                      {formatCurrency(selectedTransaction.amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                    {getStatusBadge(selectedTransaction.status)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Reference</p>
                    <p className="font-medium text-gray-800 dark:text-white/90">
                      {selectedTransaction.reference}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tenant</p>
                    <p className="font-medium text-gray-800 dark:text-white/90">
                      {selectedTransaction.tenant?.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                    <p className="font-medium text-gray-800 dark:text-white/90">
                      {formatTimestamp(selectedTransaction.createdAt)}
                    </p>
                  </div>
                </div>

                {selectedTransaction.member && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Member</p>
                    <p className="font-medium text-gray-800 dark:text-white/90">
                      {selectedTransaction.member.full_name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedTransaction.member.email}
                    </p>
                  </div>
                )}

                {selectedTransaction.beneficiary && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Beneficiary</p>
                    <p className="font-medium text-gray-800 dark:text-white/90">
                      {selectedTransaction.beneficiary.name}
                    </p>
                    {selectedTransaction.beneficiary.relationship && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedTransaction.beneficiary.relationship}
                      </p>
                    )}
                  </div>
                )}

                {selectedTransaction.event && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Event</p>
                    <p className="font-medium text-gray-800 dark:text-white/90">
                      {selectedTransaction.event.purpose}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Amount: {formatCurrency(selectedTransaction.event.fixed_amount)}
                    </p>
                  </div>
                )}

                {selectedTransaction.verifier && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Verified By</p>
                    <p className="font-medium text-gray-800 dark:text-white/90">
                      {selectedTransaction.verifier.full_name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedTransaction.verifier.email}
                    </p>
                  </div>
                )}

                {selectedTransaction.recorder && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Recorded By</p>
                    <p className="font-medium text-gray-800 dark:text-white/90">
                      {selectedTransaction.recorder.full_name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedTransaction.recorder.email}
                    </p>
                  </div>
                )}

                {selectedTransaction.paymentMethod && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Payment Method</p>
                    <p className="font-medium text-gray-800 dark:text-white/90">
                      {selectedTransaction.paymentMethod}
                    </p>
                  </div>
                )}

                {selectedTransaction.notes && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Notes</p>
                    <p className="text-sm text-gray-800 dark:text-white/90">
                      {selectedTransaction.notes}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowTransactionModal(false)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantReconciliation;