export const tutorApi = {
    signIn: (axios, data) => 
        axios.post(`${import.meta.env.VITE_API_GATEWAY_URL}tutor-sign-in/`, {
          email: data.email,
          password: data.password
        })
          .then(response => response.data),

    sendVerificationOtp: (axios, email) => 
        axios.post(`${import.meta.env.VITE_API_GATEWAY_URL}tutor/verify-email/`, { email })
            .then(response => response.data),

    verifyOtp: (axios, data) => 
        axios.post(`${import.meta.env.VITE_API_GATEWAY_URL}tutor/verify-otp/`, {
            email: data.email,
            otp: data.otp,
            cache_key: data.cache_key
        })
            .then(response => response.data),

    resendOtp: (axios, data) => 
        axios.post(`${import.meta.env.VITE_API_GATEWAY_URL}resend-otp/`, {
            email: data.email,
            cache_key: data.cache_key
        })
            .then(response => response.data),

    getUser: (axiosInstance, userId) => 
        axiosInstance.get(`users/${userId}/`)
            .then(response => response.data),
    
    getCountries: (axiosInstance) => 
        axiosInstance.get('countries/')
            .then(response => response.data),

    getSpokenLanguages: (axiosInstance) => 
        axiosInstance.get('spoken-languages/')
            .then(response => response.data),

    updateUser: (axiosInstance, userId, formData) => 
        axiosInstance.patch(`users/${userId}/`, formData)
            .then(response => response.data),

    getPlatformLanguages: (axiosInstance) => 
        axiosInstance.get(`${import.meta.env.VITE_API_GATEWAY_URL}platform-languages/`)
            .then(response => response.data),
    
    submitLanguageChangeRequest: (axiosInstance, formData) => 
        axiosInstance.post(`${import.meta.env.VITE_API_GATEWAY_URL}teaching-language-change-requests/`, formData, {
            headers: {
            'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => response.data),

    changePassword: (axiosInstance, data) => 
        axiosInstance.post('change-password/', {
            current_password: data.currentPassword,
            new_password: data.newPassword
        })
            .then(response => response.data),

    getTutorAvailabilities: (axiosInstance) => 
        axiosInstance.get('tutor-availabilities/')
            .then(response => response.data),

    getTeachingLanguage: () => 
        sessionStorage.getItem('teachingLanguage'),
            
    filterTutorAvailabilities: (availabilities, tutorId) => 
        availabilities.filter(slot => slot.tutor_id === tutorId),

    createSession: (axiosInstance, sessionData) => 
        axiosInstance.post('tutor-availabilities/', sessionData)
          .then(response => response.data)
}