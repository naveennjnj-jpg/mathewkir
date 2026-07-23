// pages/treasurer/EventsList.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Plus,
  RefreshCw,
  Loader2,
  ChevronDown,
  Eye,
  Edit2,
  Trash2,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  MoreVertical,
  Archive,
  Mail
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Event {
  id: string;
  title: string;
  fixedAmount: number;
  deadline: string;
  status: 'active' | 'completed' | 'cancelled';
  totalCollected: number;
  totalMembers: number;
  paidCount: number;
  pendingCount: number;
  overdueCount: number;
  createdAt: string;
  creatorName: string;
}

interface EventSummary {
  total: number;
  active: number;
  completed: number;
  cancelled: number;
  totalCollected: number;
}

const EventsList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [summary, setSummary] = useState<EventSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Mock data for fallback
  const mockEvents: Event[] = [
    {
      id: '1',
      title: 'Annual Fundraiser 2026',
      fixedAmount: 500,
      deadline: '2026-12-31',
      status: 'active',
      totalCollected: 12500,
      totalMembers: 45,
      paidCount: 25,
      pendingCount: 15,
      overdueCount: 5,
      createdAt: '2026-01-15T10:00:00Z',
      creatorName: 'John Doe'
    },
    {
      id: '2',
      title: 'School Building Fund',
      fixedAmount: 300,
      deadline: '2026-06-30',
      status: 'active',
      totalCollected: 8400,
      totalMembers: 32,
      paidCount: 28,
      pendingCount: 4,
      overdueCount: 0,
      createdAt: '2026-02-01T14:30:00Z',
      creatorName: 'Jane Smith'
    },
    {
      id: '3',
      title: 'Community Support Program',
      fixedAmount: 1000,
      deadline: '2025-12-31',
      status: 'completed',
      totalCollected: 28000,
      totalMembers: 30,
      paidCount: 30,
      pendingCount: 0,
      overdueCount: 0,
      createdAt: '2025-10-15T09:00:00Z',
      creatorName: 'Mike Johnson'
    },
    {
      id: '4',
      title: 'Medical Aid Initiative',
      fixedAmount: 200,
      deadline: '2026-03-15',
      status: 'cancelled',
      totalCollected: 1200,
      totalMembers: 20,
      paidCount: 6,
      pendingCount: 14,
      overdueCount: 14,
      createdAt: '2026-01-20T11:00:00Z',
      creatorName: 'Sarah Wilson'
    },
    {
      id: '5',
      title: 'Education Scholarship Fund',
      fixedAmount: 750,
      deadline: '2026-08-15',
      status: 'active',
      totalCollected: 18750,
      totalMembers: 28,
      paidCount: 25,
      pendingCount: 3,
      overdueCount: 0,
      createdAt: '2026-03-01T16:45:00Z',
      creatorName: 'David Brown'
    }
  ];

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const tenantSubdomain = localStorage.getItem('tenantSubdomain') || '';
      
      const response = await axios.get(`${API_URL}/api/treasurer/events`, {
        params: {
          status: statusFilter !== 'all' ? statusFilter : undefined,
          page,
          limit: 10,
          search: searchTerm || undefined
        },
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Tenant-Subdomain': tenantSubdomain,
        },
      });

      if (response.data.success) {
        setEvents(response.data.data);
        setTotalPages(response.data.pagination?.totalPages || 1);
      } else {
        setEvents(mockEvents);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents(mockEvents);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const tenantSubdomain = localStorage.getItem('tenantSubdomain') || '';
      
      const response = await axios.get(`${API_URL}/api/treasurer/events/summary`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Tenant-Subdomain': tenantSubdomain,
        },
      });

      if (response.data.success) {
        setSummary(response.data.data);
      } else {
        setSummary({
          total: mockEvents.length,
          active: mockEvents.filter(e => e.status === 'active').length,
          completed: mockEvents.filter(e => e.status === 'completed').length,
          cancelled: mockEvents.filter(e => e.status === 'cancelled').length,
          totalCollected: mockEvents.reduce((sum, e) => sum + e.totalCollected, 0)
        });
      }
    } catch (error) {
      console.error('Error fetching summary:', error);
      setSummary({
        total: mockEvents.length,
        active: mockEvents.filter(e => e.status === 'active').length,
        completed: mockEvents.filter(e => e.status === 'completed').length,
        cancelled: mockEvents.filter(e => e.status === 'cancelled').length,
        totalCollected: mockEvents.reduce((sum, e) => sum + e.totalCollected, 0)
      });
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;

    try {
      const tenantSubdomain = localStorage.getItem('tenantSubdomain') || '';
      const response = await axios.delete(`${API_URL}/api/treasurer/events/${selectedEvent.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Tenant-Subdomain': tenantSubdomain,
        },
      });

      if (response.data.success) {
        toast.success('Event deleted successfully');
        setShowDeleteModal(false);
        setSelectedEvent(null);
        fetchEvents();
        fetchSummary();
      } else {
        toast.error(response.data.message || 'Failed to delete event');
      }
    } catch (error: any) {
      console.error('Error deleting event:', error);
      toast.error(error.response?.data?.message || 'Failed to delete event');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchEvents(), fetchSummary()]);
    toast.success('Events refreshed');
    setRefreshing(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const configs: Record<string, any> = {
      active: { className: 'bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-500', label: 'Active', icon: CheckCircle },
      completed: { className: 'bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-500', label: 'Completed', icon: CheckCircle },
      cancelled: { className: 'bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-500', label: 'Cancelled', icon: XCircle },
    };
    const config = configs[status] || configs.active;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const getProgressPercentage = (event: Event) => {
    return event.totalMembers > 0 ? Math.round((event.paidCount / event.totalMembers) * 100) : 0;
  };

  useEffect(() => {
    Promise.all([fetchEvents(), fetchSummary()]);
  }, [page, statusFilter]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page === 1) {
        fetchEvents();
      } else {
        setPage(1);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

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
            Events
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage all fundraising events
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <Link
            to="/treasurer/events/create"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Event
          </Link>
        </div>
      </div>

      {/* Summary Stats */}
      {summary && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 mb-6">
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Events</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{summary.total}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-500">{summary.active}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-500">{summary.completed}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-sm text-gray-500 dark:text-gray-400">Cancelled</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-500">{summary.cancelled}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Collected</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              {formatCurrency(summary.totalCollected)}
            </p>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search events by title..."
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
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {events.map((event) => (
          <div
            key={event.id}
            className="rounded-2xl border border-gray-200 bg-white overflow-hidden hover:shadow-md transition-shadow dark:border-gray-800 dark:bg-white/[0.03]"
          >
            {/* Event Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 dark:text-white truncate">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusBadge(event.status)}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(event.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <button
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors dark:hover:bg-gray-800"
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowDeleteModal(true);
                    }}
                  >
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* Event Stats */}
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Amount</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    {formatCurrency(event.fixedAmount)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Collected</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    {formatCurrency(event.totalCollected)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Members</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    {event.paidCount}/{event.totalMembers}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Progress</span>
                  <span>{getProgressPercentage(event)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1 dark:bg-gray-700">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      getProgressPercentage(event) === 100
                        ? 'bg-green-500'
                        : getProgressPercentage(event) > 50
                        ? 'bg-brand-500'
                        : 'bg-yellow-500'
                    }`}
                    style={{ width: `${getProgressPercentage(event)}%` }}
                  />
                </div>
              </div>

              {/* Deadline */}
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Deadline: {formatDate(event.deadline)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{event.overdueCount} overdue</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {event.creatorName}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Link
                  to={`/treasurer/events/${event.id}`}
                  className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors dark:hover:bg-gray-700"
                  title="View Details"
                >
                  <Eye className="w-4 h-4 text-gray-500" />
                </Link>
                <Link
                  to={`/treasurer/events/${event.id}/edit`}
                  className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors dark:hover:bg-gray-700"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4 text-gray-500" />
                </Link>
                <button
                  onClick={() => {
                    setSelectedEvent(event);
                    setShowDeleteModal(true);
                  }}
                  className="p-1.5 hover:bg-red-100 rounded-lg transition-colors dark:hover:bg-red-900/20"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No events found</p>
          <Link
            to="/treasurer/events/create"
            className="inline-block mt-2 text-brand-500 hover:underline"
          >
            Create your first event
          </Link>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-3 py-1 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="px-3 py-1 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedEvent && (
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
                  Are you sure you want to delete <strong>{selectedEvent.title}</strong>? 
                  This action cannot be undone.
                </p>
                {selectedEvent.totalCollected > 0 && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                    ⚠️ This event has collected {formatCurrency(selectedEvent.totalCollected)}. 
                    Delete will remove all associated data.
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedEvent(null);
                }}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium hover:bg-gray-50 dark:border-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteEvent}
                className="flex-1 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-600 transition-colors"
              >
                Delete Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsList;