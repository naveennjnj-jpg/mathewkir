// pages/treasurer/EventDetails.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Search,
  Download,
  Mail,
  FileText,
  Printer,
  RefreshCw,
  Loader2,
  ChevronDown,
  Eye,
  Edit2,
  Trash2,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  ArrowLeft
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface EventDetails {
  id: string;
  title: string;
  description: string;
  fixedAmount: number;
  deadline: string;
  status: 'active' | 'completed' | 'cancelled';
  totalCollected: number;
  totalMembers: number;
  paidCount: number;
  pendingCount: number;
  overdueCount: number;
  createdAt: string;
  creatorName?: string;
  beneficiaryName?: string;
  beneficiaryRelationship?: string;
  supportingDocUrl?: string;
}

interface MemberContribution {
  id: string;
  memberName: string;
  memberEmail: string;
  amountDue: number;
  amountPaid: number;
  status: 'paid' | 'pending' | 'overdue';
  paymentMethod?: string;
  paymentDate?: string;
  contributionId?: string;
}

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [contributions, setContributions] = useState<MemberContribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [showSendReminder, setShowSendReminder] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Fetch event details from API
  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const tenantSubdomain = localStorage.getItem('tenantSubdomain') || '';
      
      const response = await axios.get(`${API_URL}/api/treasurer/events/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Tenant-Subdomain': tenantSubdomain,
        },
      });

      if (response.data.success) {
        const data = response.data.data;
        setEvent({
          id: data.id,
          title: data.title,
          description: data.description || '',
          fixedAmount: data.fixedAmount,
          deadline: data.deadline,
          status: data.status,
          totalCollected: data.totalCollected,
          totalMembers: data.totalMembers,
          paidCount: data.paidCount,
          pendingCount: data.pendingCount,
          overdueCount: data.overdueCount,
          createdAt: data.createdAt,
          creatorName: data.creatorName,
          beneficiaryName: data.beneficiaryName,
          beneficiaryRelationship: data.beneficiaryRelationship,
          supportingDocUrl: data.supportingDocUrl
        });
        setContributions(data.contributions || []);
      } else {
        toast.error(response.data.message || 'Failed to fetch event details');
        navigate('/treasurer/events');
      }
    } catch (error: any) {
      console.error('Error fetching event details:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch event details');
      navigate('/treasurer/events');
    } finally {
      setLoading(false);
    }
  };

  // Handle send reminder
  const handleSendReminder = async () => {
    if (selectedMembers.length === 0) {
      toast.error('Please select at least one member');
      return;
    }

    try {
      const tenantSubdomain = localStorage.getItem('tenantSubdomain') || '';
      const response = await axios.post(
        `${API_URL}/api/treasurer/events/${id}/remind`,
        { memberIds: selectedMembers },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-Tenant-Subdomain': tenantSubdomain,
          },
        }
      );

      if (response.data.success) {
        toast.success(`Reminder sent to ${selectedMembers.length} members`);
        setShowSendReminder(false);
        setSelectedMembers([]);
      } else {
        toast.error(response.data.message || 'Failed to send reminders');
      }
    } catch (error: any) {
      console.error('Error sending reminder:', error);
      toast.error(error.response?.data?.message || 'Failed to send reminders');
    }
  };

  // Handle delete event
  const handleDeleteEvent = async () => {
    setDeleting(true);
    try {
      const tenantSubdomain = localStorage.getItem('tenantSubdomain') || '';
      const response = await axios.delete(`${API_URL}/api/treasurer/events/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Tenant-Subdomain': tenantSubdomain,
        },
      });

      if (response.data.success) {
        toast.success('Event deleted successfully');
        navigate('/treasurer/events');
      } else {
        toast.error(response.data.message || 'Failed to delete event');
      }
    } catch (error: any) {
      console.error('Error deleting event:', error);
      toast.error(error.response?.data?.message || 'Failed to delete event');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // Handle export
  const handleExport = (format: 'excel' | 'pdf') => {
    toast.success(`Exporting as ${format.toUpperCase()}...`);
    // Implement export logic here
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchEventDetails();
    toast.success('Event details refreshed');
    setRefreshing(false);
  };

  // Filter contributions
  const filteredContributions = contributions.filter(contribution => {
    const matchesSearch = contribution.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contribution.memberEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contribution.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Format helpers
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Status badge
  const getStatusBadge = (status: string) => {
    const configs: Record<string, any> = {
      paid: { className: 'bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-500', label: 'Paid', icon: CheckCircle },
      pending: { className: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-500', label: 'Pending', icon: Clock },
      overdue: { className: 'bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-500', label: 'Overdue', icon: AlertCircle },
    };
    const config = configs[status] || configs.pending;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'text-green-600 bg-green-50 dark:bg-green-500/15';
      case 'completed': return 'text-blue-600 bg-blue-50 dark:bg-blue-500/15';
      case 'cancelled': return 'text-red-600 bg-red-50 dark:bg-red-500/15';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-500/15';
    }
  };

  // Calculate progress
  const progressPercentage = event && event.totalMembers > 0 
    ? Math.round((event.paidCount / event.totalMembers) * 100) 
    : 0;

  // Fetch on mount
  useEffect(() => {
    if (id) {
      fetchEventDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">Event not found</p>
          <Link to="/treasurer/events" className="text-brand-500 hover:underline mt-2 inline-block">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to="/treasurer/events"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Link>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
              {event.title}
            </h1>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusColor(event.status)}`}>
              {event.status}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {event.description}
          </p>
          {event.creatorName && (
            <p className="text-xs text-gray-400 mt-1">
              Created by {event.creatorName} • {formatDate(event.createdAt)}
            </p>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <Link
            to={`/treasurer/events/${id}/edit`}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
          <button
            onClick={() => setShowSendReminder(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-3 py-2 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
          >
            <Mail className="w-4 h-4" />
            Send Reminder
          </button>
          <button
            onClick={() => handleExport('excel')}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <FileText className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Event Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-3 dark:bg-blue-500/15">
              <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Collected</p>
              <p className="text-xl font-bold text-gray-800 dark:text-white">
                {formatCurrency(event.totalCollected)}
              </p>
              <p className="text-xs text-gray-400">
                {event.paidCount} of {event.totalMembers} members paid
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-yellow-50 p-3 dark:bg-yellow-500/15">
              <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending Amount</p>
              <p className="text-xl font-bold text-gray-800 dark:text-white">
                {formatCurrency((event.totalMembers - event.paidCount) * event.fixedAmount)}
              </p>
              <p className="text-xs text-gray-400">
                {event.pendingCount} members pending
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-red-50 p-3 dark:bg-red-500/15">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Overdue Members</p>
              <p className="text-xl font-bold text-gray-800 dark:text-white">
                {event.overdueCount}
              </p>
              <p className="text-xs text-gray-400">
                Past deadline
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-purple-50 p-3 dark:bg-purple-500/15">
              <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Deadline</p>
              <p className="text-xl font-bold text-gray-800 dark:text-white">
                {formatDate(event.deadline)}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(event.deadline) > new Date() ? 'Active' : 'Past due'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Collection Progress</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {event.paidCount} out of {event.totalMembers} members have paid
            </p>
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {progressPercentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div
            className={`h-2.5 rounded-full transition-all duration-500 ${
              progressPercentage === 100
                ? 'bg-green-500'
                : progressPercentage > 50
                ? 'bg-brand-500'
                : 'bg-yellow-500'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Beneficiary Info */}
      {event.beneficiaryName && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 mb-6">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Beneficiary</p>
              <p className="font-medium text-gray-800 dark:text-white">
                {event.beneficiaryName}
                {event.beneficiaryRelationship && (
                  <span className="text-sm text-gray-500 ml-2">
                    ({event.beneficiaryRelationship})
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Contributions Table */}
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden dark:border-gray-800">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white">Member Contributions</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filteredContributions.length} members
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-48 rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Due</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Paid</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredContributions.map((contribution) => (
                <tr key={contribution.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium text-gray-800 dark:text-white">
                        {contribution.memberName}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {contribution.memberEmail}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-white">
                    {formatCurrency(contribution.amountDue)}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-white">
                    {formatCurrency(contribution.amountPaid)}
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(contribution.status)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    {contribution.paymentMethod || '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(contribution.paymentDate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredContributions.length} of {contributions.length} members
          </div>
          <button
            onClick={() => setShowSendReminder(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
          >
            <Mail className="w-4 h-4" />
            Send Reminders
          </button>
        </div>
      </div>

      {/* Send Reminder Modal */}
      {showSendReminder && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-7 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                Send Reminders
              </h3>
              <button onClick={() => setShowSendReminder(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select Members
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {contributions
                    .filter(c => c.status !== 'paid')
                    .map((contribution) => (
                      <label key={contribution.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedMembers.includes(contribution.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedMembers([...selectedMembers, contribution.id]);
                            } else {
                              setSelectedMembers(selectedMembers.filter(id => id !== contribution.id));
                            }
                          }}
                          className="w-4 h-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {contribution.memberName}
                        </span>
                        <span className={`text-xs ${getStatusBadge(contribution.status)}`}>
                          {contribution.status}
                        </span>
                      </label>
                    ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowSendReminder(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium hover:bg-gray-50 dark:border-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendReminder}
                  disabled={selectedMembers.length === 0}
                  className="flex-1 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
                >
                  Send to {selectedMembers.length} Members
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-7 w-full max-w-md">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Delete Event
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Are you sure you want to delete <strong>{event.title}</strong>? 
                  This action cannot be undone.
                </p>
                {event.totalCollected > 0 && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                    ⚠️ This event has collected {formatCurrency(event.totalCollected)}. 
                    Delete will remove all associated data.
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium hover:bg-gray-50 dark:border-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteEvent}
                disabled={deleting}
                className="flex-1 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete Event'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;