export const studentApi = {
    signIn: (axios, credentials) => 
        axios.post(`${import.meta.env.VITE_API_GATEWAY_URL}sign-in/`, credentials)
        .then(response => response.data),
  
    signInWithGoogle: (axios, code) => 
        axios.post(`${import.meta.env.VITE_API_GATEWAY_URL}google-sign-in/`, { code: code })
        .then(response => response.data),
    
    signUp: (axiosInstance, data) => 
        axiosInstance.post('sign-up/', {
            name: data.name,
            email: data.email,
            password: data.password,
            user_type: 'student'
        })
    .then(response => response.data),

    verifyOtp: (axiosInstance, data) => 
        axiosInstance.post('verify-otp/', {
          email: data.email,
          otp: data.otp,
          cache_key: data.cache_key
        })
          .then(response => response.data),
    
    resendOtp: (axiosInstance, data) => 
        axiosInstance.post('resend-otp/', {
            email: data.email,
            cache_key: data.cache_key
        })
            .then(response => response.data),

    createCheckoutSession: (axiosInstance, data) => 
        axiosInstance.post(`${import.meta.env.VITE_API_GATEWAY_URL}create-checkout-session/`, {
            user_id: data.userId,
            amount: data.amount,
            transaction_type: 'credit_purchase',
            status: 'pending',
            purchased_credits: data.credits,
            price_per_credit: data.pricePerCredit,
            currency: 'inr',
        })
            .then(response => response.data),

    getUser: (axiosInstance, userId) => 
        axiosInstance.get(`users/${userId}/`)
            .then(response => response.data),

    getUsers: (axiosInstance) => 
        axiosInstance.get('users/')
            .then(response => response.data),

    getAvailabilities: (axiosInstance) => 
        axiosInstance.get('tutor-availabilities/')
            .then(response => response.data),
    
    getBookings: (axiosInstance) => 
        axiosInstance.get('bookings/')
            .then(response => response.data),
    
    createBooking: (axiosInstance, data) => 
        axiosInstance.post('bookings/', {
            availability: data.slotId,
            student_id: data.studentId,
            booking_status: 'confirmed'
        })
            .then(response => response.data),

    changePassword: (axiosInstance, data) => 
        axiosInstance.post('change-password/', {
            current_password: data.currentPassword,
            new_password: data.newPassword
        })
            .then(response => response.data),
            
    getCountries: (axiosInstance) => 
        axiosInstance.get('countries/')
            .then(response => response.data),

    getSpokenLanguages: (axiosInstance) => 
        axiosInstance.get('spoken-languages/')
            .then(response => response.data),

    getPlatformLanguages: (axiosInstance) => 
        axiosInstance.get('platform-languages/')
            .then(response => response.data),

    updateProfile: (axiosInstance, userId, formData) => 
        axiosInstance.patch(`users/${userId}/`, formData)
            .then(response => response.data),

    getBookingReports: (axiosInstance, bookingId) => 
        axiosInstance.get(`reports/${bookingId}`)
            .then(response => response.data),

    submitReport: (axiosInstance, data) => 
        axiosInstance.post('reports/', {
            booking: data.bookingId,
            reporter_id: data.reporterId,
            description: data.description
        })
            .then(response => response.data),
    
    getReports: (axiosInstance) => 
        axiosInstance.get('reports/')
            .then(response => response.data),
    
    getReport: (axiosInstance, reportId) => 
        axiosInstance.get(`reports/${reportId}/`)
            .then(response => response.data),
};