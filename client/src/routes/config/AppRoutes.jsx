import { Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from '../../components/utils/ScrollToTop';
import { Toaster } from 'react-hot-toast';

import AdminRoute from '../guards/AdminRoute';
import StudentRoute from '../guards/StudentRoute';
import TutorRoute from '../guards/TutorRoute';
import ProtectedRoute from '../guards/ProtectedRoute';
import PublicRoute from '../guards/PublicRoute';

// Admin Pages
import AdminDashboard from '../../pages/admin/AdminDashboard';
import AdminManageUsers from '../../pages/admin/AdminManageUsers';
import AdminManageSessions from '../../pages/admin/AdminManageSessions';
import AdminManageLanguages from '../../pages/admin/AdminManageLanguages';
import AdminVerifyTutor from '../../pages/admin/AdminVerifyTutor';
import AdminVerifyLanguage from '../../pages/admin/AdminVerifyLanguage';

// Student Pages
import Home from '../../pages/user/student/Home';
import Profile from '../../pages/user/student/Profile';
import Password from '../../pages/user/student/Password';
import BuyCredits from '../../pages/user/student/BuyCredits';
import PaymentSuccess from '../../pages/user/student/PaymentSuccess';
import PaymentCancel from '../../pages/user/student/PaymentCancel';
import Bookings from '../../pages/user/student/Bookings';

// Tutor Pages
import TutorDashboard from '../../pages/user/tutor/TutorDashboard';
import TutorPassword from '../../pages/user/tutor/TutorPassword';
import TutorTeachingLanguages from '../../pages/user/tutor/TutorTeachingLanguages';
import TutorSessions from '../../pages/user/tutor/TutorSessions';

// Common Protected Pages
import VideoCall from '../../pages/user/common/VideoCall';
import VideoCallSetup from '../../pages/user/common/VideoCallSetup';
import VideoCallSummary from '../../pages/user/common/VideoCallSummary';
import Messages from '../../pages/user/common/Messages';
import Withdraw from '../../pages/user/common/Withdraw';
import StripeRefresh from '../../pages/user/common/StripeRefresh';

// Public Pages
import Landing from '../../pages/user/student/Landing';
import SignIn from '../../pages/user/student/SignIn';
import SignUp from '../../pages/user/student/SignUp';
import SignUpVerifyOtp from '../../pages/user/student/SignUpVerifyOtp';
import TutorLanding from '../../pages/user/tutor/TutorLanding';
import TutorSignIn from '../../pages/user/tutor/TutorSignIn';
import TutorVerifyEmail from '../../pages/user/tutor/TutorVerifyEmail';
import TutorRequest from '../../pages/user/tutor/TutorRequest';
import TutorRequestApplicationConfirmation from '../../pages/user/tutor/TutorRequestApplicationConfirmation';
import ForgotPassword from '../../pages/user/common/ForgotPassword';
import ForgotPasswordVerifyOtp from '../../pages/user/common/ForgotPasswordVerifyOtp';
import ForgotPasswordSetNewPassword from '../../pages/user/common/ForgotPasswordSetNewPassword';
import AdminSignIn from '../../pages/admin/AdminSignIn';

// Static Pages
import AboutUs from '../../pages/user/static/AboutUs';
import HowItWorks from '../../pages/user/static/HowItWorks';
import Faq from '../../pages/user/static/Faq';
import TermsAndConditions from '../../pages/user/static/TermsAndConditions';
import PrivacyPolicy from '../../pages/user/static/PrivacyPolicy';

const AppRoutes = () => {
  return (
    <>
        <ScrollToTop />
        <Toaster />
        <Routes>
            {/* Admin Protected Routes */}
            <Route element={<AdminRoute />}>
                <Route path='/admin/dashboard' element={<AdminDashboard />} />
                <Route path='/admin/manage-users' element={<AdminManageUsers />} />
                <Route path='/admin/manage-sessions' element={<AdminManageSessions />} />
                <Route path='/admin/manage-languages' element={<AdminManageLanguages />} />
                <Route path='/admin/verify-tutor/:userId' element={<AdminVerifyTutor />} />
                <Route path='/admin/verify-language/:requestId' element={<AdminVerifyLanguage />} />
            </Route>

            {/* Student Protected Routes */}
            <Route element={<StudentRoute />}>
                <Route path='/home' element={<Home />} />
                <Route path='/profile' element={<Profile />} />
                <Route path='/password' element={<Password />} />
                <Route path='/buy-credits' element={<BuyCredits />} />
                <Route path='/payment/success' element={<PaymentSuccess />} />
                <Route path='/payment/cancel' element={<PaymentCancel />} />
                <Route path='/bookings' element={<Bookings />} />
            </Route>

            {/* Tutor Protected Routes */}
            <Route element={<TutorRoute />}>
                <Route path='/tutor/dashboard' element={<TutorDashboard />} />
                <Route path='/tutor/password' element={<TutorPassword />} />
                <Route path='/tutor/teaching-languages' element={<TutorTeachingLanguages />} />
                <Route path='/tutor/sessions' element={<TutorSessions />} />
            </Route>

            {/* Common Protected Routes */}
            <Route element={<ProtectedRoute />}>
                <Route path='/video-call' element={<VideoCall />} />
                <Route path='/video-call/setup' element={<VideoCallSetup />} />
                <Route path='/video-call/summary' element={<VideoCallSummary />} />
                <Route path='/messages' element={<Messages />} />
                <Route path='/withdraw' element={<Withdraw />} />
                <Route path='/stripe/refresh' element={<StripeRefresh />} />
            </Route>

            {/* Public Routes */}
            <Route element={<PublicRoute />}>
                <Route path='/' element={<Landing />} />
                <Route path='/sign-in' element={<SignIn />} />
                <Route path='/sign-up' element={<SignUp />} />
                <Route path='/sign-up/verify-otp' element={<SignUpVerifyOtp />} />
                <Route path='/tutor' element={<TutorLanding />} />
                <Route path='/tutor/sign-in' element={<TutorSignIn />} />
                <Route path='/tutor/verify-email' element={<TutorVerifyEmail />} />
                <Route path='/tutor/request' element={<TutorRequest />} />
                <Route path='/tutor/request/application-confirmation' element={<TutorRequestApplicationConfirmation />} />
                <Route path='/forgot-password' element={<ForgotPassword />} />
                <Route path='/forgot-password/verify-otp' element={<ForgotPasswordVerifyOtp />} />
                <Route path='/forgot-password/set-new-password' element={<ForgotPasswordSetNewPassword />} />
                <Route path='/admin/sign-in' element={<AdminSignIn />} />
            </Route>

            {/* Static Routes (No Protection Needed) */}
            <Route path='/about-us' element={<AboutUs />} />
            <Route path='/how-it-works' element={<HowItWorks />} />
            <Route path='/faq' element={<Faq />} />
            <Route path='/terms-and-conditions' element={<TermsAndConditions />} />
            <Route path='/privacy-policy' element={<PrivacyPolicy />} />

            {/* Default Route for Unmatched Paths */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    </>
  );
};

export default AppRoutes;