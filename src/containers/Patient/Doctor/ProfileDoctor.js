import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './ProfileDoctor.scss';
// import localization from 'moment/locale/vi';
import userService from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
import NumberFormat from 'react-number-format';
import _ from 'lodash';
import moment from 'moment';
import { Link } from 'react-router-dom';

class ProfileDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataProfile: []
        }
    }
    async componentDidMount() {
        let data = await this.getInforDoctor(this.props.doctorId);
        this.setState({
            dataProfile: data
        })
    }
    getInforDoctor = async (id) => {
        let result = {};
        if (id) {
            let res = await userService.getProfileDoctorById(id);
            if (res && res.errCode === 0) {
                result = res.data;
            }
        }
        return result;
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }
        if (this.props.doctorId !== prevProps.doctorId) {
            let data = await this.getInforDoctor(this.props.doctorId);
            this.setState({
                dataProfile: data
            })
        }
    }
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    renderTimeBooking = (dataTime) => {
        let { language } = this.props;
        if (dataTime && !_.isEmpty(dataTime)) {
            let time = language === LANGUAGES.VI ? dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn;
            let dateVi = this.capitalizeFirstLetter(moment.unix(+dataTime.date / 1000).format('dddd - DD/MM/YYYY'));
            let dateEn = moment.unix(+dataTime.date / 1000).locale('en').format('ddd - MM/DD/YYYY')
            let date = language === LANGUAGES.VI
                ? dateVi
                : dateEn
            return (
                <>
                    <div>{time} - {date}</div>
                    <div><FormattedMessage id='patient.booking-modal.priceBooking' /></div>
                </>
            )
        }
        return <></>
    }
    render() {
        let { dataProfile } = this.state;
        let { language, isShowDescription, dataTime, isShowLinkProfile,
            isShowPrice, doctorId } = this.props;
        let nameVi = '', nameEn = '';
        if (dataProfile && dataProfile.positionData) {
            nameVi = `${dataProfile.positionData.valueVi}, ${dataProfile.lastName} ${dataProfile.firstName}`;
            nameEn = `${dataProfile.positionData.valueEn}, ${dataProfile.firstName} ${dataProfile.lastName}`;
        }
        // console.log(dataProfile);
        // console.log(dataTime);
        return (
            <div className='profile-doctor-container'>
                <div className="intro-doctor">
                    <div className="content-left" style={{ backgroundImage: `url(${dataProfile.image ? dataProfile.image : ''})` }}>
                    </div>
                    <div className="content-right">
                        <div className='up'>
                            {language === LANGUAGES.VI ? nameVi : nameEn}
                        </div>
                        <div className='down'>
                            {isShowDescription === true ?
                                <>
                                    {dataProfile.Markdown &&
                                        dataProfile.Markdown.description &&
                                        <span>
                                            {dataProfile.Markdown.description}
                                        </span>}
                                </>
                                :
                                <>
                                    {this.renderTimeBooking(dataTime)}
                                </>
                            }
                        </div>
                    </div>

                </div>
                {isShowLinkProfile === true &&
                    <div className='view-detail-doctor'>
                        <Link to={`/detail-doctor/${doctorId}`}> Xem thêm</Link>
                    </div>
                }
                {isShowPrice === true &&
                    <div className='price'>
                        <FormattedMessage id='patient.booking-modal.price' /> {dataProfile && dataProfile.Doctor_Infor && language === LANGUAGES.VI && dataProfile.Doctor_Infor.priceData ?
                            <NumberFormat
                                className='currency'
                                value={dataProfile.Doctor_Infor.priceData.valueVi}
                                displayType={'text'}
                                thousandSeparator={true}
                                suffix={'VND'}
                            />
                            : ''}
                        {dataProfile && dataProfile.Doctor_Infor && language === LANGUAGES.EN && dataProfile.Doctor_Infor.priceData ?
                            <NumberFormat
                                className='currency'
                                value={dataProfile.Doctor_Infor.priceData.valueEn}
                                displayType={'text'}
                                thousandSeparator={true}
                                suffix={'$'}
                            /> : ''}
                    </div>
                }
            </div>
        )
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDoctor);
