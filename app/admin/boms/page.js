'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import toast from 'react-hot-toast';

export default function BOMsPage() {
  const [boms, setBoms] = useState([]);
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    product_id: '',
    type: 'assembly',
    version: '1.0',
    items: [],
  });

  useEffect(() => {
    fetchBOMs();
    fetchParts();
  }, []);

  const fetchBOMs = async () => {
    try {
      const res = await fetch('/api/boms');
      const data = await res.json();
      setBoms(data);
    } catch (error) {
      console.error('Error fetching BOMs:', error);
      toast.error('Failed to load BOMs');
    } finally {
      setLoading(false);
    }
  };

  const fetchParts = async () => {
    try {
      const res = await fetch('/api/parts');
      const data = await res.json();
      setParts(data);
    } catch (error) {
      console.error('Error fetching parts:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/boms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success('BOM created successfully');
        setShowModal(false);
        setFormData({ product_id: '', type: 'assembly', version: '1.0', items: [] });
        fetchBOMs();
      } else {
        toast.error('Failed to create BOM');
      }
    } catch (error) {
      console.error('Error saving BOM:', error);
      toast.error('An error occurred');
    }
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { part_id: '', qty: 1 }],
    });
  };

  const updateItem = (index, field, value) => {
    const items = [...formData.items];
    items[index] = { ...items[index], [field]: field === 'qty' ? parseInt(value) : value };
    setFormData({ ...formData, items });
  };

  const removeItem = (index) => {
    const items = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items });
  };

  return (
    <Layout pageTitle="BOMs Management">
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-2 bg-[#ff6600] text-white rounded-lg hover:bg-[#e55a00] transition-colors"
        >
          Add BOM
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
                    Product ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Version
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Items Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {boms.map((bom) => (
                  <tr key={bom._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {bom.product_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {bom.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      v{bom.version}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {bom.items?.length || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(bom.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {boms.length === 0 && (
            <div className="text-center py-12 text-gray-500">No BOMs found</div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Add New BOM</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.product_id}
                    onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff6600]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff6600]"
                  >
                    <option value="assembly">Assembly</option>
                    <option value="component">Component</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Version *</label>
                  <input
                    type="text"
                    required
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff6600]"
                  />
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">Items</label>
                  <button
                    type="button"
                    onClick={addItem}
                    className="text-sm text-[#ff6600] hover:text-[#e55a00]"
                  >
                    + Add Item
                  </button>
                </div>
                {formData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-3 gap-3 mb-3">
                    <select
                      required
                      value={item.part_id}
                      onChange={(e) => updateItem(index, 'part_id', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff6600]"
                    >
                      <option value="">Select Part</option>
                      {parts.map((part) => (
                        <option key={part._id} value={part._id}>
                          {part.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Quantity"
                      required
                      value={item.qty}
                      onChange={(e) => updateItem(index, 'qty', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff6600]"
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
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
                  Create BOM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}

