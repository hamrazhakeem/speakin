import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Landing from './pages/Landing';
import AboutUs from './pages/AboutUs';
import HowItWorks from './pages/HowItWorks';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Otp from './pages/Otp';
import Home from './pages/Home';
import ForgotPassword from './pages/ForgotPassword';
import ForgotPasswordOtp from './pages/ForgotPasswordOtp';
import SetNewPassword from './pages/SetNewPassword';
import Profile from './pages/Profile';
import StudentPasswordChange from './pages/StudentPasswordChange';
import BuyCredits from './pages/BuyCredits';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';
import StudentBookings from './pages/StudentBookings';

import TutorLanding from './pages/TutorLanding';
import TutorSignIn from './pages/TutorSignIn';
import TutorEmailVerification from './pages/TutorEmailVerification';
import TutorRequest from './pages/TutorRequest';
import TutorDashboard from './pages/TutorDashboard';
import TutorPasswordChange from './pages/TutorPasswordChange';
import EditTeachingLanguage from './pages/EditTeachingLanguage';
import TutorSessions from './pages/TutorSessions';

import AdminSignIn from './pages/AdminSignIn';
import AdminDashboard from './pages/AdminDashboard';
import AdminManageUsers from './pages/AdminManageUsers';
import ApplicationConfirmation from './pages/ApplicationConfirmation';
import AdminVerifyTutor from './pages/AdminVerifyTutor';
import AdminVerifyLanguageChange from './pages/AdminVerifyLanguageChange';

import VideoCall from './pages/VideoCall';
import VideoCallSetup from './pages/VideoCallSetup';
import MeetingSummary from './pages/MeetingSummary';
import Message from './pages/Message';
import Withdraw from './pages/Withdraw';
import StripeRefresh from './pages/StripeRefresh';

import StudentRoute from './routes/StudentRoute';
import TutorRoute from './routes/TutorRoute';
import AdminRoute from './routes/AdminRoute';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';

import ScrollToTop from './components/utils/ScrollToTop';
import FAQ from './pages/FAQ';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';

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
              <Route path='/student-password-change' element={<StudentPasswordChange />} />
              <Route path='/buy-credits' element={<BuyCredits />} />
              <Route path='/payment/success' element={<PaymentSuccess />} />
              <Route path='/payment/cancel' element={<PaymentCancel />} />
              <Route path='/bookings' element={<StudentBookings />} />
            </Route>

            {/* Tutor Protected routes */}  
              <Route element={<TutorRoute />}> 
              <Route path='/tutor-dashboard' element={<TutorDashboard />} />
              <Route path='/tutor-password-change' element={<TutorPasswordChange />} />
              <Route path='/edit-teaching-language' element={<EditTeachingLanguage />} />
              <Route path='/tutor-sessions' element={<TutorSessions />} />
            </Route>

            {/* Admin Protected routes */}
            <Route element={<AdminRoute />}>
              <Route path='/admin/dashboard' element={<AdminDashboard />} />
              <Route path='/admin/manage-users' element={<AdminManageUsers />} />
              <Route path='/admin/verify-tutor/:userId' element={<AdminVerifyTutor />} />
              <Route path='/admin/verify-language-change/:requestId' element={<AdminVerifyLanguageChange />} />
            </Route>

            {/* Common Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path='/video-call' element={<VideoCall />} />
              <Route path='/video-call-setup' element={<VideoCallSetup />} />
              <Route path='/meeting-summary' element={<MeetingSummary />} />
              <Route path='/messages' element={<Message />} />
              <Route path='/withdraw' element={<Withdraw />} />
              <Route path='/stripe/refresh' element={<StripeRefresh />} />
            </Route>

            {/* Public routes */}
            <Route element={<PublicRoute />}>
              <Route path='/' element={<Landing />} />
              <Route path='/sign-in' element={<SignIn />} />
              <Route path='/sign-up' element={<SignUp />} />
              <Route path='/verify-otp' element={<Otp />} />
              <Route path='/become-a-tutor' element={<TutorLanding />} />
              <Route path='/tutor-sign-in' element={<TutorSignIn />} />
              <Route path='/tutor-email-verification' element={<TutorEmailVerification />} />
              <Route path='/tutor-request' element={<TutorRequest />} />
              <Route path='/application-confirmation' element={<ApplicationConfirmation />} />
              <Route path='/forgot-password' element={<ForgotPassword />} />
              <Route path='/forgot-password-verify-otp' element={<ForgotPasswordOtp />} />
              <Route path='/set-new-password' element={<SetNewPassword />} />
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