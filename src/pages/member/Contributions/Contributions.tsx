// pages/member/Contributions.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Download,
  ChevronDown,
  DollarSign,
  CreditCard,
  Banknote,
  Wallet,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  FileText,
  Inbox
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Types
interface Contribution {
  id: string;
  eventName: string;
  amount: number;
  date: string;
  paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'mobile_money' | 'other';
  status: 'paid' | 'pending' | 'overdue';
  transactionId?: string;
  receipt?: string;
  description?: string;
}

const Contributions: React.FC = () => {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [filteredData, setFilteredData] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Fetch contributions
  const fetchContributions = async () => {
    try {
      setLoading(true);
      setError(null);

      const tenantSubdomain = localStorage.getItem('tenantSubdomain') || '';

      const response = await axios.get(`${API_URL}/api/member/contributions`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Tenant-Subdomain': tenantSubdomain,
        },
      });

      if (response.data.success) {
        const data = response.data.data.contributions || [];
        setContributions(data);
        setFilteredData(data);
      } else {
        setError(response.data.message || 'Failed to fetch contributions');
        setContributions([]);
        setFilteredData([]);
      }
    } catch (error: any) {
      console.error('Error fetching contributions:', error);
      
      let errorMessage = 'Failed to fetch contributions';
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        errorMessage = 'Cannot connect to server. Please make sure the backend is running.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setError(errorMessage);
      setContributions([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  useEffect(() => {
    let filtered = [...contributions];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(contribution =>
        contribution.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contribution.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contribution.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(contribution => contribution.status === statusFilter);
    }

    // Date range filter
    if (dateRange.start) {
      filtered = filtered.filter(contribution => 
        new Date(contribution.date) >= new Date(dateRange.start)
      );
    }
    if (dateRange.end) {
      filtered = filtered.filter(contribution => 
        new Date(contribution.date) <= new Date(dateRange.end)
      );
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, dateRange, contributions]);

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchContributions();
      if (contributions.length > 0) {
        toast.success('Contributions refreshed successfully');
      }
    } catch (error) {
      toast.error('Failed to refresh contributions');
    } finally {
      setRefreshing(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get status badge
const getStatusBadge = (status?: string) => {
  const configs = {
    paid: {
      icon: CheckCircle,
      className: 'bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-500',
      label: 'Paid',
    },
    approved: {
      icon: CheckCircle,
      className: 'bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-500',
      label: 'Approved',
    },
    pending: {
      icon: Clock,
      className: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-500',
      label: 'Pending',
    },
    overdue: {
      icon: XCircle,
      className: 'bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-500',
      label: 'Overdue',
    },
    rejected: {
      icon: XCircle,
      className: 'bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-500',
      label: 'Rejected',
    },
  };

  const config =
    configs[(status || '').toLowerCase() as keyof typeof configs] ??
    configs.pending;

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${config.className}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
};

  // Get payment method icon
  const getPaymentMethodIcon = (method: string) => {
    const icons = {
      cash: <Banknote className="w-4 h-4" />,
      card: <CreditCard className="w-4 h-4" />,
      bank_transfer: <Wallet className="w-4 h-4" />,
      mobile_money: <DollarSign className="w-4 h-4" />,
      other: <FileText className="w-4 h-4" />,
    };
    return icons[method as keyof typeof icons] || icons.other;
  };

  // Get payment method label
  const getPaymentMethodLabel = (method: string) => {
    const labels = {
      cash: 'Cash',
      card: 'Card',
      bank_transfer: 'Bank Transfer',
      mobile_money: 'Mobile Money',
      other: 'Other',
    };
    return labels[method as keyof typeof labels] || method;
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateRange({ start: '', end: '' });
    setShowFilters(false);
  };

  // Export data
  const exportData = () => {
    try {
      const headers = ['Event Name', 'Amount', 'Date', 'Payment Method', 'Status', 'Transaction ID'];
      const csvData = filteredData.map(c => [
        c.eventName,
        c.amount,
        formatDate(c.date),
        getPaymentMethodLabel(c.paymentMethod),
        c.status.toUpperCase(),
        c.transactionId || ''
      ]);

      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contributions_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast.success('Export successful!');
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Fetch data on mount
  useEffect(() => {
    fetchContributions();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-brand-500 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading contributions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-4 mx-auto max-w-7xl md:p-6">
        {/* Page Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Link to="/member/dashboard" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                  My Contributions
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Track all your event contributions and payments
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={exportData}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              disabled={filteredData.length === 0}
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
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

        {/* Show content only if no error and there is data */}
        {!error && (
          <>
            {/* Summary Stats - Show 0 when no data */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
              <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Contributions</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white/90">
                  {formatCurrency(contributions.reduce((sum, c) => sum + c.amount, 0))}
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Events</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white/90">
                  {contributions.length}
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
                <p className="text-sm text-gray-500 dark:text-gray-400">Pending Payments</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {contributions.filter(c => c.status === 'pending').length}
                </p>
              </div>
            </div>

            {/* Filters Section - Only show if there is data */}
            {contributions.length > 0 && (
              <>
                <div className="mb-6">
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search Bar */}
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by event name, transaction ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 text-gray-800 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>

                    {/* Filter Toggle */}
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-colors ${
                        showFilters 
                          ? 'bg-brand-50 border-brand-200 text-brand-600 dark:bg-brand-500/15 dark:border-brand-500/30 dark:text-brand-400'
                          : 'border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
                      }`}
                    >
                      <Filter className="w-4 h-4" />
                      Filters
                      {(statusFilter !== 'all' || dateRange.start || dateRange.end) && (
                        <span className="w-2 h-2 rounded-full bg-brand-500" />
                      )}
                      <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {/* Filter Panel */}
                  {showFilters && (
                    <div className="mt-3 p-4 rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Status Filter */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Status
                          </label>
                          <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 text-gray-800 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-brand-500"
                          >
                            <option value="all">All Statuses</option>
                            <option value="paid">Paid</option>
                            <option value="pending">Pending</option>
                            <option value="overdue">Overdue</option>
                          </select>
                        </div>

                        {/* Date Range - Start */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            From Date
                          </label>
                          <input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 text-gray-800 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-brand-500"
                          />
                        </div>

                        {/* Date Range - End */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            To Date
                          </label>
                          <input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 text-gray-800 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-brand-500"
                          />
                        </div>
                      </div>

                      {/* Clear Filters */}
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={clearFilters}
                          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                          Clear all filters
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Results Count */}
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Showing {filteredData.length} contribution{filteredData.length !== 1 ? 's' : ''}
                  </p>
                </div>

                {/* Contributions Table */}
                <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Event Name
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Payment Method
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Transaction ID
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {currentItems.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                              <div className="flex flex-col items-center gap-2">
                                <Search className="w-8 h-8 text-gray-400" />
                                <p>No contributions found matching your filters</p>
                                <button
                                  onClick={clearFilters}
                                  className="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400"
                                >
                                  Clear filters
                                </button>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          currentItems.map((contribution) => (
                            <tr 
                              key={contribution.id} 
                              className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                            >
                              <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-white/90">
                                {contribution.eventName}
                              </td>
                              <td className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-white/90">
                                {formatCurrency(contribution.amount)}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                {formatDate(contribution.date)}
                              </td>
                              <td className="px-4 py-3">
                                <span className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
                                  {getPaymentMethodIcon(contribution.paymentMethod)}
                                  {getPaymentMethodLabel(contribution.paymentMethod)}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                {getStatusBadge(contribution.status)}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 font-mono">
                                {contribution.transactionId || '-'}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {filteredData.length > itemsPerPage && (
                    <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length}
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => paginate(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                          let pageNumber;
                          if (totalPages <= 5) {
                            pageNumber = i + 1;
                          } else if (currentPage <= 3) {
                            pageNumber = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNumber = totalPages - 4 + i;
                          } else {
                            pageNumber = currentPage - 2 + i;
                          }
                          
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => paginate(pageNumber)}
                              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                                currentPage === pageNumber
                                  ? 'bg-brand-500 text-white'
                                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        })}
                        <button
                          onClick={() => paginate(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Empty State - No data */}
            {contributions.length === 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="flex flex-col items-center gap-4">
                  <div className="rounded-full bg-gray-100 p-4 dark:bg-gray-800">
                    <Inbox className="w-12 h-12 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                      No Contributions Yet
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-md">
                      You haven't made any contributions yet. Check out our fundraising events to get started!
                    </p>
                  </div>
                  <Link
                    to="/member/events"
                    className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
                  >
                    View Events
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Contributions;