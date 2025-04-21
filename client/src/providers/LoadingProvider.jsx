import { useState, useEffect } from "react";
import LoadingSpinner from "../components/common/ui/LoadingSpinner";

const LoadingProvider = ({ children }) => {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(false);
	}, []);

	if (loading) {
		return (
			<div className="fixed inset-0 flex items-center justify-center min-h-screen">
				<LoadingSpinner size="lg" className="text-blue-600" />
			</div>
		);
	}

	return children;
};

export default LoadingProvider;