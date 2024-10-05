import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './DetailSpecialty.scss';
import HomeHeader from '../../HomePage/HomeHeader';
import DoctorSchedule from '../../Patient/Doctor/DoctorSchedule';
import DoctorExtraInfor from '../../Patient/Doctor/DoctorExtraInfor';
import ProfileDoctor from '../../Patient/Doctor/ProfileDoctor';
import userService from '../../../services/userService';
import _ from 'lodash';
import { LANGUAGES } from '../../../utils';
import DOMpurify from 'dompurify';

class DetailSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctorId: [],
            dataSpecialty: {},
            listProvince: [],
            selectedProvince: '',
            isExpandDescription: false,
        }
    }
    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let res = await userService.getDetailSpecialtyById({
                id: id,
                location: 'ALL'
            });
            let resProvince = await userService.getAllCodeService('PROVINCE');
            let dataProvince = resProvince.data;
            if (dataProvince && dataProvince.length > 0) {
                dataProvince.unshift({
                    keyMap: "ALL",
                    type: "PROVINCE",
                    valueEn: "ALL",
                    valueVi: "Toàn Quốc"
                })
            }
            if (res && res.errCode === 0 && resProvince.errCode === 0) {
                let arrDoctorId = [];
                let data = res.data;
                if (data && !_.isEmpty(data)) {
                    let arr = data.doctorSpecialty;
                    if (arr && arr.length > 0) {
                        arr.map(item => {
                            return arrDoctorId.push(item.doctorId);
                        })
                    }

                }
                this.setState({
                    dataSpecialty: data,
                    arrDoctorId: arrDoctorId,
                    listProvince: dataProvince,
                })
            }
        }
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }
    }
    handleOnChangeProvince = async (event) => {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let location = event.target.value;
            let res = await userService.getDetailSpecialtyById({
                id: id,
                location: location
            })
            if (res && res.errCode === 0) {
                let data = res.data;
                let arrDoctorId = [];
                if (data && !_.isEmpty(data)) {
                    let arr = data.doctorSpecialty;
                    if (arr && arr.length > 0) {
                        arr.map(item => {
                            return arrDoctorId.push(item.doctorId);
                        })
                    }
                }
                this.setState({
                    dataSpecialty: data,
                    arrDoctorId: arrDoctorId,
                    selectedProvince: event.target.value
                })
            }

        }
    }
    toggleExpand = () => {
        this.setState({
            isExpandDescription: !this.state.isExpandDescription
        })
    }
    render() {
        let { arrDoctorId, dataSpecialty, listProvince, isExpandDescription } = this.state;
        console.log('province:', this.state.arrDoctorId);
        let { language } = this.props;
        let htmlClean = DOMpurify.sanitize(dataSpecialty.descriptionHTML);
        return (
            <>
                <div className='detail-specialty-container'>
                    <HomeHeader />
                    <div className='detail-specialty-body'>
                        <div className='description-specialty'>
                            {dataSpecialty && !_.isEmpty(dataSpecialty)
                                &&
                                <div>
                                    <div className={`text-description ${!isExpandDescription ? 'expanded' : 'clamped'}`} dangerouslySetInnerHTML={{ __html: htmlClean }}></div>
                                    <div className='btn-expand' onClick={this.toggleExpand}> {!isExpandDescription ? 'Xem thêm' : 'Ẩn đi'}</div>
                                </div>

                            }
                        </div>
                        <div className='search-doctor'>
                            <select onChange={(event) => this.handleOnChangeProvince(event)}>
                                {listProvince && listProvince.length > 0
                                    && listProvince.map((item, index) => {
                                        return (
                                            <option key={index} value={item.keyMap}>
                                                {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                            </option>
                                        )
                                    })}
                            </select>
                        </div>
                        {arrDoctorId && arrDoctorId.length > 0 &&
                            arrDoctorId.map((item, index) => {
                                return (
                                    <div className='each-doctor' key={index} >
                                        <div className='detail-content-left'>
                                            <div className='profile-doctor'>
                                                <ProfileDoctor
                                                    doctorId={item}
                                                    isShowDescription={true}
                                                    isShowLinkProfile={true}
                                                    isShowPrice={false}
                                                />
                                            </div>
                                        </div>
                                        <div className='detail-content-right'>
                                            <div className='doctor-schedule'>
                                                <DoctorSchedule
                                                    doctorIdFromParent={item}
                                                />
                                            </div>

                                            <div className='doctor-extra-infor'>
                                                <DoctorExtraInfor
                                                    doctorIdFromParent={item} />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>

                </div>
            </>

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

export default connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty);
