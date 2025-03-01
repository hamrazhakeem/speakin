import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";
import Avatar from "../../common/ui/Avatar";
import Dialog from "./Dialog";

const ReportsTable = ({ reports, activeTab, onResolve }) => {
	const [selectedReport, setSelectedReport] = useState(null);
	const [expandedReport, setExpandedReport] = useState(null);
	const [resolvingReport, setResolvingReport] = useState(null);
	const [response, setResponse] = useState("");

	if (reports.length === 0) {
		return (
			<div className="p-8 text-center">
				<AlertTriangle className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
				<h3 className="text-lg font-medium text-white mb-2">
					No Reports Found
				</h3>
				<p className="text-zinc-400">
					{activeTab === "pending"
						? "There are no pending reports to review"
						: activeTab === "responded"
						? "No responded reports available"
						: "No reports have been submitted yet"}
				</p>
			</div>
		);
	}

	const handleResolveClick = (reportId) => {
		setResolvingReport(reportId);
		setResponse("");
	};

	const handleSubmitResponse = (reportId, bookingId, reporterId) => {
		if (response.trim()) {
			onResolve(reportId, response, bookingId, reporterId);
			setResolvingReport(null);
			setResponse("");
		}
	};

	return (
		<>
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead>
						<tr className="text-left text-sm text-zinc-400">
							<th className="p-4">Reporter</th>
							<th className="p-4">Tutor</th>
							<th className="p-4">Description</th>
							<th className="p-4">Status</th>
							<th className="p-4">Actions</th>
						</tr>
					</thead>
					<tbody>
						{reports.map((report) => (
							<React.Fragment key={report.id}>
								<tr className="border-t border-zinc-800">
									<td className="p-4">
										<div className="flex items-center gap-3">
											<Avatar
												src={report.reporter_details?.profile_image}
												name={report.reporter_details?.name}
												size={40}
											/>
											<div>
												<div className="font-medium text-white">
													{report.reporter_details?.name || "Unknown"}
												</div>
											</div>
										</div>
									</td>
									<td className="p-4">
										<div className="flex items-center gap-3">
											<Avatar
												src={report.tutor_details?.profile_image}
												name={report.tutor_details?.name}
												size={40}
											/>
											<div>
												<div className="font-medium text-white">
													{report.tutor_details?.tutor_details?.speakin_name ||
														"Unknown"}
												</div>
												<div className="mt-2 flex gap-3 text-sm">
													<span className="text-zinc-400">
														Total:{" "}
														<span className="text-white">
															{report.tutorStats.totalReports}
														</span>
													</span>
													<span className="text-zinc-400">
														Pending:{" "}
														<span className="text-yellow-500">
															{report.tutorStats.pendingReports}
														</span>
													</span>
													<span className="text-zinc-400">
														Resolved:{" "}
														<span className="text-green-500">
															{report.tutorStats.respondedReports}
														</span>
													</span>
												</div>
												<button
													onClick={() =>
														setExpandedReport(
															expandedReport === report.id ? null : report.id
														)
													}
													className="mt-2 text-sm text-blue-500 hover:text-blue-400"
												>
													{expandedReport === report.id
														? "Hide History"
														: "View History"}
												</button>
											</div>
										</div>
									</td>
									<td className="p-4">
										<button
											onClick={() => setSelectedReport(report)}
											className="text-sm text-blue-500 hover:text-blue-400 mt-1"
										>
											View Details
										</button>
									</td>
									<td className="p-4">
										<span
											className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
												report.status === "pending"
													? "bg-yellow-500/10 text-yellow-500"
													: "bg-green-500/10 text-green-500"
											}`}
										>
											{report.status}
										</span>
									</td>
									<td className="p-4">
										{report.status === "pending" && (
											<>
												{resolvingReport === report.id ? (
													<div className="space-y-2">
														<textarea
															value={response}
															onChange={(e) => setResponse(e.target.value)}
															placeholder="Enter your response..."
															className="w-full px-3 py-2 text-sm bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
															rows="3"
														/>
														<div className="flex gap-2">
															<button
																onClick={() =>
																	handleSubmitResponse(
																		report.id,
																		report.booking.id,
																		report.reporter_id
																	)
																}
																className="px-3 py-1 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
															>
																Submit
															</button>
															<button
																onClick={() => setResolvingReport(null)}
																className="px-3 py-1 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
															>
																Cancel
															</button>
														</div>
													</div>
												) : (
													<button
														onClick={() => handleResolveClick(report.id)}
														className="text-sm text-blue-500 hover:text-blue-400"
													>
														Resolve
													</button>
												)}
											</>
										)}
									</td>
								</tr>
								{expandedReport === report.id && (
									<tr className="border-t border-zinc-800 bg-zinc-900/50">
										<td colSpan="5" className="p-4">
											<div className="space-y-3">
												<h4 className="text-sm font-medium text-white">
													Previous Reports
												</h4>
												{report.reportHistory &&
												report.reportHistory.length > 0 ? (
													report.reportHistory.map((history) => (
														<div
															key={history.id}
															className="p-3 bg-zinc-900 rounded-lg"
														>
															<p className="text-white text-sm">
																{history.description}
															</p>
															{history.admin_response && (
																<p className="mt-2 text-sm text-zinc-400">
																	<span className="font-medium text-zinc-300">
																		Admin Response:
																	</span>{" "}
																	{history.admin_response}
																</p>
															)}
															<div className="mt-2 flex justify-between items-center">
																<span className="text-xs text-zinc-500">
																	{new Date(
																		history.created_at
																	).toLocaleDateString()}
																</span>
																<span
																	className={`text-xs px-2 py-0.5 rounded-full ${
																		history.status === "pending"
																			? "bg-yellow-500/10 text-yellow-500"
																			: "bg-green-500/10 text-green-500"
																	}`}
																>
																	{history.status}
																</span>
															</div>
														</div>
													))
												) : (
													<div className="text-sm text-zinc-400 py-2 px-3 bg-zinc-900 rounded-lg">
														No previous reports found for this tutor before this
														report.
													</div>
												)}
											</div>
										</td>
									</tr>
								)}
							</React.Fragment>
						))}
					</tbody>
				</table>
			</div>

			<Dialog
				open={!!selectedReport}
				onClose={() => setSelectedReport(null)}
				title="Report Details"
			>
				<div className="space-y-4">
					<div>
						<h4 className="text-sm font-medium text-zinc-400 mb-2">
							Description
						</h4>
						<p className="text-white">{selectedReport?.description}</p>
					</div>

					<div>
						<h4 className="text-sm font-medium text-zinc-400 mb-2">
							Admin Response
						</h4>
						{selectedReport?.admin_response ? (
							<p className="text-white">{selectedReport.admin_response}</p>
						) : (
							<p className="text-zinc-500 italic">No admin response yet</p>
						)}
					</div>

					<div className="pt-2 border-t border-zinc-800">
						<div className="flex justify-between text-sm text-zinc-400">
							<span>
								Status:
								<span
									className={`ml-2 inline-flex px-2 py-1 text-xs font-medium rounded-full ${
										selectedReport?.status === "pending"
											? "bg-yellow-500/10 text-yellow-500"
											: "bg-green-500/10 text-green-500"
									}`}
								>
									{selectedReport?.status}
								</span>
							</span>
							<span>
								{new Date(selectedReport?.created_at).toLocaleDateString()}
							</span>
						</div>
					</div>
				</div>
			</Dialog>
		</>
	);
};

export default ReportsTable;
