import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './BookingModal.scss';
import { Modal } from 'reactstrap';
import ProfileDoctor from '../ProfileDoctor';
import DatePicker from '../../../../components/Input/DatePicker';
import * as action from '../../../../store/actions';
import _ from 'lodash';
import { selectFilter } from 'react-bootstrap-table2-filter';
import { LANGUAGES } from '../../../../utils';
import Select from 'react-select';
import userService from '../../../../services/userService';
import { toast } from 'react-toastify';
import moment from 'moment';
import LoadingOverlay from 'react-loading-overlay';

class BookingModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullName: '',
            phoneNumber: '',
            email: '',
            address: '',
            reason: '',
            birthday: '',
            gender: '',
            selectedGender: '',
            doctorId: '',
            timeType: '',
            isShowLoading: false
        }
    }
    async componentDidMount() {
        this.props.getGenderStart();
    }
    buildGenderData = (data) => {
        let result = [];
        let { language } = this.props;
        if (data && data.length > 0) {
            data.map(item => {
                let object = {};
                object.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn;
                object.value = item.keyMap;
                result.push(object);
            })
        }
        return result;
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {
            this.setState({
                gender: this.buildGenderData(this.props.genderRedux)
            })
        }
        if (this.props.genderRedux !== prevProps.genderRedux) {
            this.setState({
                gender: this.buildGenderData(this.props.genderRedux)
            })
        }
        if (this.props.dataTime !== prevProps.dataTime) {
            if (this.props.dataTime && !_.isEmpty(this.props.dataTime)) {
                let doctorId = this.props.dataTime.doctorId;
                let timeType = this.props.dataTime.timeType;
                this.setState({
                    doctorId: doctorId,
                    timeType: timeType
                })
            }
        }
    }
    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        })
    }
    handleOnChangeDatePicker = (date) => {
        this.setState({
            birthday: date[0]
        })
    }
    handleChangeSelect = (selectedOption) => {
        this.setState({
            selectedGender: selectedOption
        })
    }
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    buildTimeBooking = (dataTime) => {
        let { language } = this.props;
        if (dataTime && !_.isEmpty(dataTime)) {
            let time = language === LANGUAGES.VI ? dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn;
            let dateVi = this.capitalizeFirstLetter(moment.unix(+dataTime.date / 1000).format('dddd - DD/MM/YYYY'));
            let dateEn = moment.unix(+dataTime.date / 1000).locale('en').format('ddd - MM/DD/YYYY')
            let date = language === LANGUAGES.VI
                ? dateVi
                : dateEn
            return `${time} - ${date}`
        }
        return ''
    }
    buildNameDoctor = (dataTime) => {
        let { language } = this.props;
        if (dataTime && !_.isEmpty(dataTime)) {
            let name = language === LANGUAGES.VI
                ? `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`
                : `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}`
            return name;
        }
        return ''
    }
    handleConfirmBooking = async () => {
        this.setState({
            isShowLoading: true
        })
        let date = this.props.dataTime.date;
        let birthDay = new Date(this.state.birthday).getTime();
        let timeString = this.buildTimeBooking(this.props.dataTime);
        let doctorName = this.buildNameDoctor(this.props.dataTime);
        let res = await userService.postBookingAppointment({
            fullName: this.state.fullName,
            phoneNumber: this.state.phoneNumber,
            email: this.state.email,
            address: this.state.address,
            reason: this.state.reason,
            date: date,
            birthDay: birthDay,
            selectedGender: this.state.selectedGender.value,
            doctorId: this.state.doctorId,
            timeType: this.state.timeType,
            language: this.props.language,
            timeString: timeString,
            doctorName: doctorName
        })
        this.setState({
            isShowLoading: false
        })
        if (res && res.errCode === 0) {
            toast.success('Save booking succeed!');
            this.props.closeModal();
            // this.setState({
            //     fullName: '',
            //     phoneNumber: '',
            //     email: '',
            //     address: '',
            //     reason: '',
            //     birthday: '',
            //     selectedGender: '',
            //     doctorId: '',
            //     timeType: '',
            // })
        } else {
            toast.error('Booking failed!')
        }
    }

    render() {
        let { isShowModal, closeModal, dataTime } = this.props;
        let { fullName, phoneNumber, email, address, reason, birthday, gender, doctorId, selectedGender } = this.state;
        if (dataTime && !_.isEmpty(dataTime)) {
            doctorId = dataTime.doctorId;
        }
        // console.log(dataTime)
        return (
            <>
                <LoadingOverlay
                    active={this.state.isShowLoading}
                    spinner
                    text='Loading ...'
                >
                    <Modal
                        isOpen={isShowModal}
                        className={'booking-modal-container'}
                        size='lg'
                        centered
                    >

                        <div className="booking-modal-content">
                            <div className="booking-modal-header">
                                <span className='left'><FormattedMessage id='patient.booking-modal.title' /></span>
                                <span className='right' onClick={closeModal}><i className='fas fa-times'></i></span>
                            </div>
                            <div className="booking-modal-body">
                                {/* {JSON.stringify(dataTime)} */}
                                <div className="doctor-infor">
                                    <ProfileDoctor
                                        doctorId={doctorId}
                                        isShowDescription={false}
                                        dataTime={dataTime}
                                        isShowLinkProfile={false}
                                        isShowPrice={true} />
                                </div>
                                <div className="row">
                                    <div className="input col-6 form-group">
                                        <label><FormattedMessage id='patient.booking-modal.fullName' /></label>
                                        <input className="form-control"
                                            value={fullName}
                                            onChange={(event) => this.handleOnChangeInput(event, 'fullName')} />
                                    </div>
                                    <div className="input col-6 form-group">
                                        <label><FormattedMessage id='patient.booking-modal.phoneNumber' /></label>
                                        <input className="form-control"
                                            value={phoneNumber}
                                            onChange={(event) => this.handleOnChangeInput(event, 'phoneNumber')} />
                                    </div>
                                    <div className="input col-6 form-group">
                                        <label><FormattedMessage id='patient.booking-modal.email' /></label>
                                        <input className="form-control"
                                            value={email}
                                            onChange={(event) => this.handleOnChangeInput(event, 'email')} />
                                    </div>
                                    <div className="input col-6 form-group">
                                        <label><FormattedMessage id='patient.booking-modal.address' /></label>
                                        <input className="form-control"
                                            value={address}
                                            onChange={(event) => this.handleOnChangeInput(event, 'address')} />
                                    </div>
                                    <div className="input col-12 form-group">
                                        <label><FormattedMessage id='patient.booking-modal.reason' /></label>
                                        <input className="form-control"
                                            value={reason}
                                            onChange={(event) => this.handleOnChangeInput(event, 'reason')} />
                                    </div>
                                    <div className="input col-6 form-group">
                                        <label><FormattedMessage id='patient.booking-modal.birthday' /></label>
                                        <DatePicker
                                            className='form-control'
                                            onChange={this.handleOnChangeDatePicker}
                                            value={birthday} />
                                    </div>
                                    <div className="select col-6 form-group ">
                                        <label><FormattedMessage id='patient.booking-modal.gender' /></label>
                                        <Select
                                            value={selectedGender}
                                            onChange={this.handleChangeSelect}
                                            options={gender}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="booking-modal-footer">
                                <button className='btn-booking-confirm' onClick={() => this.handleConfirmBooking()}><FormattedMessage id='patient.booking-modal.btnConfirm' /></button>
                                <button className='btn-booking-cancel' onClick={closeModal}><FormattedMessage id='patient.booking-modal.btnCancel' /></button>
                            </div>
                        </div>
                    </Modal>
                </LoadingOverlay>
            </>

        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genderRedux: state.admin.genders,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(action.fetchGenderStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
