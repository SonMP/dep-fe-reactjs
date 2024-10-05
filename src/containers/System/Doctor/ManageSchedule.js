import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import './ManageSchedule.scss';
import { FormattedMessage } from 'react-intl';
import Select from 'react-select';
import * as action from '../../../store/actions';
import { LANGUAGES, dateFormat } from '../../../utils';
import DatePicker from '../../../components/Input/DatePicker';
import { toast } from 'react-toastify';
import moment from 'moment';
import _ from 'lodash';
import userService from '../../../services/userService';

class ManageSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDoctor: {},
            listDoctors: [],
            currentDate: '',
            rangeTime: []
        }
    }
    componentDidMount() {
        this.props.fetchAllDoctor();
        this.props.fetchAllScheduleTime();
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.allDoctor !== this.props.allDoctor) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctor);
            this.setState({
                listDoctors: dataSelect
            })
        }
        if (prevProps.allScheduleTime !== this.props.allScheduleTime) {
            let dataTime = this.props.allScheduleTime;
            if (dataTime && dataTime.length > 0) {
                dataTime = dataTime.map(item => ({ ...item, isSelected: false }));
            }
            this.setState({
                rangeTime: dataTime
            })
        }
        // if (prevProps.language !== this.props.language) {
        //     let dataSelect = this.buildDataInputSelect(this.props.allDoctor);
        //     this.setState({
        //         listDoctors: dataSelect
        //     })
        // }
    }

    buildDataInputSelect = (inputData) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};
                let labelVi = `${item.lastName} ${item.firstName}`;
                let labelEn = `${item.firstName} ${item.lastName}`;
                object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                object.value = item.id;
                result.push(object);
            })
        }
        return result;
    }

    handleChangeSelected = async (selectedOption) => {
        this.setState({
            selectedDoctor: selectedOption
        })
    }
    handleOnChangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0]
        })
    }

    handleClickBtnTime = (time) => {
        let { rangeTime } = this.state;
        if (rangeTime && rangeTime.length > 0) {
            rangeTime = rangeTime.map(item => {
                if (item.id === time.id) item.isSelected = !item.isSelected;
                return item;
            })
            this.setState({
                rangeTime: rangeTime
            })
        }

    }
    handleBtnSaveSchedule = async () => {
        let { rangeTime, selectedDoctor, currentDate } = this.state;
        // let formatDate = moment(currentDate).format(dateFormat.SEND_TO_SERVER);
        let formatDate = '' + new Date(currentDate).getTime();
        // let formatDate = new Date(timestamp).toISOString();
        let result = [];
        console.log('hihi', formatDate)
        if (selectedDoctor && _.isEmpty(selectedDoctor)) {
            toast.error("Invalid selected doctor!");
        }
        if (!currentDate) {
            toast.error("Invalid date!");
            return;
        }
        if (rangeTime && rangeTime.length > 0) {
            let selectedTime = rangeTime.filter(item => item.isSelected === true);
            if (selectedTime && selectedTime.length > 0) {
                selectedTime.map(item => {
                    let object = {};
                    object.doctorId = selectedDoctor.value;
                    object.date = formatDate;
                    object.timeType = item.keyMap;
                    result.push(object);
                })
            } else {
                toast.error("Invalid selected time!");
                return;
            }
            let res = await userService.bulkCreateScheduleService({
                arrSchedule: result,
                doctorId: selectedDoctor.value,
                formatDate: formatDate
            });
            if (res && res.errCode === 0) {
                toast.success('Save infor succeed!');
            } else {
                toast.error('Error bulkCreateScheduleService');
                console.log('Error bulkCreateScheduleService >>> res:', res);
            }
        }
    }
    render() {
        let { isLoggedIn, language } = this.props;
        let { rangeTime } = this.state;
        let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
        // console.log('a', this.state.rangeTime);
        return (
            <>
                <div className='manage-schedule-container'>
                    <div className='m-s-title'>
                        <FormattedMessage id='manage-schedule.title' />
                    </div>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-6 form-group'>
                                <label><FormattedMessage id='manage-schedule.choose-doctor' /></label>
                                <Select
                                    value={this.state.selectedDoctor}
                                    onChange={this.handleChangeSelected}
                                    options={this.state.listDoctors} />
                            </div>
                            <div className='col-6 form-group'>
                                <label><FormattedMessage id='manage-schedule.choose-date' /></label>
                                <DatePicker
                                    className='form-control'
                                    onChange={this.handleOnChangeDatePicker}
                                    minDate={yesterday}
                                    value={this.state.currentDate} />
                            </div>
                            <div className='col-12 pick-hour-container'>
                                {rangeTime && rangeTime.length > 0 &&
                                    rangeTime.map((item, index) => {
                                        return (
                                            <button className={item.isSelected === true ? 'btn btn-schedule active' : 'btn btn-schedule '}
                                                key={index}
                                                onClick={() => this.handleClickBtnTime(item)}>
                                                {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                            </button>
                                        )
                                    })}
                            </div>
                        </div>
                        <div className='col-12'>
                            <button className='btn btn-primary btn-save-schedule'
                                onClick={() => this.handleBtnSaveSchedule()}><FormattedMessage id='manage-schedule.save' /></button>
                        </div>
                    </div>
                </div>
            </ >
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        allDoctor: state.admin.allDoctor,
        language: state.app.language,
        allScheduleTime: state.admin.allScheduleTime
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctor: () => dispatch(action.fetchAllDoctor()),
        fetchAllScheduleTime: () => dispatch(action.fetchAllScheduleTime())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
