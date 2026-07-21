// pages/superadmin/TenantManagement.tsx
import React, { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Filter,
  ChevronDown,
  X,
  Mail,
  Key,
  AlertCircle,
  Loader2
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  status: 'active' | 'pending' | 'suspended' | 'inactive';
  createdDate: string;
  treasurer: string;
  treasurerEmail: string;
  bankAccount?: string;
  members: number;
  totalFunds: number;
  maxMembers?: number;
  subscriptionTier?: string;
  settings?: any;
}

interface TenantFormData {
  name: string;
  subdomain: string;
  treasurerEmail: string;
  bankAccount?: string;
  maxMembers?: number;
  subscriptionTier?: string;
}

const TenantManagement: React.FC = () => {
  const { login, error, setError } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [formData, setFormData] = useState<TenantFormData>({
    name: '',
    subdomain: '',
    treasurerEmail: '',
    bankAccount: '',
    maxMembers: 100,
    subscriptionTier: 'basic'
  });
  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Fetch tenants on mount
  useEffect(() => {
    fetchTenants();
  }, []);

  // Fetch tenants from API
  const fetchTenants = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/admin/tenants`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setTenants(response.data.data);
      } else {
        toast.error('Failed to fetch tenants');
      }
    } catch (error: any) {
      console.error('Error fetching tenants:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch tenants');
      // Fallback to mock data if API fails
      setTenants(getMockTenants());
    } finally {
      setLoading(false);
    }
  };

  // Mock data for fallback
  const getMockTenants = (): Tenant[] => {
    return [
      {
        id: '1',
        name: 'TechCorp Solutions',
        subdomain: 'techcorp',
        status: 'active',
        createdDate: '2026-01-15',
        treasurer: 'John Doe',
        treasurerEmail: 'john@techcorp.com',
        bankAccount: '****7890',
        members: 45,
        totalFunds: 124500
      },
      {
        id: '2',
        name: 'GreenLeaf Industries',
        subdomain: 'greenleaf',
        status: 'active',
        createdDate: '2026-01-10',
        treasurer: 'Sarah Smith',
        treasurerEmail: 'sarah@greenleaf.com',
        bankAccount: '****3456',
        members: 32,
        totalFunds: 89200
      },
      {
        id: '3',
        name: 'InnovateWorks',
        subdomain: 'innovate',
        status: 'pending',
        createdDate: '2026-01-05',
        treasurer: 'Mike Johnson',
        treasurerEmail: 'mike@innovate.com',
        bankAccount: '****1234',
        members: 0,
        totalFunds: 0
      },
      {
        id: '4',
        name: 'PrimeEdge Solutions',
        subdomain: 'primeedge',
        status: 'active',
        createdDate: '2025-12-20',
        treasurer: 'Emma Wilson',
        treasurerEmail: 'emma@primeedge.com',
        bankAccount: '****5678',
        members: 28,
        totalFunds: 67800
      },
      {
        id: '5',
        name: 'Apex Global',
        subdomain: 'apex',
        status: 'suspended',
        createdDate: '2025-12-15',
        treasurer: 'David Brown',
        treasurerEmail: 'david@apex.com',
        bankAccount: '****9012',
        members: 15,
        totalFunds: 45300
      },
    ];
  };

  // Create new tenant
  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const response = await axios.post(
        `${API_URL}/api/admin/tenants`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        console.log("ceated");
        toast.success('Tenant created successfully!');
        setShowAddModal(false);
        resetForm();
        fetchTenants();
      } else {
        toast.error(response.data.message || 'Failed to create tenant');
      }
    } catch (error: any) {
      console.error('Error creating tenant:', error);
      toast.error(error.response?.data?.message || 'Failed to create tenant');
    } finally {
      setSubmitting(false);
    }
  };

  // Update tenant
  const handleUpdateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTenant) return;

    try {
      setSubmitting(true);
      const response = await axios.put(
        `${API_URL}/api/admin/tenants/${selectedTenant.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success('Tenant updated successfully!');
        setShowEditModal(false);
        resetForm();
        fetchTenants();
      } else {
        toast.error(response.data.message || 'Failed to update tenant');
      }
    } catch (error: any) {
      console.error('Error updating tenant:', error);
      toast.error(error.response?.data?.message || 'Failed to update tenant');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete tenant
  const handleDeleteTenant = async () => {
    if (!selectedTenant) return;

    try {
      setSubmitting(true);
      const response = await axios.delete(
        `${API_URL}/api/admin/tenants/${selectedTenant.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success('Tenant deleted successfully!');
        setShowDeleteModal(false);
        setSelectedTenant(null);
        fetchTenants();
      } else {
        toast.error(response.data.message || 'Failed to delete tenant');
      }
    } catch (error: any) {
      console.error('Error deleting tenant:', error);
      toast.error(error.response?.data?.message || 'Failed to delete tenant');
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle tenant status
  const toggleTenantStatus = async (tenant: Tenant) => {
    const newStatus = tenant.status === 'active' ? 'suspended' : 'active';
    try {
      const response = await axios.patch(
        `${API_URL}/api/admin/tenants/${tenant.id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(`Tenant ${newStatus === 'active' ? 'activated' : 'suspended'} successfully!`);
        fetchTenants();
      } else {
        toast.error(response.data.message || 'Failed to update status');
      }
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      subdomain: '',
      treasurerEmail: '',
      bankAccount: '',
      maxMembers: 100,
      subscriptionTier: 'basic'
    });
    setSelectedTenant(null);
  };

  // Open edit modal
  const openEditModal = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setFormData({
      name: tenant.name,
      subdomain: tenant.subdomain,
      treasurerEmail: tenant.treasurerEmail,
      bankAccount: tenant.bankAccount || '',
      maxMembers: tenant.maxMembers || 100,
      subscriptionTier: tenant.subscriptionTier || 'basic'
    });
    setShowEditModal(true);
  };

  // Open delete modal
  const openDeleteModal = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setShowDeleteModal(true);
  };

  // Filter tenants
  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.subdomain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.treasurer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.treasurerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tenant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const configs = {
      active: {
        class: 'bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-500',
        icon: CheckCircle
      },
      pending: {
        class: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-500',
        icon: Clock
      },
      suspended: {
        class: 'bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-500',
        icon: XCircle
      },
      inactive: {
        class: 'bg-gray-50 text-gray-600 dark:bg-gray-500/15 dark:text-gray-400',
        icon: XCircle
      }
    };

    const config = configs[status as keyof typeof configs] || configs.inactive;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.class}`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-brand-500 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading tenants...</p>
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
                  Tenant Management
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {tenants.length} tenants across the platform
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add New Tenant
              </button>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tenants by name, subdomain, or treasurer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                />
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                  <option value="inactive">Inactive</option>
                </select>
                <button
                  onClick={() => {
                    // Export functionality
                    const csv = filteredTenants.map(t =>
                      `${t.name},${t.subdomain},${t.status},${t.treasurer},${t.members},${t.totalFunds}`
                    ).join('\n');
                    const blob = new Blob([`Name,Subdomain,Status,Treasurer,Members,Total Funds\n${csv}`], { type: 'text/csv' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'tenants_export.csv';
                    a.click();
                    window.URL.revokeObjectURL(url);
                  }}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>

            {/* Tenant Table */}
            <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Tenant Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Subdomain
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Created Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Treasurer
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Members
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Total Funds
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {filteredTenants.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                          <div className="flex flex-col items-center gap-2">
                            <Building2 className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                            <p>No tenants found</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500">
                              Try adjusting your search or filters
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredTenants.map((tenant) => (
                        <tr key={tenant.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-500/20 flex items-center justify-center text-brand-600 dark:text-brand-400 font-semibold text-xs">
                                {tenant.name.charAt(0)}
                              </div>
                              <span className="font-medium text-gray-800 dark:text-white/90">
                                {tenant.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {tenant.subdomain}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {getStatusBadge(tenant.status)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                            {new Date(tenant.createdDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm">
                              <div className="font-medium text-gray-800 dark:text-white/90">
                                {tenant.treasurer}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {tenant.treasurerEmail}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                            {tenant.members}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-white/90">
                            {formatCurrency(tenant.totalFunds)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => toggleTenantStatus(tenant)}
                                className={`p-1 rounded-lg transition-colors ${tenant.status === 'active'
                                    ? 'hover:bg-yellow-50 dark:hover:bg-yellow-500/10 text-yellow-600'
                                    : 'hover:bg-green-50 dark:hover:bg-green-500/10 text-green-600'
                                  }`}
                                title={tenant.status === 'active' ? 'Suspend' : 'Activate'}
                              >
                                {tenant.status === 'active' ? (
                                  <XCircle className="w-4 h-4" />
                                ) : (
                                  <CheckCircle className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                onClick={() => openEditModal(tenant)}
                                className="p-1 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors text-blue-600"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openDeleteModal(tenant)}
                                className="p-1 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add Tenant Modal */}
            {showAddModal && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-[#0E0909] border border-gray-200 dark:border-white/5 rounded-2xl p-7 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                      Add New Tenant
                    </h3>
                    <button
                      onClick={() => {
                        setShowAddModal(false);
                        resetForm();
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateTenant} className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Tenant Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter tenant name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Subdomain <span className="text-red-500">*</span>
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          placeholder="your-tenant"
                          value={formData.subdomain}
                          onChange={(e) => setFormData({ ...formData, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                          required
                          className="flex-1 rounded-l-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
                        />
                        <span className="inline-flex items-center rounded-r-lg border border-l-0 border-gray-300 bg-gray-50 px-4 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                          .yourdomain.com
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">Must be unique across the platform</p>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Treasurer Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          placeholder="treasurer@email.com"
                          value={formData.treasurerEmail}
                          onChange={(e) => setFormData({ ...formData, treasurerEmail: e.target.value })}
                          required
                          className="w-full rounded-lg border border-gray-300 bg-transparent pl-10 pr-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">An invitation will be sent to this email</p>
                    </div>



                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Bank Account Reference
                      </label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Enter bank account reference"
                          value={formData.bankAccount}
                          onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                          className="w-full rounded-lg border border-gray-300 bg-transparent pl-10 pr-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">This is a secure field for financial reconciliation</p>
                    </div>

                    {/* <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Max Members
                      </label>
                      <input
                        type="number"
                        placeholder="100"
                        value={formData.maxMembers}
                        onChange={(e) => setFormData({ ...formData, maxMembers: parseInt(e.target.value) || 0 })}
                        className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Subscription Tier
                      </label>
                      <select
                        value={formData.subscriptionTier}
                        onChange={(e) => setFormData({ ...formData, subscriptionTier: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
                      >
                        <option value="basic">Basic</option>
                        <option value="pro">Professional</option>
                        <option value="enterprise">Enterprise</option>
                      </select>
                    </div> */}

                    <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-800">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddModal(false);
                          resetForm();
                        }}
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          'Create Tenant'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Edit Tenant Modal */}
            {showEditModal && selectedTenant && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-[#0E0909] border border-gray-200 dark:border-white/5 rounded-2xl p-7 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                      Edit Tenant
                    </h3>
                    <button
                      onClick={() => {
                        setShowEditModal(false);
                        resetForm();
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleUpdateTenant} className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Tenant Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter tenant name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Subdomain <span className="text-red-500">*</span>
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          placeholder="your-tenant"
                          value={formData.subdomain}
                          onChange={(e) => setFormData({ ...formData, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                          required
                          className="flex-1 rounded-l-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
                        />
                        <span className="inline-flex items-center rounded-r-lg border border-l-0 border-gray-300 bg-gray-50 px-4 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                          .yourdomain.com
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Treasurer Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          placeholder="treasurer@email.com"
                          value={formData.treasurerEmail}
                          onChange={(e) => setFormData({ ...formData, treasurerEmail: e.target.value })}
                          required
                          className="w-full rounded-lg border border-gray-300 bg-transparent pl-10 pr-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Bank Account Reference
                      </label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Enter bank account reference"
                          value={formData.bankAccount}
                          onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                          className="w-full rounded-lg border border-gray-300 bg-transparent pl-10 pr-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">This is a secure field for financial reconciliation</p>
                    </div>

                    {/* <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Max Members
                      </label>
                      <input
                        type="number"
                        placeholder="100"
                        value={formData.maxMembers}
                        onChange={(e) => setFormData({ ...formData, maxMembers: parseInt(e.target.value) || 0 })}
                        className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Subscription Tier
                      </label>
                      <select
                        value={formData.subscriptionTier}
                        onChange={(e) => setFormData({ ...formData, subscriptionTier: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
                      >
                        <option value="basic">Basic</option>
                        <option value="pro">Professional</option>
                        <option value="enterprise">Enterprise</option>
                      </select>
                    </div> */}

                    <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-800">
                      <button
                        type="button"
                        onClick={() => {
                          setShowEditModal(false);
                          resetForm();
                        }}
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          'Update Tenant'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Delete Tenant Modal */}
            {showDeleteModal && selectedTenant && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-[#0E0909] border border-gray-200 dark:border-white/5 rounded-2xl p-7 w-full max-w-md">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                        Delete Tenant
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Are you sure you want to delete <strong>{selectedTenant.name}</strong>?
                        This action cannot be undone and will remove all associated data.
                      </p>
                    </div>
                  </div>

                  <div className="bg-red-50 dark:bg-red-500/10 rounded-lg p-4 mb-6">
                    <p className="text-sm text-red-600 dark:text-red-400">
                      <strong>Warning:</strong> This will permanently delete the tenant,
                      all users, transactions, and associated data.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowDeleteModal(false);
                        setSelectedTenant(null);
                      }}
                      className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteTenant}
                      disabled={submitting}
                      className="flex-1 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        'Delete Tenant'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TenantManagement;