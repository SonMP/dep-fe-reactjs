import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './ManagePatient.scss';
import DatePicker from '../../../components/Input/DatePicker';
import userService from '../../../services/userService';
import moment from 'moment';
import { LANGUAGES } from '../../../utils';
import RemedyModal from './RemedyModal';
import { toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay';

class ManagePatient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDate: moment(new Date()).startOf('day').valueOf(),
            dataPatient: [],
            isOpenRemedyModal: false,
            dataModal: {},
            isShowLoading: false
        }
    }
    async componentDidMount() {

        this.getDataPatient();
    }
    getDataPatient = async () => {
        let { user } = this.props;
        let { currentDate } = this.state;
        let formatDate = new Date(currentDate).getTime();
        let res = await userService.getListPatientForDoctor({
            doctorId: user.id,
            date: formatDate
        })
        if (res && res.errCode === 0) {
            this.setState({
                dataPatient: res.data
            })
        }
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }
    }
    handleOnChangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0]
        }, () => {
            this.getDataPatient();
        })
    }
    handleBtnConfirm = (item) => {
        let data = {
            doctorId: item.doctorId,
            patientId: item.patientId,
            email: item.patientData.email,
            timeType: item.timeType,
            patientName: item.patientData.firstName
        }
        this.setState({
            isOpenRemedyModal: true,
            dataModal: data
        })
        // console.log('data', data)
    }
    closeRemedyModal = () => {
        this.setState({
            isOpenRemedyModal: false
        })
    }
    sendRemedy = async (dataChildFromModal) => {
        let { dataModal } = this.state;
        this.setState({
            isShowLoading: true
        })
        let res = await userService.postSendRemedy({
            email: dataChildFromModal.email,
            imageBase64: dataChildFromModal.imageBase64,
            doctorId: dataModal.doctorId,
            patientId: dataModal.patientId,
            timeType: dataModal.timeType,
            language: this.props.language,
            patientName: dataModal.patientName
        });
        if (res && res.errCode === 0) {
            this.setState({
                isShowLoading: false
            })
            toast.success('Send Remedy succeed!');
            this.closeRemedyModal();
            await this.getDataPatient();
        } else {
            toast.error('Somethings wrongs');
            console.log('error send remedy', res)
        }
        console.log('resss', dataChildFromModal.imageBase64)
    }
    render() {
        let { dataPatient, isOpenRemedyModal, dataModal } = this.state;
        // console.log('date:', this.state.dataPatient);
        let { language } = this.props;
        return (
            <>
                <LoadingOverlay
                    active={this.state.isShowLoading}
                    spinner
                    text='Loading ...'
                >
                    <div className="manage-patient-container">
                        <div className="m-p-title">
                            Quản lý bệnh nhân khám bệnh
                        </div>
                        <div className="manage-patient-body row">
                            <div className='col-6 form-group'>
                                <label><FormattedMessage id='manage-schedule.choose-date' /></label>
                                <DatePicker
                                    className='form-control'
                                    onChange={this.handleOnChangeDatePicker}
                                    value={this.state.currentDate} />
                            </div>
                            <div className='col-12 table-manage-patient'>
                                <table>
                                    <tbody>

                                        <tr>
                                            <th>STT</th>
                                            <th>Thời gian</th>
                                            <th>Họ và tên</th>
                                            <th>Địa chỉ</th>
                                            <th>Giới tính</th>
                                            <th>Actions</th>
                                        </tr>
                                        {dataPatient && dataPatient.length > 0
                                            ? dataPatient.map((item, index) => {
                                                let gender = language === LANGUAGES.VI ? item.patientData.genderData.valueVi : item.patientData.genderData.valueEn;
                                                let time = language === LANGUAGES.VI ? item.timeTypePatient.valueVi : item.timeTypePatient.valueEn
                                                return (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{time}</td>
                                                        <td>{item.patientData.firstName}</td>
                                                        <td>{item.patientData.address}</td>
                                                        <td>{gender}</td>
                                                        <td>
                                                            <button className='mp-btn-confirm' onClick={() => this.handleBtnConfirm(item)}>Xác nhận</button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                            : <tr>
                                                <td colSpan='6' style={{ textAlign: 'center' }}>No data</td>
                                            </tr>
                                        }

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <RemedyModal
                        isOpenModal={isOpenRemedyModal}
                        dataModal={dataModal}
                        closeModal={this.closeRemedyModal}
                        sendRemedy={this.sendRemedy}
                    />

                </LoadingOverlay>
            </>

        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        user: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
