import React from "react";
import AdminLayout from "../../components/admin/layout/AdminLayout";
import UsersManagement from "../../components/admin/users/UsersManagement";

const AdminManageUsers = () => {
	return (
		<AdminLayout>
			<UsersManagement />
		</AdminLayout>
	);
};

export default AdminManageUsers;
