// pages/treasurer/EditEvent.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  DollarSign,
  Users,
  FileText,
  Upload,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Save,
  Trash2
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status?: string;
}

interface Contribution {
  id: string;
  memberName: string;
  memberEmail: string;
  amountDue: number;
  amountPaid: number;
  status: string;
}

interface Beneficiary {
  id: string;
  name: string;
  relationship: string;
  contactInfo: string | null;
}

interface EventData {
  id: string;
  title: string;
  description: string;
  fixedAmount: number;
  deadline: string;
  status: string;
  totalCollected: number;
  totalMembers: number;
  paidCount: number;
  pendingCount: number;
  overdueCount: number;
  createdAt: string;
  creatorName: string;
  beneficiary: Beneficiary | null;
  supportingDocUrl: string | null;
  contributions: Contribution[];
}

const EditEvent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [removeFile, setRemoveFile] = useState(false);
  const [eventData, setEventData] = useState<EventData | null>(null);

  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fixedAmount: '',
    deadline: '',
    status: 'active',
    beneficiaryName: '',
    beneficiaryRelationship: '',
    beneficiaryId: ''
  });

  // Fetch event data and members
  useEffect(() => {
    fetchEventData();
    fetchMembers();
  }, [id]);

  const fetchEventData = async () => {
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
        setEventData(data);
        
        // Set form data with proper beneficiary mapping
        setFormData({
          title: data.title || '',
          description: data.description || '',
          fixedAmount: data.fixedAmount?.toString() || '',
          deadline: data.deadline ? new Date(data.deadline).toISOString().split('T')[0] : '',
          status: data.status || 'active',
          beneficiaryName: data.beneficiary?.name || '',
          beneficiaryRelationship: data.beneficiary?.relationship || '',
          beneficiaryId: data.beneficiary?.id || ''
        });
        
        // Set selected members from contributions
        if (data.contributions) {
          setSelectedMembers(data.contributions.map((c: Contribution) => c.id));
        }
      } else {
        toast.error(response.data.message || 'Failed to fetch event');
        navigate('/treasurer/events');
      }
    } catch (error: any) {
      console.error('Error fetching event:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch event');
      navigate('/treasurer/events');
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const tenantSubdomain = localStorage.getItem('tenantSubdomain') || '';
      const response = await axios.get(`${API_URL}/api/treasurer/members`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Tenant-Subdomain': tenantSubdomain,
        },
      });

      if (response.data.success) {
        setMembers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('Failed to fetch members');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const tenantSubdomain = localStorage.getItem('tenantSubdomain') || '';
      
      // Prepare data for API
      const submitData: any = {
        title: formData.title,
        description: formData.description,
        fixedAmount: parseFloat(formData.fixedAmount),
        deadline: formData.deadline,
        status: formData.status,
        beneficiaryName: formData.beneficiaryName,
        beneficiaryRelationship: formData.beneficiaryRelationship,
        memberIds: selectedMembers
      };

      // Handle file removal
      if (removeFile) {
        submitData.removeDocument = true;
      }

      // Send as JSON (not FormData)
      const response = await axios.put(
        `${API_URL}/api/treasurer/events/${id}`,
        submitData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-Tenant-Subdomain': tenantSubdomain,
            'Content-Type': 'application/json',
          },
        }
      );

      // Handle file upload separately if there's a new file
      if (file && response.data.success) {
        const fileFormData = new FormData();
        fileFormData.append('document', file);
        
        await axios.post(
          `${API_URL}/api/treasurer/events/${id}/upload-document`,
          fileFormData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'X-Tenant-Subdomain': tenantSubdomain,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      }

      if (response.data.success) {
        toast.success('Event updated successfully! 🎉');
        navigate(`/treasurer/events/${id}`);
      } else {
        toast.error(response.data.message || 'Failed to update event');
      }
    } catch (error: any) {
      console.error('Error updating event:', error);
      toast.error(error.response?.data?.message || 'Failed to update event');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      const tenantSubdomain = localStorage.getItem('tenantSubdomain') || '';
      const response = await axios.delete(`${API_URL}/api/treasurer/events/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Tenant-Subdomain': tenantSubdomain,
        },
      });

      if (response.data.success) {
        toast.success('Event deleted successfully 🗑️');
        navigate('/treasurer/events');
      } else {
        toast.error(response.data.message || 'Failed to delete event');
      }
    } catch (error: any) {
      console.error('Error deleting event:', error);
      toast.error(error.response?.data?.message || 'Failed to delete event');
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(members.map(m => m.id));
    }
    setSelectAll(!selectAll);
  };

  // Check if a member is selected based on their ID being in the contributions
  const isMemberSelected = (memberId: string) => {
    return eventData?.contributions?.some(c => c.id === memberId) || false;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  if (!eventData) {
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
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          to={`/treasurer/events/${id}`}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Event Details
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Edit Event
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Update event details and members
            </p>
          </div>
          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Event
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Event Details */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Event Details
          </h2>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Event Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Fixed Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={formData.fixedAmount}
                    onChange={(e) => setFormData({ ...formData, fixedAmount: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                    className="w-full rounded-lg border border-gray-300 pl-8 pr-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Deadline <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800"
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Select Members */}
        {/* <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Select Members
          </h2>

          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="w-4 h-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Select All Members</span>
              <span className="text-xs text-gray-400">
                ({selectedMembers.length} selected)
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto border rounded-lg p-2">
            {members.length === 0 ? (
              <div className="col-span-2 text-center py-4 text-gray-500">
                No members available. Please add members first.
              </div>
            ) : (
              members.map((member) => (
                <label 
                  key={member.id} 
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(member.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedMembers([...selectedMembers, member.id]);
                      } else {
                        setSelectedMembers(selectedMembers.filter(id => id !== member.id));
                      }
                    }}
                    className="w-4 h-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {member.name}
                    </span>
                    <span className="text-xs text-gray-400 block truncate">
                      {member.email}
                    </span>
                  </div>
                </label>
              ))
            )}
          </div>
        </div> */}

        {/* Beneficiary Info */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Beneficiary Info (Optional)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Beneficiary Name
              </label>
              <input
                type="text"
                value={formData.beneficiaryName}
                onChange={(e) => setFormData({ ...formData, beneficiaryName: e.target.value })}
                placeholder="Enter beneficiary name"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Relationship
              </label>
              <input
                type="text"
                value={formData.beneficiaryRelationship}
                onChange={(e) => setFormData({ ...formData, beneficiaryRelationship: e.target.value })}
                placeholder="e.g., Father, Mother, Spouse"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800"
              />
            </div>
          </div>
        </div>

        {/* Supporting Document */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Supporting Document (Optional)
          </h2>

          {eventData.supportingDocUrl && !removeFile && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500" />
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Current document
                  </span>
                  <span className="text-xs text-gray-400 block">
                    {eventData.supportingDocUrl.split('/').pop()}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRemoveFile(true)}
                className="text-sm text-red-500 hover:text-red-600 font-medium"
              >
                Remove
              </button>
            </div>
          )}

          {removeFile && eventData.supportingDocUrl && (
            <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <X className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Current document will be removed
                </span>
              </div>
              <button
                type="button"
                onClick={() => setRemoveFile(false)}
                className="text-sm text-brand-500 hover:text-brand-600 font-medium"
              >
                Undo
              </button>
            </div>
          )}

          <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            file ? 'border-green-500 bg-green-50 dark:bg-green-500/10' : 'border-gray-300 dark:border-gray-700'
          }`}>
            <input
              type="file"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];
                if (selectedFile) {
                  if (selectedFile.size > 5 * 1024 * 1024) {
                    toast.error('File size should be less than 5MB');
                    return;
                  }
                  setFile(selectedFile);
                }
              }}
              className="hidden"
              id="document"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            />
            <label htmlFor="document" className="cursor-pointer block">
              <Upload className={`w-12 h-12 mx-auto mb-3 ${
                file ? 'text-green-500' : 'text-gray-400'
              }`} />
              <p className="text-gray-600 dark:text-gray-300">
                {file ? file.name : 'Click to upload new document'}
              </p>
              <p className="text-sm text-gray-400">PDF, DOC, PNG, JPG (Max 5MB)</p>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <Link
            to={`/treasurer/events/${id}`}
            className="flex-1 rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 text-center dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 rounded-lg bg-brand-500 px-6 py-3 text-sm font-medium text-white hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Update Event
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEvent;