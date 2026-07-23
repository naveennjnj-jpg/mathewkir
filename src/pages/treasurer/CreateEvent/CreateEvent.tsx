// pages/treasurer/CreateEvent.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  ArrowLeft
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Member {
  id: string;
  name: string;
  email: string;
}

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fixedAmount: '',
    deadline: '',
    beneficiaryName: '',
    beneficiaryRelationship: ''
  });

  useEffect(() => {
    fetchMembers();
  }, []);

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
    
    // Validation
    if (selectedMembers.length === 0) {
      toast.error('Please select at least one member');
      return;
    }

    setIsSubmitting(true);

    try {
      const tenantSubdomain = localStorage.getItem('tenantSubdomain') || '';
      const formDataToSend = new FormData();
      
      // Append all form fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('fixedAmount', formData.fixedAmount);
      formDataToSend.append('deadline', formData.deadline);
      formDataToSend.append('beneficiaryName', formData.beneficiaryName || '');
      formDataToSend.append('beneficiaryRelationship', formData.beneficiaryRelationship || '');
      formDataToSend.append('members', JSON.stringify(selectedMembers));
      
      if (file) {
        formDataToSend.append('document', file);
      }

      const response = await axios.post(
        `${API_URL}/api/treasurer/events`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-Tenant-Subdomain': tenantSubdomain,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        toast.success('Event created successfully!');
        // Reset form
        setFormData({
          title: '',
          description: '',
          fixedAmount: '',
          deadline: '',
          beneficiaryName: '',
          beneficiaryRelationship: ''
        });
        setSelectedMembers([]);
        setFile(null);
        setSelectAll(false);
        
        // Navigate to events list or event details
        navigate('/treasurer/events');
      } else {
        toast.error(response.data.message || 'Failed to create event');
      }
    } catch (error: any) {
      console.error('Error creating event:', error);
      toast.error(error.response?.data?.message || 'Failed to create event');
    } finally {
      setIsSubmitting(false);
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

  const handleRemoveFile = () => {
    setFile(null);
    // Reset the file input
    const fileInput = document.getElementById('document') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/treasurer/events')}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </button>
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Create Fundraising Event
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Set up a new fundraising event for your members
        </p>
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
                placeholder="Enter event title"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
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
                placeholder="Enter event description"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    placeholder="0.00"
                    className="w-full rounded-lg border border-gray-300 pl-8 pr-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
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
                  // min={new Date().toISOString().split('T')[0]}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Select Members */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Select Members
            </h2>
            <span className="text-sm text-gray-500">
              {selectedMembers.length} selected
            </span>
          </div>

          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="w-4 h-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Select All</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
            {members.length === 0 ? (
              <div className="col-span-2 text-center py-4 text-gray-500">
                No members found
              </div>
            ) : (
              members.map((member) => (
                <label key={member.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
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
                  <span className="text-sm text-gray-700 dark:text-gray-300">{member.name}</span>
                  <span className="text-xs text-gray-400">{member.email}</span>
                </label>
              ))
            )}
          </div>
        </div>

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
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
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
                placeholder="Enter relationship"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
              />
            </div>
          </div>
        </div>

        {/* Supporting Document */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Supporting Document (Optional)
          </h2>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0] || null;
                if (selectedFile) {
                  // Validate file size (5MB)
                  if (selectedFile.size > 5 * 1024 * 1024) {
                    toast.error('File size must be less than 5MB');
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
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-300">
                {file ? file.name : 'Click to upload supporting document'}
              </p>
              <p className="text-sm text-gray-400">PDF, DOC, PNG, JPG (Max 5MB)</p>
            </label>
            {file && (
              <button
                type="button"
                onClick={handleRemoveFile}
                className="mt-2 text-sm text-red-500 hover:text-red-600"
              >
                Remove file
              </button>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate('/treasurer/events')}
            className="flex-1 rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 rounded-lg bg-brand-500 px-6 py-3 text-sm font-medium text-white hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Save & Publish'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;