// pages/superadmin/UserManagement.tsx
import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  UserCheck,
  UserX,
  Mail,
  Shield,
  Building2,
  ChevronDown,
  Eye,
  X,
  UserPlus,
  Clock
} from 'lucide-react';

const UserManagement: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [tenantFilter, setTenantFilter] = useState('all');

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => { if (window.innerWidth < 1024) setIsSidebarOpen(false); };

  const users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@techcorp.com',
      role: 'admin',
      tenant: 'TechCorp Solutions',
      status: 'active',
      joinedDate: '2026-01-15',
      lastActive: '2026-01-20 14:30'
    },
    {
      id: 2,
      name: 'Sarah Smith',
      email: 'sarah@greenleaf.com',
      role: 'admin',
      tenant: 'GreenLeaf Industries',
      status: 'active',
      joinedDate: '2026-01-10',
      lastActive: '2026-01-20 13:45'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@innovate.com',
      role: 'user',
      tenant: 'InnovateWorks',
      status: 'pending',
      joinedDate: '2026-01-05',
      lastActive: '2026-01-18 09:20'
    },
    {
      id: 4,
      name: 'Emma Davis',
      email: 'emma@primeedge.com',
      role: 'admin',
      tenant: 'PrimeEdge Solutions',
      status: 'active',
      joinedDate: '2025-12-20',
      lastActive: '2026-01-20 12:55'
    },
    {
      id: 5,
      name: 'David Brown',
      email: 'david@apex.com',
      role: 'user',
      tenant: 'Apex Global',
      status: 'suspended',
      joinedDate: '2025-12-15',
      lastActive: '2026-01-15 10:30'
    },
    {
      id: 6,
      name: 'Super Admin',
      email: 'superadmin@system.com',
      role: 'superadmin',
      tenant: 'System',
      status: 'active',
      joinedDate: '2025-10-01',
      lastActive: '2026-01-20 14:45'
    },
  ];

  const tenants = [
    { id: 'all', name: 'All Tenants' },
    { id: 'techcorp', name: 'TechCorp Solutions' },
    { id: 'greenleaf', name: 'GreenLeaf Industries' },
    { id: 'innovate', name: 'InnovateWorks' },
    { id: 'primeedge', name: 'PrimeEdge Solutions' },
    { id: 'apex', name: 'Apex Global' },
  ];

  const roles = [
    { id: 'all', name: 'All Roles' },
    { id: 'superadmin', name: 'Super Admin' },
    { id: 'admin', name: 'Admin' },
    { id: 'user', name: 'User' },
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesTenant = tenantFilter === 'all' || 
                          user.tenant.toLowerCase().includes(tenantFilter.toLowerCase());
    return matchesSearch && matchesRole && matchesTenant;
  });

  const getRoleBadge = (role: string) => {
    const styles = {
      superadmin: 'bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400',
      admin: 'bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400',
      user: 'bg-gray-50 text-gray-600 dark:bg-gray-500/15 dark:text-gray-400'
    };
    return styles[role as keyof typeof styles] || styles.user;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-600 dark:bg-green-500/15 dark:text-green-500">
        <UserCheck className="w-3 h-3" />
        Active
      </span>;
    } else if (status === 'pending') {
      return <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2.5 py-0.5 text-xs font-medium text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-500">
        <Clock className="w-3 h-3" />
        Pending
      </span>;
    } else {
      return <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-600 dark:bg-red-500/15 dark:text-red-500">
        <UserX className="w-3 h-3" />
        Suspended
      </span>;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">

      <div className="relative flex flex-col flex-1 overflow-x-hidden overflow-y-auto">

        <main>
          <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
            {/* Header */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">User Management</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Manage all users across all tenants
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                Add New User
              </button>
            </div>

            {/* Filters */}
            <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-4">
              <div className="relative sm:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                />
              </div>
              <div>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  value={tenantFilter}
                  onChange={(e) => setTenantFilter(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                >
                  {tenants.map((tenant) => (
                    <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tenant</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Joined</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Active</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-gray-800 dark:text-white/90">{user.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${getRoleBadge(user.role)}`}>
                            <Shield className="w-3 h-3" />
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                            <Building2 className="w-3.5 h-3.5 text-gray-400" />
                            {user.tenant}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {getStatusBadge(user.status)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                          {new Date(user.joinedDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                          {user.lastActive}
                        </td>
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

            {/* Add User Modal */}
            {showAddModal && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-[#0E0909] border border-gray-200 dark:border-white/5 rounded-2xl p-7 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Add New User</h3>
                    <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter full name"
                        className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          placeholder="user@email.com"
                          className="w-full rounded-lg border border-gray-300 bg-transparent pl-10 pr-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Role <span className="text-red-500">*</span>
                      </label>
                      <select className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="superadmin">Super Admin</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Tenant
                      </label>
                      <select className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90">
                        <option value="">Select Tenant</option>
                        {tenants.filter(t => t.id !== 'all').map((tenant) => (
                          <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                        ))}
                      </select>
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
                        Create User
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

export default UserManagement;