import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Lock, Unlock, RefreshCw } from "lucide-react";
import StatCard from "./StatCard";

const EscrowDashboard = ({ escrowData }) => {
	if (!escrowData || !Array.isArray(escrowData)) {
		return <div className="text-zinc-400">No escrow data available</div>;
	}

	const calculateTotals = () => {
		return escrowData.reduce(
			(acc, item) => {
				if (item?.status) {
					acc[item.status] =
						(acc[item.status] || 0) + (item.credits_locked || 0);
				}
				return acc;
			},
			{ locked: 0, released: 0, refunded: 0 }
		);
	};

	const totals = calculateTotals();
	const COLORS = {
		locked: "#f59e0b", // Amber
		released: "#22c55e", // Green
		refunded: "#3b82f6", // Blue
	};

	const RADIAN = Math.PI / 180;
	const pieData = Object.entries(totals).map(([status, value]) => ({
		name: status.charAt(0).toUpperCase() + status.slice(1),
		value,
	}));

	const renderCustomizedLabel = ({
		cx,
		cy,
		midAngle,
		innerRadius,
		outerRadius,
		percent,
		value,
		name,
	}) => {
		const radius = outerRadius * 1.35;
		const x = cx + radius * Math.cos(-midAngle * RADIAN);
		const y = cy + radius * Math.sin(-midAngle * RADIAN);

		const formattedValue = `₹${(value * 150).toLocaleString()}`;

		return (
			<g>
				<path
					d={`M${cx + (outerRadius + 10) * Math.cos(-midAngle * RADIAN)},${
						cy + (outerRadius + 10) * Math.sin(-midAngle * RADIAN)
					}L${x},${y}`}
					stroke="#71717a"
					fill="none"
				/>

				<rect
					x={x - 80}
					y={y - 12}
					width="160"
					height="24"
					fill="rgba(0,0,0,0.8)"
					rx="4"
				/>

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
		<div>
			<div className="flex flex-col mb-6 mt-6">
				<h1 className="text-xl lg:text-2xl font-bold text-white">
					Escrow Dashboard
				</h1>
				<p className="text-sm text-zinc-400">
					Monitor and manage escrow transactions
				</p>
			</div>

			<div className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
						<h3 className="text-lg font-semibold text-white mb-6">
							Credit Distribution
						</h3>
						<div className="h-80">
							<ResponsiveContainer width="100%" height="100%">
								<PieChart>
									<Pie
										data={pieData}
										dataKey="value"
										nameKey="name"
										cx="50%"
										cy="50%"
										innerRadius={60}
										outerRadius={100}
										labelLine={false}
										label={renderCustomizedLabel}
									>
										{pieData.map((entry, index) => (
											<Cell
												key={`cell-${index}`}
												fill={COLORS[entry.name.toLowerCase()]}
												className="hover:opacity-80 transition-opacity duration-200"
											/>
										))}
									</Pie>
									<Legend content={<CustomLegend />} />
								</PieChart>
							</ResponsiveContainer>
						</div>
					</div>

					<div className="bg-black rounded-lg border border-zinc-800 p-6">
						<h3 className="text-lg font-semibold text-white mb-4">
							Recent Activity
						</h3>
						<div className="space-y-4">
							{escrowData.slice(0, 5).map((escrow, index) => (
								<div
									key={index}
									className="flex items-center gap-4 p-3 rounded-lg bg-zinc-900/50"
								>
									{escrow?.status && (
										<>
											{escrow.status === "locked" && (
												<Lock className="w-5 h-5 text-yellow-500" />
											)}
											{escrow.status === "released" && (
												<Unlock className="w-5 h-5 text-green-500" />
											)}
											{escrow.status === "refunded" && (
												<RefreshCw className="w-5 h-5 text-blue-500" />
											)}
											<div>
												<p className="text-sm text-zinc-300">
													{escrow.credits_locked} Credits (₹
													{escrow.credits_locked * 150})
												</p>
												<p className="text-xs text-zinc-500">
													Booking #{escrow.booking_id} •{" "}
													{new Date(escrow.created_at).toLocaleDateString()}
												</p>
											</div>
											<span
												className={`ml-auto text-xs font-medium px-2 py-1 rounded-full ${
													escrow.status === "locked"
														? "bg-yellow-900/30 text-yellow-500"
														: escrow.status === "released"
														? "bg-green-900/30 text-green-500"
														: "bg-blue-900/30 text-blue-500"
												}`}
											>
												{escrow.status.charAt(0).toUpperCase() +
													escrow.status.slice(1)}
											</span>
										</>
									)}
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EscrowDashboard;
