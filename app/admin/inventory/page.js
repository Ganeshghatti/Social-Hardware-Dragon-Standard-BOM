'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import toast from 'react-hot-toast';

export default function InventoryPage() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);
  const [adjustForm, setAdjustForm] = useState({ qty_change: 0, reason: '' });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await fetch('/api/inventory');
      const data = await res.json();
      setParts(data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleAdjust = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/inventory/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          part_id: selectedPart._id,
          qty_change: adjustForm.qty_change,
          reason: adjustForm.reason,
        }),
      });
      if (res.ok) {
        toast.success('Inventory adjusted successfully');
        setShowAdjustModal(false);
        setSelectedPart(null);
        setAdjustForm({ qty_change: 0, reason: '' });
        fetchInventory();
      } else {
        toast.error('Failed to adjust inventory');
      }
    } catch (error) {
      console.error('Error adjusting inventory:', error);
      toast.error('An error occurred');
    }
  };

  const lowStockParts = parts.filter((p) => p.stock_qty <= (p.reorder_point || 0));

  return (
    <Layout pageTitle="Inventory Management">
      {lowStockParts.length > 0 && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-bold text-red-800 mb-2">Low Stock Alerts</h3>
          <ul className="list-disc list-inside text-red-700">
            {lowStockParts.slice(0, 5).map((part) => (
              <li key={part._id}>
                {part.name}: {part.stock_qty} {part.unit} (Reorder at{' '}
                {part.reorder_point || 0})
              </li>
            ))}
            {lowStockParts.length > 5 && (
              <li className="font-bold">...and {lowStockParts.length - 5} more</li>
            )}
          </ul>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Item Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Current Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Reorder Point
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {parts.map((part) => (
                  <tr key={part._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {part.item_code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {part.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {part.stock_qty}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {part.reorder_point || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {part.stock_qty <= (part.reorder_point || 0) ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                          Low Stock
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedPart(part);
                          setShowAdjustModal(true);
                        }}
                        className="text-[#ff6600] hover:text-[#e55a00]"
                      >
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showAdjustModal && selectedPart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Adjust Stock</h2>
            <p className="text-gray-600 mb-4">
              Adjusting stock for: <strong>{selectedPart.name}</strong>
            </p>
            <form onSubmit={handleAdjust} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity Change (positive to add, negative to remove)
                </label>
                <input
                  type="number"
                  required
                  value={adjustForm.qty_change}
                  onChange={(e) =>
                    setAdjustForm({ ...adjustForm, qty_change: parseInt(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff6600]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
                <textarea
                  required
                  value={adjustForm.reason}
                  onChange={(e) => setAdjustForm({ ...adjustForm, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff6600]"
                  rows="3"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdjustModal(false);
                    setSelectedPart(null);
                    setAdjustForm({ qty_change: 0, reason: '' });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#ff6600] text-white rounded-md hover:bg-[#e55a00]"
                >
                  Adjust Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}

