import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store.js";
import { PersistGate } from "redux-persist/integration/react";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LoadingProvider from "./providers/LoadingProvider.jsx";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById("root")).render(
	<Provider store={store}>
		<PersistGate loading={null} persistor={persistor}>
			<GoogleOAuthProvider clientId={CLIENT_ID}>
				<LoadingProvider>
					<App />
				</LoadingProvider>
			</GoogleOAuthProvider>
		</PersistGate>
	</Provider>
);
