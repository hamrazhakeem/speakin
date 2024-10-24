import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SignInPage from './pages/SigninPage';
import SignUpPage from './pages/SignUpPage';
import OtpPage from './pages/OtpPage';
import LanguagePreferences from './pages/LanguagePreferences';
import HomePage from './pages/HomePage';
import ForgotPassword from './pages/ForgotPassword';
import ForgotPasswordOtpPage from './pages/ForgotPasswordOtpPage';
import SetNewPassword from './pages/SetNewPassword';
import UnauthenticatedRoute from './routes/UnauthenticatedRoute';
import ProtectedRoute from './routes/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import ProfilePage from './pages/ProfilePage';
import TutorLandingPage from './pages/TutorLandingPage';
import TutorSignInPage from './pages/TutorSignInPage';
import AdminSignInPage from './pages/AdminSignInPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminProtectedRoute from './routes/AdminProtectedRoute';
import AdminUnauthenticatedRoute from './routes/AdminUnauthenticatedRoute';
import AdminManageUsersPage from './pages/AdminManageUsersPage';
import TutorRequestPage from './pages/TutorRequestPage';
import useProactiveTokenRefresh from './hooks/useProactiveTokenRefresh';
import ApplicationConfirmation from './pages/ApplicationConfirmation';
import AdminVerifyTutorPage from './pages/AdminVerifyTutorPage';
import TutorProtectedRoute from './routes/TutorProtectedRoute';
import TutorUnprotectedRoute from './routes/TutorUnprotectedRoute';
import TutorDashboard from './pages/TutorDashboard';
import TutorPasswordChangePage from './pages/TutorPasswordChangePage';
import EditTeachingLanguage from './pages/EditTeachingLanguage';

const App = () => {
  useProactiveTokenRefresh();
  
  return (

    <Router>
      < ToastContainer
      position='top-center'
      pauseOnHover={false}
      hideProgressBar={true}
      closeOnClick={true}
      closeButton={false}
      autoClose={1500}
      />

      <Routes>

        <Route element={<TutorUnprotectedRoute />}>
          <Route path='/become-a-tutor' element={<TutorLandingPage />} />
          <Route path='/tutor-request' element={<TutorRequestPage />} />
          <Route path='/tutor-signin' element={<TutorSignInPage />} />
          <Route path='/application-confirmation' element={<ApplicationConfirmation />} />
        </Route>

        <Route element={<TutorProtectedRoute />}>
          <Route path='/tutor-dashboard' element={<TutorDashboard />} />
          <Route path='/tutor-password-change' element={<TutorPasswordChangePage />} />
          <Route path='/home' element={<HomePage />} />
          <Route path='/edit-teaching-language' element={<EditTeachingLanguage />} />
        </Route>

        {/* Pages only accessible to unauthenticated users */}
        <Route
          path='/'
          element={
            <UnauthenticatedRoute>
              <LandingPage />
            </UnauthenticatedRoute>
          }
        />

        <Route
          path='/signin'
          element={
            <UnauthenticatedRoute>
              <SignInPage />
            </UnauthenticatedRoute>
          }
        />

        <Route
          path='/signup'
          element={
            <UnauthenticatedRoute>
              <SignUpPage />
            </UnauthenticatedRoute>
          }
        />

        <Route
          path='/verify-otp'
          element={
            <UnauthenticatedRoute>
              <OtpPage />
            </UnauthenticatedRoute>
          }
        />

        <Route
          path='/forgot-password'
          element={
            <UnauthenticatedRoute>
              <ForgotPassword />
            </UnauthenticatedRoute>
          }
        />

        <Route
          path='/forgot-password-verify-otp'
          element={
            <UnauthenticatedRoute>
              <ForgotPasswordOtpPage />
            </UnauthenticatedRoute>
          }
        />

        <Route
          path='/set-new-password'
          element={
            <UnauthenticatedRoute>
              <SetNewPassword />
            </UnauthenticatedRoute>
          }
        />

        {/* Pages that require authentication */}
        <Route
          path='/language-preferences'
          element={
            <ProtectedRoute>
              <LanguagePreferences />
            </ProtectedRoute>
          }
        />

        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Home Page (accessible to both authenticated and unauthenticated users) */}

        

        {/* Admin Pages (accessible only to admin users) */}
        <Route
          path='/admin/signin'
          element={
            <AdminUnauthenticatedRoute>
              <AdminSignInPage />
            </AdminUnauthenticatedRoute>
          }
        />
        <Route
          path='/admin/dashboard'
          element={
            <AdminProtectedRoute>
              <AdminDashboardPage />
            </AdminProtectedRoute>
          }
        />
        <Route
          path='/admin/manage-users'
          element={
            <AdminProtectedRoute>
              <AdminManageUsersPage />
            </AdminProtectedRoute>
          }
        />
        <Route
          path='/admin/verify-tutor/:userId'
          element={
            <AdminProtectedRoute>
              <AdminVerifyTutorPage />
            </AdminProtectedRoute>
          }
        />  

      </Routes>
    </Router>
  );
};

export default App;
