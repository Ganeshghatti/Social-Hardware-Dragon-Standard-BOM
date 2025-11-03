'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalParts: 0,
    activeWorkOrders: 0,
    pendingPOs: 0,
    qcIssues: 0,
    bomVersions: 0,
    lowStockAlerts: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all data in parallel
      const [partsRes, workOrdersRes, purchaseOrdersRes, qcRes, bomsRes, auditRes] = 
        await Promise.all([
          fetch('/api/parts'),
          fetch('/api/workorders'),
          fetch('/api/purchase-orders'),
          fetch('/api/qc'),
          fetch('/api/boms'),
          fetch('/api/reports/audit-logs').catch(() => ({ ok: false })),
        ]);

      const parts = await partsRes.json();
      const workOrders = await workOrdersRes.json();
      const purchaseOrders = await purchaseOrdersRes.json();
      const qcRecords = await qcRes.json();
      const boms = await bomsRes.json();

      // Calculate stats
      const activeWO = workOrders.filter(wo => wo.status === 'In Progress').length;
      const pendingPO = purchaseOrders.filter(po => po.status === 'Sent').length;
      const qcIssues = qcRecords.filter(qc => !qc.pass_fail).length;
      
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const recentQCIssues = qcRecords.filter(
        qc => !qc.pass_fail && new Date(qc.date) >= thirtyDaysAgo
      ).length;

      const lowStock = parts.filter(p => p.stock_qty <= (p.reorder_point || 0)).length;

      setStats({
        totalParts: parts.length,
        activeWorkOrders: activeWO,
        pendingPOs: pendingPO,
        qcIssues: recentQCIssues,
        bomVersions: boms.length,
        lowStockAlerts: lowStock,
      });

      // Try to fetch audit logs
      if (auditRes.ok) {
        const logs = await auditRes.json();
        setRecentActivity(logs.slice(0, 10));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Parts in Stock', value: stats.totalParts, icon: '⚙️', color: 'bg-blue-500' },
    { title: 'Active Work Orders', value: stats.activeWorkOrders, icon: '🦿', color: 'bg-green-500' },
    { title: 'Pending Purchase Orders', value: stats.pendingPOs, icon: '📝', color: 'bg-yellow-500' },
    { title: 'QC Issues (30 Days)', value: stats.qcIssues, icon: '🔍', color: 'bg-red-500' },
    { title: 'BOM Versions', value: stats.bomVersions, icon: '🧱', color: 'bg-purple-500' },
    { title: 'Low Stock Alerts', value: stats.lowStockAlerts, icon: '⚠️', color: 'bg-orange-500' },
  ];

  return (
    <Layout pageTitle="Dashboard">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {statCards.map((card, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{card.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                  </div>
                  <div className={`${card.color} rounded-full w-16 h-16 flex items-center justify-center text-3xl`}>
                    {card.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
            {recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {activity.action === 'CREATE' && '✨'}
                        {activity.action === 'UPDATE' && '✏️'}
                        {activity.action === 'DELETE' && '🗑️'}
                      </span>
                      <div>
                        <p className="text-gray-900 font-medium">
                          {activity.action} - {activity.collection}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No recent activity</p>
            )}
          </div>
        </>
      )}
    </Layout>
  );
}

