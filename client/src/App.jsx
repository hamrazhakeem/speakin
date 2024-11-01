import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import useProactiveTokenRefresh from './hooks/useProactiveTokenRefresh';

import LandingPage from './pages/LandingPage';
import SignInPage from './pages/SigninPage';
import SignUpPage from './pages/SignUpPage';
import OtpPage from './pages/OtpPage';
import LanguagePreferences from './pages/LanguagePreferences';
import HomePage from './pages/HomePage';
import ForgotPassword from './pages/ForgotPassword';
import ForgotPasswordOtpPage from './pages/ForgotPasswordOtpPage';
import SetNewPassword from './pages/SetNewPassword';
import ProfilePage from './pages/ProfilePage';
import StudentPasswordChangePage from './pages/StudentPasswordChangePage';

import TutorLandingPage from './pages/TutorLandingPage';
import TutorSignInPage from './pages/TutorSignInPage';
import TutorRequestPage from './pages/TutorRequestPage';
import TutorDashboard from './pages/TutorDashboard';
import TutorPasswordChangePage from './pages/TutorPasswordChangePage';
import EditTeachingLanguage from './pages/EditTeachingLanguage';

import AdminSignInPage from './pages/AdminSignInPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminManageUsersPage from './pages/AdminManageUsersPage';
import ApplicationConfirmation from './pages/ApplicationConfirmation';
import AdminVerifyTutorPage from './pages/AdminVerifyTutorPage';
import AdminVerifyLanguageChangePage from './pages/AdminVerifyLanguageChangePage';

import StudentUnprotectedRoute from './routes/StudentUnprotectedRoute';
import StudentProtectedRoute from './routes/StudentProtectedRoute';
import TutorProtectedRoute from './routes/TutorProtectedRoute';
import TutorUnprotectedRoute from './routes/TutorUnprotectedRoute';
import AdminProtectedRoute from './routes/AdminProtectedRoute';
import AdminUnprotectedRoute from './routes/AdminUnprotectedRoute';

const App = () => {
  useProactiveTokenRefresh();
  return (
    <Router>
      <ToastContainer
        position='top-center'
        pauseOnHover={false}
        hideProgressBar={true}
        closeOnClick={true}
        closeButton={false}
        autoClose={1500}
      />

      <Routes>
        {/* Tutor Unprotected routes */}
        <Route element={<TutorUnprotectedRoute />}>
          <Route path='/become-a-tutor' element={<TutorLandingPage />} />
          <Route path='/tutor-request' element={<TutorRequestPage />} />
          <Route path='/tutor-signin' element={<TutorSignInPage />} />
          <Route path='/application-confirmation' element={<ApplicationConfirmation />} />
        </Route>

        {/* Tutor Protected routes */}  
        <Route element={<TutorProtectedRoute />}>
          <Route path='/tutor-dashboard' element={<TutorDashboard />} />
          <Route path='/tutor-password-change' element={<TutorPasswordChangePage />} />
          <Route path='/edit-teaching-language' element={<EditTeachingLanguage />} />
        </Route>

        {/* Student Unprotected routes */}
        <Route element={<StudentUnprotectedRoute/>}>
          <Route path='/' element={<LandingPage />} />
          <Route path='/signin' element={<SignInPage />} />
          <Route path='/signup' element={<SignUpPage />} />
          <Route path='/verify-otp' element={<OtpPage />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/forgot-password-verify-otp' element={<ForgotPasswordOtpPage />} />
          <Route path='/set-new-password' element={<SetNewPassword />} />
        </Route>

        {/* Student Protected routes */}
        <Route element={<StudentProtectedRoute />}>
          <Route path='/language-preferences' element={<LanguagePreferences />} />
          <Route path='/home' element={<HomePage />} />
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/student-password-change' element={<StudentPasswordChangePage />} />
        </Route>

        {/* Admin Unprotected routes */}
        <Route element={<AdminUnprotectedRoute />}>
          <Route path='/admin/signin' element={<AdminSignInPage />} />
        </Route>

        {/* Admin Protected routes */}
        <Route element={<AdminProtectedRoute />}>
          <Route path='/admin/dashboard' element={<AdminDashboardPage />} />
          <Route path='/admin/manage-users' element={<AdminManageUsersPage />} />
          <Route path='/admin/verify-tutor/:userId' element={<AdminVerifyTutorPage />} />
          <Route path='/admin/verify-language-change/:requestId' element={<AdminVerifyLanguageChangePage />} />
        </Route>

        {/* Default route for unmatched paths */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
