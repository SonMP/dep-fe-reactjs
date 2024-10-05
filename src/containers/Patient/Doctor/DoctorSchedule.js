import React, { Component } from 'react';
import { connect } from "react-redux";
import moment from 'moment';
import localization from 'moment/locale/vi';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from '../../../utils';
import userService from '../../../services/userService';
import './DocTorSchedule.scss';
import BookingModal from './Modal/BookingModal';
import { indexOf } from 'lodash';

class DocTorSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allDays: [],
            allAvailableTime: [],
            isShowModalBooking: false,
            dataScheduleTimeModal: {}
        }
    }
    async componentDidMount() {
        let arrDate = this.getArrDays(this.props.language);
        if (this.props.doctorIdFromParent) {
            let res = await userService.getScheduleByDate(this.props.doctorIdFromParent, arrDate[0].value);
            this.setState({
                allAvailableTime: res.data ? res.data : []
            })
        }
        this.setState({
            allDays: arrDate
        })
        // console.log('arrday', arrDate);
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
            // console.log('moment vie:', moment(new Date()).format('dddd - DD/MM'));
            // console.log('moment en:', moment(new Date()).locale('en').format("ddd - DD/MM"));
            let arrDate = this.getArrDays(this.props.language);
            this.setState({
                allDays: arrDate
            })
        }
        if (prevProps.doctorIdFromParent !== this.props.doctorIdFromParent) {
            let doctorId = this.props.doctorIdFromParent;
            let arrDate = this.getArrDays(this.props.language);
            let date = arrDate[0].value;
            let res = await userService.getScheduleByDate(doctorId, date);
            this.setState({
                allAvailableTime: res.data ? res.data : []
            })
        }

    }
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    getArrDays = (language) => {
        let arrDate = [];
        for (let i = 0; i < 7; i++) {
            let object = {};
            if (language === LANGUAGES.VI) {
                if (i == 0) {
                    let ddMM = moment(new Date()).format('DD/MM');
                    let today = `Hôm nay - ${ddMM}`;
                    object.label = today;
                } else {
                    let labelVi = moment(new Date()).add(i, 'days').format('dddd - DD/MM');
                    object.label = this.capitalizeFirstLetter(labelVi);
                }

            } else {

                if (i == 0) {
                    let ddMM = moment(new Date()).format('DD/MM');
                    let today = `Today - ${ddMM}`;
                    object.label = today;
                } else {
                    object.label = moment(new Date()).add(i, 'days').locale('en').format("ddd - DD/MM");
                }
            }
            object.value = moment(new Date()).add(i, 'days').startOf('day').valueOf();
            arrDate.push(object);
        }
        return arrDate;
    }
    handleOnChangeSelect = async (event) => {
        if (this.props.doctorIdFromParent && this.props.doctorIdFromParent !== -1) {
            let doctorId = this.props.doctorIdFromParent;
            let date = event.target.value;
            let res = await userService.getScheduleByDate(doctorId, date);
            if (res && res.errCode === 0) {
                this.setState({
                    allAvailableTime: res.data ? res.data : []
                })
            }
        }
    }

    showModalBooking = (time) => {
        this.setState({
            isShowModalBooking: true,
            dataScheduleTimeModal: time
        })
        // console.log('check modal booking', time)
    }
    closeModalBooking = () => {
        this.setState({
            isShowModalBooking: false
        })
    }
    render() {
        let { allDays, allAvailableTime, isShowModalBooking, dataScheduleTimeModal } = this.state;
        let { language } = this.props;
        // console.log('aaa', allAvailableTime);
        return (
            <>
                <div className='doctor-schedule-container'>
                    <div className='all-schedule'>
                        <select onChange={(event) => this.handleOnChangeSelect(event)}>
                            {allDays && allDays.length > 0 &&
                                allDays.map((item, index) => {
                                    return (
                                        <option
                                            value={item.value}
                                            key={index}
                                        >
                                            {item.label}
                                        </option>
                                    )
                                })}

                        </select>
                    </div>
                    <div className='all-available-time'>
                        <div className='text-calendar'>
                            <i class="fa-solid fa-calendar-days"></i>
                            <span>
                                <FormattedMessage id='patient.detail-doctor.schedule' />
                            </span>
                        </div>
                        <div className='time-content'>
                            {allAvailableTime && allAvailableTime.length > 0 ?
                                <>
                                    <div className='time-content-btn'>
                                        {allAvailableTime.map((item, index) => {
                                            let { language } = this.props;
                                            let isShow = true;
                                            let timeDisplay = language === LANGUAGES.VI ? item.timeTypeData.valueVi : item.timeTypeData.valueEn;
                                            // let now = new Date().getHours();
                                            let now = 5;
                                            let timeShow = parseInt(timeDisplay.substring(timeDisplay.indexOf('-') + 1, timeDisplay.indexOf(':', timeDisplay.indexOf('-'))));
                                            if (timeDisplay.includes('PM')) {
                                                timeShow = timeShow + 12;
                                            }
                                            if (timeShow <= now + 1) {
                                                isShow = false;
                                            }
                                            if (!isShow) return (<></>)
                                            return (
                                                <button key={index}
                                                    className={language === LANGUAGES.VI ? 'btn-vie' : 'btn-en'}
                                                    onClick={() => this.showModalBooking(item)}
                                                >
                                                    {timeDisplay}
                                                </button>
                                            )
                                        })
                                        }
                                    </div>
                                    <div className='book-free'>
                                        <span><FormattedMessage id='patient.detail-doctor.choose' /><i class="fa-solid fa-hand-point-up"></i><FormattedMessage id='patient.detail-doctor.book-free' /></span>
                                    </div>
                                </>
                                :
                                <div className='no-schedule'>
                                    <FormattedMessage id='patient.detail-doctor.no-schedule' />
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <BookingModal
                    isShowModal={isShowModalBooking}
                    closeModal={this.closeModalBooking}
                    dataTime={dataScheduleTimeModal}
                    doctorId={this.props.doctorIdFromParent}
                />
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DocTorSchedule);
