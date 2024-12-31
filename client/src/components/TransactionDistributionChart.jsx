import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const TransactionDistributionChart = ({ data }) => {
    const COLORS = ['#3b82f6', '#ef4444', '#f59e0b'];
    const RADIAN = Math.PI / 180;
  
    // Custom label renderer for the pie chart
    const renderCustomizedLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
        value,
        name
      }) => {
        const radius = outerRadius * 1.35;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
      
        // Format the value as currency
        const formattedValue = new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          maximumFractionDigits: 0
        }).format(value);
      
        return (
          <g>
            {/* Line from slice to label */}
            <path
              d={`M${cx + (outerRadius + 10) * Math.cos(-midAngle * RADIAN)},${
                cy + (outerRadius + 10) * Math.sin(-midAngle * RADIAN)
              }L${x},${y}`}
              stroke="#71717a"
              fill="none"
            />
            
            {/* Label background */}
            <rect
              x={x - 80} /* Center-adjusted for the wider background */
              y={y - 12}
              width="160" /* Increased width from 120 to 160 */
              height="24"
              fill="rgba(0,0,0,0.8)"
              rx="4"
            />
            
            {/* Label text */}
            <text
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs"
              fill="white"
            >
              {`${name} (${(percent * 100).toFixed(1)}%)`}
            </text>
            
            {/* Value text */}
            <text
              x={x}
              y={y + 20}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs font-semibold"
              fill="#a1a1aa"
            >
              {formattedValue}
            </text>
          </g>
        );
      };
      
  
    // Custom legend
    const CustomLegend = ({ payload }) => (
      <div className="flex justify-center gap-8 mt-8">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-zinc-400">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  
    return (
      <div className="bg-black rounded-lg border border-zinc-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Transaction Distribution</h3>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                labelLine={false}
                label={renderCustomizedLabel}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    className="hover:opacity-80 transition-opacity duration-200"
                  />
                ))}
              </Pie>
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };
  
  export default TransactionDistributionChart;