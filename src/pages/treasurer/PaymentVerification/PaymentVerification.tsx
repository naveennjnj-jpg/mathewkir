// pages/treasurer/PaymentVerification.tsx
import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  XCircle,
  Eye,
  Search,
  Filter,
  RefreshCw,
  Loader2,
  AlertCircle,
  FileText,
  User,
  DollarSign,
  Clock,
  ChevronDown
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface PendingPayment {
  id: string;
  memberName: string;
  memberEmail: string;
  amount: number;
  paymentMethod: string;
  referenceNumber: string;
  proofUrl: string;
  proofFileName: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  eventTitle?: string;
}

const PaymentVerification: React.FC = () => {
  const [payments, setPayments] = useState<PendingPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [selectedPayment, setSelectedPayment] = useState<PendingPayment | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showProofModal, setShowProofModal] = useState(false);

  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const tenantSubdomain = localStorage.getItem('tenantSubdomain') || '';
      const response = await axios.get(`${API_URL}/api/treasurer/payments/pending`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Tenant-Subdomain': tenantSubdomain,
        },
      });

      if (response.data.success) {
        setPayments(response.data.data);
      } else {
        setPayments(getMockPayments());
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      setPayments(getMockPayments());
    } finally {
      setLoading(false);
    }
  };

  const getMockPayments = (): PendingPayment[] => [
    {
      id: '1',
      memberName: 'John Doe',
      memberEmail: 'john@example.com',
      amount: 500,
      paymentMethod: 'Bank Transfer',
      referenceNumber: 'BT-2026-001',
      proofUrl: '#',
      proofFileName: 'payment-proof-1.jpg',
      submittedAt: '2026-01-20T14:30:00Z',
      status: 'pending',
      eventTitle: 'Annual Fundraiser 2026'
    },
    {
      id: '2',
      memberName: 'Jane Smith',
      memberEmail: 'jane@example.com',
      amount: 250,
      paymentMethod: 'Credit Card',
      referenceNumber: 'CC-2026-002',
      proofUrl: '#',
      proofFileName: 'payment-proof-2.pdf',
      submittedAt: '2026-01-20T12:15:00Z',
      status: 'pending',
      eventTitle: 'School Building Fund'
    },
    {
      id: '3',
      memberName: 'Mike Johnson',
      memberEmail: 'mike@example.com',
      amount: 1000,
      paymentMethod: 'PayPal',
      referenceNumber: 'PP-2026-003',
      proofUrl: '#',
      proofFileName: 'payment-proof-3.jpg',
      submittedAt: '2026-01-19T16:45:00Z',
      status: 'pending',
      eventTitle: 'Community Support Program'
    }
  ];

  const handleApprovePayment = async (paymentId: string) => {
    try {
      const tenantSubdomain = localStorage.getItem('tenantSubdomain') || '';
      const response = await axios.patch(
        `${API_URL}/api/treasurer/payments/${paymentId}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-Tenant-Subdomain': tenantSubdomain,
          },
        }
      );

      if (response.data.success) {
        toast.success('Payment approved successfully');
        fetchPayments();
      }
    } catch (error) {
      console.error('Error approving payment:', error);
      toast.error('Failed to approve payment');
    }
  };

  const handleRejectPayment = async () => {
    if (!selectedPayment) return;

    try {
      const tenantSubdomain = localStorage.getItem('tenantSubdomain') || '';
      const response = await axios.patch(
        `${API_URL}/api/treasurer/payments/${selectedPayment.id}/reject`,
        { reason: rejectionReason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-Tenant-Subdomain': tenantSubdomain,
          },
        }
      );

      if (response.data.success) {
        toast.success('Payment rejected');
        setShowRejectModal(false);
        setRejectionReason('');
        setSelectedPayment(null);
        fetchPayments();
      }
    } catch (error) {
      console.error('Error rejecting payment:', error);
      toast.error('Failed to reject payment');
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          payment.memberEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          payment.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const configs: Record<string, any> = {
      pending: { className: 'bg-yellow-50 text-yellow-600', label: 'Pending' },
      approved: { className: 'bg-green-50 text-green-600', label: 'Approved' },
      rejected: { className: 'bg-red-50 text-red-600', label: 'Rejected' },
    };
    const config = configs[status] || configs.pending;
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Payment Verification
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Review and verify pending payments
          </p>
        </div>
        <button
          onClick={fetchPayments}
          className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-gray-50 dark:border-gray-700"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800">
          <p className="text-sm text-gray-500">Total Pending</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {payments.filter(p => p.status === 'pending').length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800">
          <p className="text-sm text-gray-500">Total Amount Pending</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {formatCurrency(payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0))}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800">
          <p className="text-sm text-gray-500">Total Approved</p>
          <p className="text-2xl font-bold text-green-600">
            {payments.filter(p => p.status === 'approved').length}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or reference..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900"
        >
          <option value="pending">Pending</option>
          <option value="all">All Status</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Payments Table */}
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden dark:border-gray-800">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium text-gray-800 dark:text-white">
                        {payment.memberName}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {payment.memberEmail}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-white">
                    {formatCurrency(payment.amount)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    {payment.paymentMethod}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    {payment.referenceNumber}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(payment.submittedAt)}
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(payment.status)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {payment.status === 'pending' ? (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleApprovePayment(payment.id)}
                          className="p-1 hover:bg-green-50 rounded-lg transition-colors"
                          title="Approve"
                        >
                          <CheckCircle className="w-5 h-5 text-green-500 hover:text-green-600" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPayment(payment);
                            setShowRejectModal(true);
                          }}
                          className="p-1 hover:bg-red-50 rounded-lg transition-colors"
                          title="Reject"
                        >
                          <XCircle className="w-5 h-5 text-red-500 hover:text-red-600" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPayment(payment);
                            setShowProofModal(true);
                          }}
                          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View Proof"
                        >
                          <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedPayment(payment);
                          setShowProofModal(true);
                        }}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && selectedPayment && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-7 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Reject Payment
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Reject payment from {selectedPayment.memberName} ({formatCurrency(selectedPayment.amount)})
            </p>

            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Rejection Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter reason for rejection..."
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                  setSelectedPayment(null);
                }}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium hover:bg-gray-50 dark:border-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectPayment}
                disabled={!rejectionReason.trim()}
                className="flex-1 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
              >
                Reject Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Proof Modal */}
      {showProofModal && selectedPayment && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-7 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                Payment Proof
              </h3>
              <button onClick={() => setShowProofModal(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Member</p>
                <p className="font-medium text-gray-800 dark:text-white">{selectedPayment.memberName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="font-medium text-gray-800 dark:text-white">{formatCurrency(selectedPayment.amount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Reference</p>
                <p className="font-medium text-gray-800 dark:text-white">{selectedPayment.referenceNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Proof File</p>
                <a
                  href={selectedPayment.proofUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-brand-500 hover:underline"
                >
                  <FileText className="w-4 h-4" />
                  {selectedPayment.proofFileName}
                </a>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500">Proof preview would appear here</p>
                <p className="text-xs text-gray-400 mt-1">(In production, this would show the actual file)</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentVerification;