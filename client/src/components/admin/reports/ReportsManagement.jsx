import React, { useState, useEffect } from "react";
import useAxios from "../../../hooks/useAxios";
import LoadingSpinner from "../../common/ui/LoadingSpinner";
import { adminApi } from "../../../api/adminApi";
import AdminButton from "../ui/AdminButton";
import ReportsTable from "./ReportsTable";

const ReportsManagement = () => {
	const [reports, setReports] = useState([]);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState("pending");
	const axiosInstance = useAxios();

	useEffect(() => {
		fetchReports();
	}, []);

	const fetchReports = async () => {
		try {
			setLoading(true);
			const response = await adminApi.getReports(axiosInstance);
			setReports(response.data);
		} catch (error) {
			setReports([]);
		} finally {
			setLoading(false);
		}
	};

	const handleResolve = async (reportId, response, bookingId, reporterId) => {
		try {
			const data = {
				status: "responded",
				admin_response: response,
				booking: bookingId,
				reporter_id: reporterId,
			};

			await adminApi.updateReportStatus(axiosInstance, reportId, data);
			fetchReports();
		} catch (error) {
			setReports([]);
		}
	};

	const filteredReports = reports.filter((report) => {
		if (activeTab === "pending") return report.status === "pending";
		if (activeTab === "responded") return report.status === "responded";
		return true;
	});

	const TabButton = ({ label, value }) => (
		<AdminButton
			variant="tab"
			active={activeTab === value}
			onClick={() => setActiveTab(value)}
		>
			{label}
		</AdminButton>
	);

	if (loading) {
		return (
			<div className="flex justify-center items-center h-96">
				<LoadingSpinner size="lg" />
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto">
			<div className="mb-6 lg:mb-8">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<div>
						<h1 className="text-xl lg:text-2xl font-bold text-white flex items-center gap-2">
							Reports Management
							{reports.length > 0 && (
								<span className="text-sm font-normal bg-red-500 text-white px-2 py-0.5 rounded-full">
									{reports.filter((r) => r.status === "pending").length} pending
								</span>
							)}
						</h1>
						<p className="text-sm text-zinc-400">
							Review and manage user complaints about sessions and tutors
						</p>
					</div>

					<div className="flex flex-wrap items-center gap-2 bg-zinc-900 p-1 rounded-lg w-full sm:w-auto">
						<div className="grid grid-cols-2 sm:flex gap-2 w-full sm:w-auto">
							<TabButton label="Pending" value="pending" />
							<TabButton label="Responded" value="responded" />
							<TabButton label="All" value="all" />
						</div>
					</div>
				</div>
			</div>

			<div className="bg-black border border-zinc-800 rounded-lg">
				<ReportsTable
					reports={filteredReports.map((report) => ({
						...report,
						tutorStats: {
							totalReports: report.tutor_report_stats.total_reports,
							pendingReports: report.tutor_report_stats.pending_reports,
							respondedReports: report.tutor_report_stats.responded_reports,
						},
						reportHistory: report.tutor_report_history,
					}))}
					activeTab={activeTab}
					onResolve={handleResolve}
				/>
			</div>
		</div>
	);
};

export default ReportsManagement;
