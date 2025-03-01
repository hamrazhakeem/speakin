import React from "react";
import LoadingSpinner from "../../../common/ui/LoadingSpinner";
import Avatar from "../../../common/ui/Avatar";

const NotificationsModal = ({
	notifications,
	loading,
	onClose,
	handleClearAll,
	clearing,
}) => {
	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] overflow-y-auto">
			<div className="min-h-screen px-4 text-center">
				<span className="inline-block h-screen align-middle" aria-hidden="true">
					&#8203;
				</span>

				<div className="inline-block w-full max-w-md text-left align-middle transition-all transform bg-white rounded-xl shadow-xl my-8">
					<div className="flex flex-col max-h-[80vh]">
						<div className="p-4 border-b border-gray-200 flex justify-between items-center">
							<h3 className="font-medium text-gray-900">Notifications</h3>
							{notifications.length > 0 && (
								<button
									onClick={handleClearAll}
									disabled={loading || clearing}
									className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
								>
									{clearing ? "Clearing..." : "Clear All"}
								</button>
							)}
						</div>

						<div className="flex-1 overflow-y-auto">
							{loading ? (
								<div className="p-4 flex justify-center">
									<LoadingSpinner size="sm" className="text-blue-600" />
								</div>
							) : notifications.length === 0 ? (
								<div className="p-4 text-center text-gray-500">
									No notifications
								</div>
							) : (
								notifications.map((notification, index) => (
									<div
										key={index}
										className="p-4 border-b border-gray-100 hover:bg-gray-50"
									>
										<div className="flex items-start">
											<Avatar
												src={notification.sender_image}
												name={notification.sender_name}
												size={32}
												className="flex-shrink-0"
											/>
											<div className="ml-3">
												<p className="text-sm text-gray-700">
													New message from {notification.sender_name}
												</p>
												<p className="text-xs text-gray-500 mt-1">
													{new Date(notification.timestamp).toLocaleTimeString(
														[],
														{
															hour: "numeric",
															minute: "2-digit",
															hour12: true,
														}
													)}
												</p>
											</div>
										</div>
									</div>
								))
							)}
						</div>

						<div className="p-4 border-t border-gray-200">
							<button
								onClick={onClose}
								className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
							>
								Close
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NotificationsModal;
