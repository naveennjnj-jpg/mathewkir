// pages/treasurer/PayoutRecords.tsx
import React, { useState, useEffect } from 'react';
import {
  Wallet,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Download,
  RefreshCw,
  Loader2,
  X,
  CheckCircle,
  AlertCircle,
  User,
  Calendar,
  DollarSign,
  FileText
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Payout {
  id: string;
  beneficiaryName: string;
  memberName: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  notes: string;
  payoutDate: string;
}

const PayoutRecords: React.FC = () => {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const [formData, setFormData] = useState({
    beneficiaryName: '',
    memberId: '',
    amount: '',
    date: '',
    notes: ''
  });

  const fetchPayouts = async () => {
    try {
      setLoading(true);
      const tenantSubdomain = localStorage.getItem('tenantSubdomain') || '';
      const response = await axios.get(`${API_URL}/api/treasurer/payouts`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Tenant-Subdomain': tenantSubdomain,
        },
      });

      if (response.data.success) {
        setPayouts(response.data.data);
      } else {
        setPayouts(getMockPayouts());
      }
    } catch (error) {
      console.error('Error fetching payouts:', error);
      setPayouts(getMockPayouts());
    } finally {
      setLoading(false);
    }
  };

  const getMockPayouts = (): Payout[] => [
    {
      id: '1',
      beneficiaryName: 'John Smith',
      memberName: 'TechCorp Solutions',
      amount: 5000,
      date: '2026-01-20',
      status: 'completed',
      notes: 'Monthly contribution payout',
      payoutDate: '2026-01-20'
    },
    {
      id: '2',
      beneficiaryName: 'Sarah Johnson',
      memberName: 'GreenLeaf Industries',
      amount: 3200,
      date: '2026-01-18',
      status: 'pending',
      notes: 'Special project funding',
      payoutDate: '2026-01-18'
    },
    {
      id: '3',
      beneficiaryName: 'Michael Brown',
      memberName: 'InnovateWorks',
      amount: 7500,
      date: '2026-01-15',
      status: 'completed',
      notes: 'Annual scholarship disbursement',
      payoutDate: '2026-01-15'
    }
  ];

  const handleAddPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tenantSubdomain = localStorage.getItem('tenantSubdomain') || '';
      const response = await axios.post(
        `${API_URL}/api/treasurer/payouts`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-Tenant-Subdomain': tenantSubdomain,
          },
        }
      );

      if (response.data.success) {
        toast.success('Payout added successfully');
        setShowAddModal(false);
        setFormData({
          beneficiaryName: '',
          memberId: '',
          amount: '',
          date: '',
          notes: ''
        });
        fetchPayouts();
      }
    } catch (error) {
      console.error('Error adding payout:', error);
      toast.error('Failed to add payout');
    }
  };

  const handleDeletePayout = async (payoutId: string) => {
    if (!confirm('Are you sure you want to delete this payout record?')) return;

    try {
      const tenantSubdomain = localStorage.getItem('tenantSubdomain') || '';
      const response = await axios.delete(
        `${API_URL}/api/treasurer/payouts/${payoutId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-Tenant-Subdomain': tenantSubdomain,
          },
        }
      );

      if (response.data.success) {
        toast.success('Payout deleted successfully');
        fetchPayouts();
      }
    } catch (error) {
      console.error('Error deleting payout:', error);
      toast.error('Failed to delete payout');
    }
  };

  const filteredPayouts = payouts.filter(payout =>
    payout.beneficiaryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payout.memberName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const configs: Record<string, any> = {
      completed: { className: 'bg-green-50 text-green-600', label: 'Completed' },
      pending: { className: 'bg-yellow-50 text-yellow-600', label: 'Pending' },
      failed: { className: 'bg-red-50 text-red-600', label: 'Failed' },
    };
    const config = configs[status] || configs.pending;
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  useEffect(() => {
    fetchPayouts();
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
            Payout Records
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage all payout records
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
          >
            <Plus className="w-4 h-4" />
            Add Payout Record
          </button>
          <button
            onClick={fetchPayouts}
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-gray-50 dark:border-gray-700"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search payouts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900"
          />
        </div>
      </div>

      {/* Payouts Table */}
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden dark:border-gray-800">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Beneficiary</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredPayouts.map((payout) => (
                <tr key={payout.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-white">
                    {payout.beneficiaryName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    {payout.memberName}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-white">
                    {formatCurrency(payout.amount)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(payout.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(payout.status)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                    {payout.notes || '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDeletePayout(payout.id)}
                        className="p-1 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Payout Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-7 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Add Payout Record</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPayout} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Beneficiary Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.beneficiaryName}
                  onChange={(e) => setFormData({ ...formData, beneficiaryName: e.target.value })}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Member
                </label>
                <input
                  type="text"
                  value={formData.memberId}
                  onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
                  placeholder="Member ID or Name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                    className="w-full rounded-lg border border-gray-300 pl-8 pr-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                  placeholder="Additional notes..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
                />
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium hover:bg-gray-50 dark:border-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
                >
                  Add Payout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayoutRecords;