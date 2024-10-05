import actionTypes from "./actionTypes";
import userService from "../../services/userService";
import { toast } from 'react-toastify';
import { dispatch } from "../../redux";

export const fetchGenderStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_GENDER_START });
            let res = await userService.getAllCodeService('GENDER');
            if (res && res.errCode === 0) {
                dispatch(fetchGenderSuccess(res.data))
            } else {
                dispatch(fetchGenderFailed)
            }
        } catch (e) {
            console.log(e)
            dispatch(fetchGenderFailed)
        }
    }
}
export const fetchGenderSuccess = (genderData) => ({
    type: actionTypes.FETCH_GENDER_SUCCESS,
    data: genderData
})
export const fetchGenderFailed = () => ({
    type: actionTypes.FETCH_GENDER_FAILED
})


export const fetchPositionStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await userService.getAllCodeService('POSITION');
            if (res && res.errCode === 0) {
                dispatch(fetchPositionSuccess(res.data));
            } else {
                dispatch(fetchPositionFailed)
            }

        } catch (e) {
            console.log(e);
            dispatch(fetchPositionFailed);
        }
    }
}
export const fetchPositionSuccess = (positionData) => ({
    type: actionTypes.FETCH_POSITION_SUCCESS,
    data: positionData
})
export const fetchPositionFailed = () => ({
    type: actionTypes.FETCH_POSITION_FAILED
})


export const fetchRoleStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await userService.getAllCodeService('ROLE');
            if (res && res.errCode === 0) {
                dispatch(fetchRoleSuccess(res.data));
            } else {
                dispatch(fetchRoleFailed);
            }
        } catch (e) {
            console.log(e);
            dispatch(fetchRoleFailed);
        }
    }
}
export const fetchRoleSuccess = (roleData) => ({
    type: actionTypes.FETCH_ROLE_SUCCESS,
    data: roleData
})
export const fetchRoleFailed = () => ({
    type: actionTypes.FETCH_ROLE_FAILED
})


export const createNewUserStart = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await userService.createNewUserService(data);
            console.log('check responseL', res);
            if (res && res.errCode === 0) {
                toast.success('Create a new user succeed!');
                dispatch(createNewUserSuccess());
                dispatch(fetchAllUserStart());
            } else {
                dispatch(createNewUserFailed());
            }
        } catch (e) {
            console(e);
            toast.error('Create user failed!');
            dispatch(createNewUserFailed());
        }
    }
}
export const createNewUserSuccess = () => ({
    type: actionTypes.CREATE_NEW_USER_SUCCESS,
})

export const createNewUserFailed = () => ({
    type: actionTypes.CREATE_NEW_USER_FAILED,
})

export const fetchAllUserStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await userService.getAllUsers('ALL');
            // console.log('check response:', res);
            let res2 = userService.getTopDoctorService('');
            console.log('dang check', res2);
            if (res && res.errCode === 0) {
                dispatch(fetchAllUserSuccess(res.users.reverse()));
            } else {
                dispatch(fetchAllUserFailed());
            }
        } catch (e) {
            console(e);
            dispatch(createNewUserFailed());
        }
    }
}

export const fetchAllUserSuccess = (userData) => ({
    type: actionTypes.FETCH_ALL_USER_SUCCESS,
    users: userData
})

export const fetchAllUserFailed = () => ({
    type: actionTypes.CREATE_NEW_USER_FAILED
})

export const deleteUser = (id) => {
    return (async (dispatch, getState) => {
        try {
            let res = await userService.deleteUserService(id);
            if (res && res.errCode === 0) {
                toast.warn('User deleted!');
                dispatch(deleteUserSuccess());
                dispatch(fetchAllUserStart());
            }

        } catch (e) {
            console.log(e);
            toast.error('Delete failed!');
            dispatch(deleteUserFailed());
        }
    })
}

export const deleteUserSuccess = (userData) => ({
    type: actionTypes.DELETE_USER_SUCCESS,
    users: userData
})

export const deleteUserFailed = () => ({
    type: actionTypes.FETCH_ALL_USER_FAILED
})

export const editUserStart = (user) => {
    return (async (dispatch, getState) => {
        try {
            let res = await userService.editUserService(user);
            if (res && res.errCode === 0) {
                toast.info('Update user completed!');
                dispatch(editUserSuccess());
                dispatch(fetchAllUserStart());
            }

        } catch (e) {
            console.log(e);
            toast.error('Edit failed!');
            dispatch(editUserFailed());
        }
    })
}

