import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import LandingPage from './pages/LandingPage';
import AboutUs from './pages/AboutUs';
import HowItWorks from './pages/HowItWorks';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import OtpPage from './pages/OtpPage';
import HomePage from './pages/HomePage';
import ForgotPassword from './pages/ForgotPassword';
import ForgotPasswordOtpPage from './pages/ForgotPasswordOtpPage';
import SetNewPassword from './pages/SetNewPassword';
import ProfilePage from './pages/ProfilePage';
import StudentPasswordChangePage from './pages/StudentPasswordChangePage';
import BuyCredits from './pages/BuyCredits';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentCancelPage from './pages/PaymentCancelPage';
import StudentBookingsPage from './pages/StudentBookingsPage';

import TutorLandingPage from './pages/TutorLandingPage';
import TutorSignInPage from './pages/TutorSignInPage';
import TutorRequestPage from './pages/TutorRequestPage';
import TutorDashboard from './pages/TutorDashboard';
import TutorPasswordChangePage from './pages/TutorPasswordChangePage';
import EditTeachingLanguage from './pages/EditTeachingLanguage';
import TutorSessionsPage from './pages/TutorSessionsPage';

import AdminSignInPage from './pages/AdminSignInPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminManageUsersPage from './pages/AdminManageUsersPage';
import ApplicationConfirmation from './pages/ApplicationConfirmation';
import AdminVerifyTutorPage from './pages/AdminVerifyTutorPage';
import AdminVerifyLanguageChangePage from './pages/AdminVerifyLanguageChangePage';

import VideoCall from './pages/VideoCall';
import VideoCallSetup from './pages/VideoCallSetup';
import MeetingSummary from './pages/MeetingSummary';
import MessagePage from './pages/MessagePage';
import Withdraw from './pages/Withdraw';
import StripeRefresh from './pages/StripeRefresh';

import StudentRoute from './routes/StudentRoute';
import TutorRoute from './routes/TutorRoute';
import AdminRoute from './routes/AdminRoute';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';

import ScrollToTop from './components/utils/ScrollToTop';
import FAQPage from './pages/FAQPage';
import TermsAndConditionsPage from './pages/TermsAndConditionsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';

const App = () => {
  return (
    <Router>
          <ScrollToTop />
          <Toaster />
          <Routes>
            {/* Student Protected routes */}
            <Route element={<StudentRoute />}>
              <Route path='/home' element={<HomePage />} />
              <Route path='/profile' element={<ProfilePage />} />
              <Route path='/student-password-change' element={<StudentPasswordChangePage />} />
              <Route path='/buy-credits' element={<BuyCredits />} />
              <Route path='/payment/success' element={<PaymentSuccessPage />} />
              <Route path='/payment/cancel' element={<PaymentCancelPage />} />
              <Route path='/bookings' element={<StudentBookingsPage />} />
            </Route>

            {/* Tutor Protected routes */}  
              <Route element={<TutorRoute />}> 
              <Route path='/tutor-dashboard' element={<TutorDashboard />} />
              <Route path='/tutor-password-change' element={<TutorPasswordChangePage />} />
              <Route path='/edit-teaching-language' element={<EditTeachingLanguage />} />
              <Route path='/tutor-sessions' element={<TutorSessionsPage />} />
            </Route>

            {/* Admin Protected routes */}
            <Route element={<AdminRoute />}>
              <Route path='/admin/dashboard' element={<AdminDashboardPage />} />
              <Route path='/admin/manage-users' element={<AdminManageUsersPage />} />
              <Route path='/admin/verify-tutor/:userId' element={<AdminVerifyTutorPage />} />
              <Route path='/admin/verify-language-change/:requestId' element={<AdminVerifyLanguageChangePage />} />
            </Route>

            {/* Common Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path='/video-call' element={<VideoCall />} />
              <Route path='/video-call-setup' element={<VideoCallSetup />} />
              <Route path='/meeting-summary' element={<MeetingSummary />} />
              <Route path='/messages' element={<MessagePage />} />
              <Route path='/withdraw' element={<Withdraw />} />
              <Route path='/stripe/refresh' element={<StripeRefresh />} />
            </Route>

            {/* Public routes */}
            <Route element={<PublicRoute />}>
              <Route path='/' element={<LandingPage />} />
              <Route path='/sign-in' element={<SignInPage />} />
              <Route path='/sign-up' element={<SignUpPage />} />
              <Route path='/verify-otp' element={<OtpPage />} />
              <Route path='/become-a-tutor' element={<TutorLandingPage />} />
              <Route path='/tutor-sign-in' element={<TutorSignInPage />} />
              <Route path='/tutor-request' element={<TutorRequestPage />} />
              <Route path='/application-confirmation' element={<ApplicationConfirmation />} />
              <Route path='/forgot-password' element={<ForgotPassword />} />
              <Route path='/forgot-password-verify-otp' element={<ForgotPasswordOtpPage />} />
              <Route path='/set-new-password' element={<SetNewPassword />} />
              <Route path='/admin/sign-in' element={<AdminSignInPage />} />
            </Route>

            {/* Routes that don't need protection */}
            <Route path='/about-us' element={<AboutUs />} />
            <Route path='/how-it-works' element={<HowItWorks />} />
            <Route path='/faq' element={<FAQPage />} />
            <Route path='/terms-and-conditions' element={<TermsAndConditionsPage />} />
            <Route path='/privacy-policy' element={<PrivacyPolicyPage />} />

            {/* Default route for unmatched paths */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
    </Router>
  );
};

export default App;