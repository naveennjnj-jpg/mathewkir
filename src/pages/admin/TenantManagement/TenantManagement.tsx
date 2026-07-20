// pages/superadmin/TenantManagement.tsx
import React, { useState } from 'react';
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
  AlertCircle
} from 'lucide-react';

const TenantManagement: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => { if (window.innerWidth < 1024) setIsSidebarOpen(false); };

  const tenants = [
    {
      id: 1,
      name: 'TechCorp Solutions',
      subdomain: 'techcorp',
      status: 'active',
      createdDate: '2026-01-15',
      treasurer: 'john@techcorp.com',
      bankAccount: '****7890',
      members: 45,
      totalFunds: '$124,500'
    },
    {
      id: 2,
      name: 'GreenLeaf Industries',
      subdomain: 'greenleaf',
      status: 'active',
      createdDate: '2026-01-10',
      treasurer: 'sarah@greenleaf.com',
      bankAccount: '****3456',
      members: 32,
      totalFunds: '$89,200'
    },
    {
      id: 3,
      name: 'InnovateWorks',
      subdomain: 'innovate',
      status: 'pending',
      createdDate: '2026-01-05',
      treasurer: 'mike@innovate.com',
      bankAccount: '****1234',
      members: 0,
      totalFunds: '$0'
    },
    {
      id: 4,
      name: 'PrimeEdge Solutions',
      subdomain: 'primeedge',
      status: 'active',
      createdDate: '2025-12-20',
      treasurer: 'emma@primeedge.com',
      bankAccount: '****5678',
      members: 28,
      totalFunds: '$67,800'
    },
    {
      id: 5,
      name: 'Apex Global',
      subdomain: 'apex',
      status: 'suspended',
      createdDate: '2025-12-15',
      treasurer: 'david@apex.com',
      bankAccount: '****9012',
      members: 15,
      totalFunds: '$45,300'
    },
  ];

  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tenant.subdomain.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tenant.treasurer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tenant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex h-screen overflow-hidden">

      <div className="relative flex flex-col flex-1 overflow-x-hidden overflow-y-auto">

        <main>
          <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
            {/* Header */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">Tenant Management</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage all tenants across the platform</p>
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
                </select>
                <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
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
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tenant Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Subdomain</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Treasurer</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Members</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Funds</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {filteredTenants.map((tenant) => (
                      <tr key={tenant.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                        <td className="px-4 py-3">
                          <span className="font-medium text-gray-800 dark:text-white/90">{tenant.name}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-500 dark:text-gray-400">{tenant.subdomain}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            tenant.status === 'active'
                              ? 'bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-500'
                              : tenant.status === 'pending'
                              ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-500'
                              : 'bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-500'
                          }`}>
                            {tenant.status === 'active' && <CheckCircle className="w-3 h-3" />}
                            {tenant.status === 'pending' && <Clock className="w-3 h-3" />}
                            {tenant.status === 'suspended' && <XCircle className="w-3 h-3" />}
                            {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                          {new Date(tenant.createdDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{tenant.treasurer}</td>
                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{tenant.members}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-white/90">{tenant.totalFunds}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors">
                              <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                            </button>
                            <button className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors">
                              <Edit2 className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                            </button>
                            <button className="p-1 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
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

            {/* Add Tenant Modal */}
            {showAddModal && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-[#0E0909] border border-gray-200 dark:border-white/5 rounded-2xl p-7 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Add New Tenant</h3>
                    <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Tenant Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter tenant name"
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
                          type="password"
                          placeholder="Enter bank account reference"
                          className="w-full rounded-lg border border-gray-300 bg-transparent pl-10 pr-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">This is a secure field for financial reconciliation</p>
                    </div>

                    <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-800">
                      <button
                        type="button"
                        onClick={() => setShowAddModal(false)}
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
                      >
                        Create Tenant
                      </button>
                    </div>
                  </form>
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