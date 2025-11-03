'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import toast from 'react-hot-toast';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('bom');
  const [loading, setLoading] = useState(false);
  const [bomData, setBomData] = useState(null);
  const [inventoryData, setInventoryData] = useState(null);
  const [workOrdersData, setWorkOrdersData] = useState(null);

  const handleExportCSV = (data, filename) => {
    if (!data) return;
    toast.success('Export functionality coming soon!');
  };

  const handleExportPDF = () => {
    toast.success('Export functionality coming soon!');
  };

  const loadBOMReport = async () => {
    setLoading(true);
    try {
      toast.error('Please select a BOM to view cost breakdown');
      setLoading(false);
    } catch (error) {
      console.error('Error loading BOM report:', error);
      toast.error('Failed to load BOM report');
      setLoading(false);
    }
  };

  const loadInventoryReport = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reports/inventory');
      const data = await res.json();
      setInventoryData(data);
    } catch (error) {
      console.error('Error loading inventory report:', error);
      toast.error('Failed to load inventory report');
    } finally {
      setLoading(false);
    }
  };

  const loadWorkOrdersReport = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reports/workorders');
      const data = await res.json();
      setWorkOrdersData(data);
    } catch (error) {
      console.error('Error loading work orders report:', error);
      toast.error('Failed to load work orders report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'bom' && !bomData) loadBOMReport();
    if (activeTab === 'inventory' && !inventoryData) loadInventoryReport();
    if (activeTab === 'workorders' && !workOrdersData) loadWorkOrdersReport();
  }, [activeTab]);

  const tabs = [
    { id: 'bom', label: 'BOM Cost Breakdown' },
    { id: 'inventory', label: 'Inventory Valuation' },
    { id: 'workorders', label: 'Work Order Summary' },
    { id: 'supplier', label: 'Supplier Lead Time' },
  ];

  return (
    <Layout pageTitle="Reports">
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-[#ff6600] text-[#ff6600]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading...</div>
          ) : (
            <>
              {activeTab === 'bom' && (
                <div>
                  <p className="text-gray-600">BOM Cost Breakdown requires selecting a specific BOM.</p>
                </div>
              )}
              {activeTab === 'inventory' && inventoryData && (
                <div>
                  <div className="mb-4">
                    <p className="text-2xl font-bold text-gray-900">
                      Total Inventory Value: ${inventoryData.total_value.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex gap-3 mb-4">
                    <button
                      onClick={() => handleExportCSV(inventoryData, 'inventory')}
                      className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                      Export CSV
                    </button>
                    <button
                      onClick={handleExportPDF}
                      className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                      Export PDF
                    </button>
                  </div>
                </div>
              )}
              {activeTab === 'workorders' && workOrdersData && (
                <div>
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="text-2xl font-bold text-blue-900">{workOrdersData.total}</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Planned</p>
                      <p className="text-2xl font-bold text-yellow-900">{workOrdersData.planned}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">In Progress</p>
                      <p className="text-2xl font-bold text-blue-900">{workOrdersData.in_progress}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Completed</p>
                      <p className="text-2xl font-bold text-green-900">{workOrdersData.completed}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleExportCSV(workOrdersData, 'workorders')}
                      className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                      Export CSV
                    </button>
                    <button
                      onClick={handleExportPDF}
                      className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                      Export PDF
                    </button>
                  </div>
                </div>
              )}
              {activeTab === 'supplier' && (
                <div>
                  <p className="text-gray-600">Supplier Lead Time reports coming soon.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

