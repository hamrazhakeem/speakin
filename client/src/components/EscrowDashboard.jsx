import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Lock, Unlock, RefreshCw, Database } from 'lucide-react';

const StatCard = ({ title, value, subtext, icon: Icon }) => (
  <div className="bg-black rounded-lg border border-zinc-800 p-6">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-zinc-400">{title}</p>
        <h3 className="text-2xl font-bold text-white mt-2">{value}</h3>
        {subtext && <p className="text-sm text-zinc-500 mt-1">{subtext}</p>}
      </div>
      <div className="p-3 bg-zinc-900 rounded-lg">
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

const EscrowDashboard = ({ escrowData }) => {
  if (!escrowData || !Array.isArray(escrowData)) {
    return <div className="text-zinc-400">No escrow data available</div>;
  }

  const calculateTotals = () => {
    return escrowData.reduce((acc, item) => {
      if (item?.status) {
        acc[item.status] = (acc[item.status] || 0) + (item.credits_locked || 0);
      }
      return acc;
    }, { locked: 0, released: 0, refunded: 0 });
  };

  const totals = calculateTotals();
  const totalCredits = Object.values(totals).reduce((a, b) => a + b, 0);

  const pieData = Object.entries(totals).map(([status, value]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value
  }));

  const COLORS = {
    locked: '#fbbf24',
    released: '#22c55e',
    refunded: '#3b82f6'
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Credits"
          value={totalCredits}
          subtext={`₹${totalCredits * 150}`}
          icon={Database}
        />
        <StatCard
          title="Locked Credits"
          value={totals.locked}
          subtext={`₹${totals.locked * 150}`}
          icon={Lock}
        />
        <StatCard
          title="Released Credits"
          value={totals.released}
          subtext={`₹${totals.released * 150}`}
          icon={Unlock}
        />
        <StatCard
          title="Refunded Credits"
          value={totals.refunded}
          subtext={`₹${totals.refunded * 150}`}
          icon={RefreshCw}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-black rounded-lg border border-zinc-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Credit Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[entry.name.toLowerCase()]} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} Credits (₹${value * 150})`]}
                  contentStyle={{ background: '#18181b', border: '1px solid #27272a' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-black rounded-lg border border-zinc-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {escrowData.slice(0, 5).map((escrow, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-zinc-900/50">
                {escrow?.status && (
                  <>
                    {escrow.status === 'locked' && <Lock className="w-5 h-5 text-yellow-500" />}
                    {escrow.status === 'released' && <Unlock className="w-5 h-5 text-green-500" />}
                    {escrow.status === 'refunded' && <RefreshCw className="w-5 h-5 text-blue-500" />}
                    <div>
                      <p className="text-sm text-zinc-300">
                        {escrow.credits_locked} Credits (₹{escrow.credits_locked * 150})
                      </p>
                      <p className="text-xs text-zinc-500">
                        Booking #{escrow.booking_id} • {new Date(escrow.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`ml-auto text-xs font-medium px-2 py-1 rounded-full ${
                      escrow.status === 'locked' ? 'bg-yellow-900/30 text-yellow-500' :
                      escrow.status === 'released' ? 'bg-green-900/30 text-green-500' :
                      'bg-blue-900/30 text-blue-500'
                    }`}>
                      {escrow.status.charAt(0).toUpperCase() + escrow.status.slice(1)}
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EscrowDashboard;