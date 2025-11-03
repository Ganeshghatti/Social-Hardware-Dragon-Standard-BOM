'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import toast from 'react-hot-toast';

export default function PurchaseOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    supplier_id: '',
    status: 'Draft',
    items: [],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ordersRes, suppliersRes, partsRes] = await Promise.all([
        fetch('/api/purchase-orders'),
        fetch('/api/suppliers'),
        fetch('/api/parts'),
      ]);
      const [ordersData, suppliersData, partsData] = await Promise.all([
        ordersRes.json(),
        suppliersRes.json(),
        partsRes.json(),
      ]);
      setOrders(ordersData);
      setSuppliers(suppliersData);
      setParts(partsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/purchase-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success('Purchase order created successfully');
        setShowModal(false);
        setFormData({ supplier_id: '', status: 'Draft', items: [] });
        fetchData();
      } else {
        toast.error('Failed to create purchase order');
      }
    } catch (error) {
      console.error('Error saving purchase order:', error);
      toast.error('An error occurred');
    }
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { part_id: '', qty: 1, cost: 0 }],
    });
  };

  const updateItem = (index, field, value) => {
    const items = [...formData.items];
    items[index] = {
      ...items[index],
      [field]: field === 'qty' || field === 'cost' ? parseFloat(value) : value,
    };
    setFormData({ ...formData, items });
  };

  const removeItem = (index) => {
    const items = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items });
  };

  return (
    <Layout pageTitle="Purchase Orders">
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-2 bg-[#ff6600] text-white rounded-lg hover:bg-[#e55a00] transition-colors"
        >
          Add Purchase Order
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
                    Supplier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Items Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {suppliers.find((s) => s._id === order.supplier_id)?.name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.items?.length || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          order.status === 'Received'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'Sent'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {orders.length === 0 && (
            <div className="text-center py-12 text-gray-500">No purchase orders found</div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Add New Purchase Order</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Supplier *
                  </label>
                  <select
                    required
                    value={formData.supplier_id}
                    onChange={(e) => setFormData({ ...formData, supplier_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff6600]"
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier._id} value={supplier._id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff6600]"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Sent">Sent</option>
                    <option value="Received">Received</option>
                  </select>
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
                  <div key={index} className="grid grid-cols-4 gap-3 mb-3">
                    <select
                      required
                      value={item.part_id}
                      onChange={(e) => updateItem(index, 'part_id', e.target.value)}
                      className="col-span-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff6600]"
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
                      placeholder="Qty"
                      required
                      value={item.qty}
                      onChange={(e) => updateItem(index, 'qty', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff6600]"
                    />
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Cost"
                        required
                        step="0.01"
                        value={item.cost}
                        onChange={(e) => updateItem(index, 'cost', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff6600]"
                      />
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-800 px-2"
                      >
                        ×
                      </button>
                    </div>
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
                  Create Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}

