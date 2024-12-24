import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { Provider } from 'react-redux';
import { store } from './redux/store.js';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import AuthProvider from './providers/AuthProvider.jsx';

// Use the correct environment variable naming
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <AuthProvider>
          <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </Provider>
);
