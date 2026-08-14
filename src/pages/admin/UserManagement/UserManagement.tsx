// pages/superadmin/UserManagement.tsx
import React, { useState, useEffect, useMemo } from 'react';
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
  Clock,
  RefreshCw,
  Loader2,
  AlertCircle,
  DollarSign,
  Crown
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";


// Types
interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'member' | 'treasurer' | 'admin'; // admin = super admin
  tenant: string;
  tenantId: string | null;
  tenantStatus: string | null;
  status: string;
  joinedDate: Date;
  lastActive: Date;
  isSuperAdmin: boolean;
  stats: {
    memberships: number;
    verifiedContributions: number;
    createdEvents: number;
    payouts: number;
    notifications: number;
  };
  createdAt: Date;
}

interface Tenant {
  id: string;
  name: string;
  subdomain: string;
}

interface UserStats {
  totalUsers: number;
  superAdmins: number;
  activeUsers: number;
  pendingUsers: number;
  inactiveUsers: number;
  roleDistribution: Array<{ role: string; count: number }>;
  recentUsers: Array<{
    id: string;
    email: string;
    fullName: string;
    createdAt: Date;
    tenant: string;
  }>;
}

const UserManagement: React.FC = () => {
  // State
  const [users, setUsers] = useState<User[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [roles, setRoles] = useState<string[]>(['member', 'treasurer', 'admin']);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const navigate = useNavigate();
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [tenantFilter, setTenantFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [itemsPerPage] = useState(10);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'member', // Default role
    tenantId: '',
    password: ''
  });
  const [formLoading, setFormLoading] = useState(false);

  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Fetch users
  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {
        page,
        limit: itemsPerPage,
        sortBy: 'created_at',
        sortOrder: 'desc'
      };

      if (searchTerm) params.search = searchTerm;
      if (roleFilter !== 'all') params.role = roleFilter;
      if (tenantFilter !== 'all') params.tenantId = tenantFilter;
      if (statusFilter !== 'all') params.status = statusFilter;

      const response = await axios.get(`${API_URL}/api/admin/allusers`, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setUsers(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setTotalUsers(response.data.pagination.total);

        // Set filters
        if (response.data.filters) {
          setTenants(response.data.filters.tenants || []);
          setRoles(['member', 'treasurer', 'admin']);
        }
      } else {
        setError(response.data.message || 'Failed to fetch users');
        setUsers(getMockUsers());
      }
    } catch (error: any) {
      console.error('Error fetching users:', error);
      if (error.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Please make sure the backend is running.');
      } else {
        setError(error.response?.data?.message || 'Failed to fetch users');
      }
      setUsers(getMockUsers());
    } finally {
      setLoading(false);
    }
  };

  // Fetch user stats
  const fetchUserStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setUserStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  // Create user
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/api/admin/createuser`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setShowAddModal(false);
        setFormData({ fullName: '', email: '', role: 'member', tenantId: '', password: '' });
        fetchUsers(currentPage);
        fetchUserStats();
      }
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast.error(error.response?.data?.message || 'Failed to create user');
    } finally {
      setFormLoading(false);
    }
  };

  // Update user
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const response = await axios.put(
        `${API_URL}/api/admin/updateuser/${selectedUser?.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setShowEditModal(false);
        setSelectedUser(null);
        fetchUsers(currentPage);
        fetchUserStats();
      }
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast.error(error.response?.data?.message || 'Failed to update user');
    } finally {
      setFormLoading(false);
    }
  };

  // Delete user
  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      const response = await axios.delete(
        `${API_URL}/api/admin/deleteuser/${selectedUser.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setShowDeleteModal(false);
        setSelectedUser(null);
        fetchUsers(currentPage);
        fetchUserStats();
      }
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchUsers(currentPage), fetchUserStats()]);
    toast.success('Data refreshed successfully');
    setRefreshing(false);
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchUsers(newPage);
    }
  };

  // Handle edit user
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormData({
      fullName: user.name,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId || '',
      password: ''
    });
    setShowEditModal(true);
  };

  // Handle view user
  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  // Handle delete user
  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      role: 'member',
      tenantId: '',
      password: ''
    });
  };

  // Mock data
  const getMockUsers = (): User[] => [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@techcorp.com',
      role: 'admin',
      tenant: 'TechCorp Solutions',
      tenantId: '1',
      tenantStatus: 'active',
      status: 'active',
      joinedDate: new Date('2026-01-15'),
      lastActive: new Date('2026-01-20T14:30:00'),
      isSuperAdmin: true,
      stats: {
        memberships: 1,
        verifiedContributions: 5,
        createdEvents: 3,
        payouts: 2,
        notifications: 12
      },
      createdAt: new Date('2026-01-15')
    },
    {
      id: '2',
      name: 'Sarah Smith',
      email: 'sarah@greenleaf.com',
      role: 'treasurer',
      tenant: 'GreenLeaf Industries',
      tenantId: '2',
      tenantStatus: 'active',
      status: 'active',
      joinedDate: new Date('2026-01-10'),
      lastActive: new Date('2026-01-20T13:45:00'),
      isSuperAdmin: false,
      stats: {
        memberships: 1,
        verifiedContributions: 3,
        createdEvents: 2,
        payouts: 1,
        notifications: 8
      },
      createdAt: new Date('2026-01-10')
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@innovate.com',
      role: 'member',
      tenant: 'InnovateWorks',
      tenantId: '3',
      tenantStatus: 'active',
      status: 'pending',
      joinedDate: new Date('2026-01-05'),
      lastActive: new Date('2026-01-18T09:20:00'),
      isSuperAdmin: false,
      stats: {
        memberships: 1,
        verifiedContributions: 0,
        createdEvents: 0,
        payouts: 0,
        notifications: 2
      },
      createdAt: new Date('2026-01-05')
    },
    {
      id: '4',
      name: 'Emma Davis',
      email: 'emma@primeedge.com',
      role: 'member',
      tenant: 'PrimeEdge Solutions',
      tenantId: '4',
      tenantStatus: 'active',
      status: 'active',
      joinedDate: new Date('2025-12-20'),
      lastActive: new Date('2026-01-20T12:55:00'),
      isSuperAdmin: false,
      stats: {
        memberships: 1,
        verifiedContributions: 8,
        createdEvents: 5,
        payouts: 3,
        notifications: 15
      },
      createdAt: new Date('2025-12-20')
    },
    {
      id: '5',
      name: 'David Brown',
      email: 'david@apex.com',
      role: 'member',
      tenant: 'Apex Global',
      tenantId: '5',
      tenantStatus: 'active',
      status: 'suspended',
      joinedDate: new Date('2025-12-15'),
      lastActive: new Date('2026-01-15T10:30:00'),
      isSuperAdmin: false,
      stats: {
        memberships: 1,
        verifiedContributions: 0,
        createdEvents: 0,
        payouts: 0,
        notifications: 3
      },
      createdAt: new Date('2025-12-15')
    },
    {
      id: '6',
      name: 'Super Admin',
      email: 'superadmin@system.com',
      role: 'admin',
      tenant: 'System',
      tenantId: null,
      tenantStatus: null,
      status: 'active',
      joinedDate: new Date('2025-10-01'),
      lastActive: new Date('2026-01-20T14:45:00'),
      isSuperAdmin: true,
      stats: {
        memberships: 0,
        verifiedContributions: 0,
        createdEvents: 0,
        payouts: 0,
        notifications: 5
      },
      createdAt: new Date('2025-10-01')
    }
  ];

  // Mock tenants
  const getMockTenants = (): Tenant[] => [
    { id: '1', name: 'TechCorp Solutions', subdomain: 'techcorp' },
    { id: '2', name: 'GreenLeaf Industries', subdomain: 'greenleaf' },
    { id: '3', name: 'InnovateWorks', subdomain: 'innovate' },
    { id: '4', name: 'PrimeEdge Solutions', subdomain: 'primeedge' },
    { id: '5', name: 'Apex Global', subdomain: 'apex' },
  ];

  // Get role badge with correct styling
  const getRoleBadge = (role: string) => {
    const styles = {
      admin: 'bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400',
      treasurer: 'bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400',
      member: 'bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400'
    };
    return styles[role as keyof typeof styles] || styles.member;
  };

  // Get role icon
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-3 h-3" />;
      case 'treasurer':
        return <DollarSign className="w-3 h-3" />;
      default:
        return <Shield className="w-3 h-3" />;
    }
  };

  // Get role display name
  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'treasurer':
        return 'Treasurer';
      default:
        return 'Member';
    }
  };

  // Get status badge
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

  // Format date
  const formatDate = (date: Date) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  // Format datetime
  const formatDateTime = (date: Date) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchUsers(1);
    fetchUserStats();
    if (tenants.length === 0) {
      setTenants(getMockTenants());
    }
    if (roles.length === 0) {
      setRoles(['member', 'treasurer', 'admin']);
    }
  }, []);

  // Fetch when filters change (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, roleFilter, tenantFilter, statusFilter]);

  // Show loading state
  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-brand-500 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading users...</p>
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
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">User Management</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Manage all users across all tenants
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
                {/* <button
                  onClick={() => {
                    resetForm();
                    setShowAddModal(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  Add New Tenant
                </button> */}
                <button
                  onClick={() => navigate("/admin/tenants")}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  Add New Tenant
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            {userStats && (
             <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 mb-6">
                <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
                  <p className="text-xl font-bold text-gray-800 dark:text-white/90">{userStats.totalUsers}</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
                  <p className="text-xl font-bold text-green-600 dark:text-green-500">{userStats.activeUsers}</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
                  <p className="text-xl font-bold text-yellow-600 dark:text-yellow-500">{userStats.pendingUsers}</p>
                </div>
                {/* <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Admins</p>
                  <p className="text-xl font-bold text-purple-600 dark:text-purple-500">{userStats.superAdmins}</p>
                </div> */}
                <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Inactive</p>
                  <p className="text-xl font-bold text-gray-600 dark:text-gray-400">{userStats.inactiveUsers}</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Treasurers</p>
                  <p className="text-xl font-bold text-green-600 dark:text-green-500">
                    {userStats.roleDistribution?.find(r => r.role === 'treasurer')?.count || 0}
                  </p>
                </div>
              </div>
            )}

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

            {/* Filters */}
            <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-4">
              <div className="relative">
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
                  <option value="all">All Roles</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {getRoleDisplayName(role)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  value={tenantFilter}
                  onChange={(e) => setTenantFilter(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                >
                  <option value="all">All Tenants</option>
                  {tenants.map((tenant) => (
                    <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                  <option value="inactive">Inactive</option>
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
                      {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Active</th> */}
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                          <div className="flex flex-col items-center gap-2">
                            <Users className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                            <p>No users found</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500">
                              Try adjusting your search or filters
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium text-gray-800 dark:text-white/90">{user.name}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                              {user.phone && (
                                <p className="text-xs text-gray-400 dark:text-gray-500">{user.phone}</p>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${getRoleBadge(user.role)}`}>
                              {getRoleIcon(user.role)}
                              {getRoleDisplayName(user.role)}
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
                            {formatDate(user.joinedDate)}
                          </td>
                          {/* <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                            {formatDateTime(user.lastActive)}
                          </td> */}
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleViewUser(user)}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                                title="View details"
                              >
                                <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                              </button>
                              {/* <button
                                onClick={() => handleEditUser(user)}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                                title="Edit user"
                              >
                                <Edit2 className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                              </button> */}
                              <button
                                onClick={() => handleDeleteClick(user)}
                                className="p-1 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                title="Delete user"
                                disabled={user.isSuperAdmin}
                              >
                                <Trash2 className={`w-4 h-4 ${user.isSuperAdmin ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-red-500'}`} />
                              </button>
                            </div>
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
                    Page {currentPage} of {totalPages} ({totalUsers} users)
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:text-gray-400"
                    >
                      Previous
                    </button>
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

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#0E0909] border border-gray-200 dark:border-white/5 rounded-2xl p-7 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Add New User</h3>
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

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
                  required
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
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 bg-transparent pl-10 pr-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
                  required
                >
                  <option value="member">Member</option>
                  <option value="treasurer">Treasurer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {formData.role !== 'admin' && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Tenant <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.tenantId}
                    onChange={(e) => setFormData({ ...formData, tenantId: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
                    required
                  >
                    <option value="">Select Tenant</option>
                    {tenants.map((tenant) => (
                      <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Password
                </label>
                <input
                  type="text"
                  placeholder="Leave blank to auto-generate"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
                />
              </div>

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
                  disabled={formLoading}
                  className="flex-1 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors disabled:opacity-50"
                >
                  {formLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : (
                    'Create User'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal - Similar to Add but with update logic */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#0E0909] border border-gray-200 dark:border-white/5 rounded-2xl p-7 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Edit User</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedUser(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
                  required
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
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 bg-transparent pl-10 pr-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
                  required
                  disabled={selectedUser?.isSuperAdmin}
                >
                  <option value="member">Member</option>
                  <option value="treasurer">Treasurer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {formData.role !== 'admin' && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Tenant <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.tenantId}
                    onChange={(e) => setFormData({ ...formData, tenantId: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
                    required
                  >
                    <option value="">Select Tenant</option>
                    {tenants.map((tenant) => (
                      <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  New Password (leave blank to keep current)
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
                />
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedUser(null);
                  }}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors disabled:opacity-50"
                >
                  {formLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : (
                    'Update User'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View User Modal - Keep as is */}
      {showViewModal && selectedUser && (
        // ... (keep existing view modal code)
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#0E0909] border border-gray-200 dark:border-white/5 rounded-2xl p-7 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">User Details</h3>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedUser(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                  <p className="font-medium text-gray-800 dark:text-white/90">{selectedUser.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p className="font-medium text-gray-800 dark:text-white/90">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${getRoleBadge(selectedUser.role)}`}>
                    {getRoleIcon(selectedUser.role)}
                    {getRoleDisplayName(selectedUser.role)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                  {getStatusBadge(selectedUser.status)}
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tenant</p>
                  <p className="font-medium text-gray-800 dark:text-white/90">{selectedUser.tenant}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Joined Date</p>
                  <p className="font-medium text-gray-800 dark:text-white/90">{formatDate(selectedUser.joinedDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Last Active</p>
                  <p className="font-medium text-gray-800 dark:text-white/90">{formatDateTime(selectedUser.lastActive)}</p>
                </div>
                {selectedUser.phone && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="font-medium text-gray-800 dark:text-white/90">{selectedUser.phone}</p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Statistics</p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <div className="rounded-lg border border-gray-200 p-3 text-center dark:border-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Memberships</p>
                    <p className="text-lg font-bold text-gray-800 dark:text-white/90">{selectedUser.stats.memberships}</p>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-3 text-center dark:border-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Contributions</p>
                    <p className="text-lg font-bold text-gray-800 dark:text-white/90">{selectedUser.stats.verifiedContributions}</p>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-3 text-center dark:border-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Events</p>
                    <p className="text-lg font-bold text-gray-800 dark:text-white/90">{selectedUser.stats.createdEvents}</p>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-3 text-center dark:border-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Payouts</p>
                    <p className="text-lg font-bold text-gray-800 dark:text-white/90">{selectedUser.stats.payouts}</p>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-3 text-center dark:border-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Notifications</p>
                    <p className="text-lg font-bold text-gray-800 dark:text-white/90">{selectedUser.stats.notifications}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedUser(null);
                  }}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#0E0909] border border-gray-200 dark:border-white/5 rounded-2xl p-7 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Delete User</h3>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedUser(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to deactivate user <strong>{selectedUser.name}</strong> ({selectedUser.email})?
              This will remove their access to all tenants.
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedUser(null);
                }}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="flex-1 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-600 transition-colors"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;