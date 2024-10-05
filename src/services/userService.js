import axios from "../axios";
const handleLoginService = (userEmail, userPassword) => {
    return axios.post('/api/login', { email: userEmail, password: userPassword });
}

const getAllUsers = (inputId) => {
    return axios.get(`/api/get-all-users/?id=${inputId}`);
}

const createNewUserService = (data) => {
    return axios.post('/api/create-new-user', data)
}

const deleteUserService = (userId) => {
    return axios.delete('/api/delete-user', {
        data: { id: userId }
    })
}

const editUserService = (data) => {
    return axios.put('/api/edit-user', data)
}

const getAllCodeService = (inputType) => {
    return axios.get(`/api/allcode/?type=${inputType}`);
}

const getTopDoctorService = (limit) => {
    return axios.get(`/api/top-doctor-home/?limit=${limit}`);
}

const getAllDocTorService = () => {
    return axios.get('/api/get-all-doctor')
}

const saveDetailDoctorService = (data) => {
    return axios.post('/api/save-infor-doctor', data);
}
const getDetailInforDoctor = (inputId) => {
    return axios.get(`/api/get-detail-doctor-by-id?id=${inputId}`)
}

const bulkCreateScheduleService = (data) => {
    return axios.post('/api/bulk-create-schedule', data);
}
const getScheduleByDate = (doctorId, date) => {
    return axios.get(`/api/get-schedule-by-date?doctorId=${doctorId}&date=${date}`)
}

const getDoctorExtraInforById = (doctorId) => {
    return axios.get(`/api/get-doctor-extra-infor-by-id?doctorId=${doctorId}`)
}

const getProfileDoctorById = (doctorId) => {
    return axios.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId}`)
}

const postBookingAppointment = (data) => {
    return axios.post('/api/patient-book-appointment', data)
}
const postVerifyBookAppointment = (data) => {
    return axios.post('/api/verify-book-appointment', data)
}
const createNewSpecialty = (data) => {
    return axios.post('/api/create-new-specialty', data)
}
const getAllSpecialty = () => {
    return axios.get('/api/get-specialty')
}
const editSpecialty = (data) => {
    return axios.post('/api/edit-specialty', data)
}
const getDetailSpecialtyById = (data) => {
    return axios.get(`/api/get-detail-specialty-by-id?id=${data.id}&location=${data.location}`)
}
const createNewClinic = (data) => {
    return axios.post('/api/create-new-clinic', data)
}

const getAllClinic = () => {
    return axios.get('/api/get-clinic')
}
const getDetailClinicById = (id) => {
    return axios.get(`/api/get-detail-clinic-by-id?id=${id}`)
}

const getListPatientForDoctor = (data) => {
    return axios.get(`/api/get-list-patient-for-doctor?doctorId=${data.doctorId}&date=${data.date}`)
}

const postSendRemedy = (data) => {
    return axios.post('/api/send-remedy', data)
}
export default {
    handleLoginService, getAllUsers, createNewUserService,
    deleteUserService, editUserService, getAllCodeService,
    getTopDoctorService, getAllDocTorService, saveDetailDoctorService,
    getDetailInforDoctor, bulkCreateScheduleService, getScheduleByDate,
    getDoctorExtraInforById, getProfileDoctorById, postBookingAppointment,
    postVerifyBookAppointment, createNewSpecialty, getAllSpecialty,
    editSpecialty, getDetailSpecialtyById, createNewClinic, getAllClinic,
    getDetailClinicById, getListPatientForDoctor, postSendRemedy
};