export const editUserSuccess = () => ({
    type: actionTypes.EDIT_NEW_USER_SUCCESS,
})

export const editUserFailed = () => ({
    type: actionTypes.EDIT_NEW_USER_FAILED,
})


export const fetchTopDoctor = () => {
    return (async (dispatch, getState) => {
        try {
            let res = await userService.getTopDoctorService('');
            // console.log(res);
            if (res && res.errCode === 0) {
                dispatch(fetchTopDocTorSuccess(res.data))
            } else {
                dispatch(fetchTopDoctorFailed())
            }
        } catch (e) {
            console.log(e);
            dispatch(fetchTopDoctorFailed())
        }
    })
}

export const fetchTopDocTorSuccess = (dataDoctor) => ({
    type: actionTypes.FETCH_TOP_DOCTOR_SUCCESS,
    data: dataDoctor
})

export const fetchTopDoctorFailed = () => ({
    type: actionTypes.FETCH_TOP_DOCTOR_FAILED
})


export const fetchAllDoctor = () => {
    return (async (dispatch, getState) => {
        try {
            let res = await userService.getAllDocTorService();
            // console.log(res);
            if (res && res.errCode === 0) {
                dispatch(fetchAllDocTorSuccess(res.data))
            } else {
                dispatch(fetchAllDoctorFailed())
            }
        } catch (e) {
            console.log(e);
            dispatch(fetchAllDoctorFailed())
        }
    })
}

export const fetchAllDocTorSuccess = (dataDoctor) => ({
    type: actionTypes.FETCH_ALL_DOCTOR_SUCCESS,
    dataDr: dataDoctor
})

export const fetchAllDoctorFailed = () => ({
    type: actionTypes.FETCH_ALL_DOCTOR_FAILED
})

export const saveDetailDoctor = (data) => {
    return (async (dispatch, getState) => {
        try {
            // console.log('ec', res);
            let res = await userService.saveDetailDoctorService(data);
            if (res && res.errCode === 0) {
                toast.info('Save detail doctor completed!');
                dispatch(saveDetailDocTorSuccess())
            } else {
                toast.error('Save detail doctor failed!');
                dispatch(saveDetailDoctorFailed())
            }
        } catch (e) {
            toast.error('Save detail doctor failed!');
            console.log(e);
            dispatch(saveDetailDoctorFailed())
        }
    })
}

export const saveDetailDocTorSuccess = () => ({
    type: actionTypes.SAVE_DETAIL_DOCTOR_SUCCESS,
})

export const saveDetailDoctorFailed = () => ({
    type: actionTypes.SAVE_DETAIL_DOCTOR_FAILED
})

export const fetchAllScheduleTime = () => {
    return (async (dispatch, getState) => {
        try {
            let res = await userService.getAllCodeService('TIME');
            // console.log(res);
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS,
                    dataTime: res.data
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED
                })
            }
        } catch (e) {
            console.log(e);
            dispatch({
                type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED
            })
        }
    })
}

export const getRequireDoctorInfor = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_START });
            let resPrice = await userService.getAllCodeService('PRICE');
            let resPayment = await userService.getAllCodeService('PAYMENT');
            let resProvince = await userService.getAllCodeService('PROVINCE');
            let resSpecialty = await userService.getAllSpecialty();
            let resClinic = await userService.getAllClinic();
            if (resPrice && resPrice.errCode === 0
                && resPayment && resPayment.errCode === 0
                && resProvince && resProvince.errCode === 0
                && resSpecialty.errCode === 0 && resClinic.errCode === 0) {
                let data = {
                    resPrice: resPrice.data,
                    resPayment: resPayment.data,
                    resProvince: resProvince.data,
                    resSpecialty: resSpecialty.data,
                    resClinic: resClinic.data
                }
                dispatch(fetchRequiredDoctorPriceSuccess(data))
            } else {
                dispatch(fetchRequiredDoctorPriceFailed)
            }
        } catch (e) {
            console.log(e)
            dispatch(fetchRequiredDoctorPriceFailed)
        }
    }
}
export const fetchRequiredDoctorPriceSuccess = (allRequiredData) => ({
    type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_SUCCESS,
    dataRequired: allRequiredData
})
export const fetchRequiredDoctorPriceFailed = () => ({
    type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_FAILED,
})