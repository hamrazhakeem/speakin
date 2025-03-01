import React from "react";
import MessagesInterface from "../../../components/user/sharedpages/messages/MessagesInterface";
import Layout from "../../../components/user/common/layout/Layout";

const Messages = () => {
	return (
		<Layout showFooter={false}>
			<MessagesInterface />
		</Layout>
	);
};

export default Messages;
