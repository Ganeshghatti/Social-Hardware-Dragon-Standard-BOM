'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import toast from 'react-hot-toast';

export default function QCPage() {
  const [qcRecords, setQcRecords] = useState([]);
  const [parts, setParts] = useState([]);
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    part_id: '',
    work_order_id: '',
    inspector: '',
    pass_fail: true,
    remarks: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [qcRes, partsRes, workOrdersRes] = await Promise.all([
        fetch('/api/qc'),
        fetch('/api/parts'),
        fetch('/api/workorders'),
      ]);
      const [qcData, partsData, workOrdersData] = await Promise.all([
        qcRes.json(),
        partsRes.json(),
        workOrdersRes.json(),
      ]);
      setQcRecords(qcData);
      setParts(partsData);
      setWorkOrders(workOrdersData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load QC records');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/qc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success('QC record created successfully');
        setShowModal(false);
        setFormData({
          part_id: '',
          work_order_id: '',
          inspector: '',
          pass_fail: true,
          remarks: '',
        });
        fetchData();
      } else {
        toast.error('Failed to create QC record');
      }
    } catch (error) {
      console.error('Error saving QC record:', error);
      toast.error('An error occurred');
    }
  };

  return (
    <Layout pageTitle="Quality Control">
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-2 bg-[#ff6600] text-white rounded-lg hover:bg-[#e55a00] transition-colors"
        >
          Add QC Record
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Part
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Work Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Inspector
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Result
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Remarks
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {qcRecords.map((record) => (
                  <tr key={record._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {parts.find((p) => p._id === record.part_id)?.name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.work_order_id || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.inspector}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {record.pass_fail ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          Pass
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                          Fail
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{record.remarks || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {qcRecords.length === 0 && (
            <div className="text-center py-12 text-gray-500">No QC records found</div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-4">Add QC Record</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Part</label>
                  <select
                    value={formData.part_id}
                    onChange={(e) => setFormData({ ...formData, part_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff6600]"
                  >
                    <option value="">Select Part (Optional)</option>
                    {parts.map((part) => (
                      <option key={part._id} value={part._id}>
                        {part.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Work Order
                  </label>
                  <input
                    type="text"
                    value={formData.work_order_id}
                    onChange={(e) =>
                      setFormData({ ...formData, work_order_id: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff6600]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Inspector *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.inspector}
                    onChange={(e) => setFormData({ ...formData, inspector: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff6600]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Result *
                  </label>
                  <select
                    value={formData.pass_fail}
                    onChange={(e) =>
                      setFormData({ ...formData, pass_fail: e.target.value === 'true' })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff6600]"
                  >
                    <option value="true">Pass</option>
                    <option value="false">Fail</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <textarea
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff6600]"
                  rows="3"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#ff6600] text-white rounded-md hover:bg-[#e55a00]"
                >
                  Create QC Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}

