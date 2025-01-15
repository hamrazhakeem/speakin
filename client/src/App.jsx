import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/utils/ScrollToTop';
import { Toaster } from 'react-hot-toast';

import Home from './pages/Home';
import Profile from './pages/Profile';
import StudentPasswordChange from './pages/StudentPasswordChange';
import BuyCredits from './pages/BuyCredits';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';
import StudentBookings from './pages/StudentBookings';

import TutorDashboard from './pages/TutorDashboard';
import TutorPasswordChange from './pages/TutorPasswordChange';
import EditTeachingLanguage from './pages/EditTeachingLanguage';
import TutorSessions from './pages/TutorSessions';

import AdminDashboard from './pages/AdminDashboard';
import AdminManageUsers from './pages/AdminManageUsers';
import AdminManageSessions from './pages/AdminManageSessions';
import AdminManageLanguages from './pages/AdminManageLanguages';
import AdminVerifyTutor from './pages/AdminVerifyTutor';
import AdminVerifyLanguageChange from './pages/AdminVerifyLanguageChange';

import VideoCall from './pages/VideoCall';
import VideoCallSetup from './pages/VideoCallSetup';
import MeetingSummary from './pages/MeetingSummary';
import Message from './pages/Message';
import Withdraw from './pages/Withdraw';
import StripeRefresh from './pages/StripeRefresh';

import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Otp from './pages/Otp';
import TutorLanding from './pages/TutorLanding';
import TutorSignIn from './pages/TutorSignIn';
import TutorEmailVerification from './pages/TutorEmailVerification';
import TutorRequest from './pages/TutorRequest';
import ApplicationConfirmation from './pages/ApplicationConfirmation';
import ForgotPassword from './pages/ForgotPassword';
import ForgotPasswordOtp from './pages/ForgotPasswordOtp';
import SetNewPassword from './pages/SetNewPassword';
import AdminSignIn from './pages/AdminSignIn';

import AboutUs from './pages/AboutUs';
import HowItWorks from './pages/HowItWorks';
import FAQ from './pages/FAQ';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';

import StudentRoute from './routes/StudentRoute';
import TutorRoute from './routes/TutorRoute';
import AdminRoute from './routes/AdminRoute';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';

const App = () => {
  return (
    <Router>
          <ScrollToTop />
          <Toaster />
          <Routes>
            {/* Student Protected routes */}
            <Route element={<StudentRoute />}>
              <Route path='/home' element={<Home />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/password' element={<StudentPasswordChange />} />
              <Route path='/buy-credits' element={<BuyCredits />} />
              <Route path='/payment/success' element={<PaymentSuccess />} />
              <Route path='/payment/cancel' element={<PaymentCancel />} />
              <Route path='/bookings' element={<StudentBookings />} />
            </Route>

            {/* Tutor Protected routes */}  
            <Route element={<TutorRoute />}> 
              <Route path='/tutor/dashboard' element={<TutorDashboard />} />
              <Route path='/tutor/password' element={<TutorPasswordChange />} />
              <Route path='/tutor/teaching-languages' element={<EditTeachingLanguage />} />
              <Route path='/tutor/sessions'element={<TutorSessions />} />
            </Route>

            {/* Admin Protected routes */}
            <Route element={<AdminRoute />}>
              <Route path='/admin/dashboard' element={<AdminDashboard />} />
              <Route path='/admin/manage-users' element={<AdminManageUsers />} />
              <Route path='/admin/manage-sessions' element={<AdminManageSessions />} />
              <Route path='/admin/manage-languages' element={<AdminManageLanguages />} />
              <Route path='/admin/verify-tutor/:userId' element={<AdminVerifyTutor />} />
              <Route path='/admin/verify-language/:requestId' element={<AdminVerifyLanguageChange />} />
            </Route>

            {/* Common Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path='/video-call' element={<VideoCall />} />
              <Route path='/video-call/setup' element={<VideoCallSetup />} />
              <Route path='/video-call/summary' element={<MeetingSummary />} />
              <Route path='/messages' element={<Message />} />
              <Route path='/withdraw' element={<Withdraw />} />
              <Route path='/stripe/refresh' element={<StripeRefresh />} />
            </Route>

            {/* Public routes */}
            <Route element={<PublicRoute />}>
              <Route path='/' element={<Landing />} />
              <Route path='/sign-in' element={<SignIn />} />
              <Route path='/sign-up' element={<SignUp />} />
              <Route path='/sign-up/verify-otp' element={<Otp />} />
              <Route path='/tutor' element={<TutorLanding />} />
              <Route path='/tutor/sign-in' element={<TutorSignIn />} />
              <Route path='/tutor/verify-email' element={<TutorEmailVerification />} />
              <Route path='/tutor/request' element={<TutorRequest />} />
              <Route path='/tutor/request/application-confirmation' element={<ApplicationConfirmation />} />
              <Route path='/forgot-password' element={<ForgotPassword />} />
              <Route path='/forgot-password/verify-otp' element={<ForgotPasswordOtp />} />
              <Route path='/forgot-password/set-new-password' element={<SetNewPassword />} />
              <Route path='/admin/sign-in' element={<AdminSignIn />} />
            </Route>

            {/* Routes that don't need protection */}
            <Route path='/about-us' element={<AboutUs />} />
            <Route path='/how-it-works' element={<HowItWorks />} />
            <Route path='/faq' element={<FAQ />} />
            <Route path='/terms-and-conditions' element={<TermsAndConditions />} />
            <Route path='/privacy-policy' element={<PrivacyPolicy />} />

            {/* Default route for unmatched paths */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
    </Router>
  );
};

export default App;