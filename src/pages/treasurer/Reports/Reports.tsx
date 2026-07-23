// pages/treasurer/Reports.tsx
import React, { useState } from 'react';
import {
  FileBarChart,
  Download,
  FileText,
  FileSpreadsheet,
  Calendar,
  Filter,
  RefreshCw,
  Loader2,
  ChevronDown,
  Printer,
  Mail
} from 'lucide-react';
import toast from 'react-hot-toast';

type ReportType = 'contributions' | 'dues' | 'payouts' | 'reconciliation';

const Reports: React.FC = () => {
  const [reportType, setReportType] = useState<ReportType>('contributions');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const reportTypes = [
    { id: 'contributions', label: 'Contributions' },
    { id: 'dues', label: 'Dues' },
    { id: 'payouts', label: 'Payouts' },
    { id: 'reconciliation', label: 'Reconciliation' },
  ];

  const mockPreviewData = [
    { date: '2026-01-20', member: 'John Doe', amount: 500, type: 'Contribution', status: 'Completed' },
    { date: '2026-01-19', member: 'Jane Smith', amount: 250, type: 'Dues', status: 'Pending' },
    { date: '2026-01-18', member: 'Mike Johnson', amount: 1000, type: 'Payout', status: 'Completed' },
    { date: '2026-01-17', member: 'Sarah Wilson', amount: 750, type: 'Contribution', status: 'Completed' },
  ];

  const handleGenerateReport = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setPreviewData(mockPreviewData);
      setShowPreview(true);
      setLoading(false);
      toast.success('Report generated successfully');
    }, 1500);
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    toast.success(`Report exported as ${format.toUpperCase()}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Reports
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Generate and export reports
          </p>
        </div>
      </div>

      {/* Report Configuration */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as ReportType)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
            >
              {reportTypes.map((type) => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              End Date
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleGenerateReport}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileBarChart className="w-4 h-4" />
                Generate Report
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preview Table */}
      {showPreview && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white">Report Preview</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {previewData.length} records found
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleExport('pdf')}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium hover:bg-gray-50 dark:border-gray-700"
              >
                <FileText className="w-4 h-4" />
                PDF
              </button>
              <button
                onClick={() => handleExport('excel')}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium hover:bg-gray-50 dark:border-gray-700"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Excel
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium hover:bg-gray-50 dark:border-gray-700"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {previewData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-white/5">
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      {row.date}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-white">
                      {row.member}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-white">
                      {formatCurrency(row.amount)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      {row.type}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        row.status === 'Completed'
                          ? 'bg-green-50 text-green-600'
                          : 'bg-yellow-50 text-yellow-600'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Total: {formatCurrency(previewData.reduce((sum, row) => sum + row.amount, 0))}
            </div>
            <div className="flex gap-2">
              <button className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">
                <Download className="w-4 h-4" />
                Download Report
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-700">
                <Mail className="w-4 h-4" />
                Email Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;