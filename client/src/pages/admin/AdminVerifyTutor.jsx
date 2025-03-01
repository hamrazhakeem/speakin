import React from "react";
import AdminLayout from "../../components/admin/layout/AdminLayout";
import TutorVerificationReview from "../../components/admin/users/TutorVerificationReview";

const AdminVerifyTutor = () => {
	return (
		<AdminLayout showSidebar={false}>
			<TutorVerificationReview />
		</AdminLayout>
	);
};

export default AdminVerifyTutor;
