import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './DetailClinic.scss';
import HomeHeader from '../../HomePage/HomeHeader';
import DoctorSchedule from '../../Patient/Doctor/DoctorSchedule';
import DoctorExtraInfor from '../../Patient/Doctor/DoctorExtraInfor';
import ProfileDoctor from '../../Patient/Doctor/ProfileDoctor';
import userService from '../../../services/userService';
import _ from 'lodash';
import { LANGUAGES } from '../../../utils';
import DOMpurify from 'dompurify';

class DetailClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctorId: [],
            dataClinic: {},
            isExpandDescription: false,
        }
    }
    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let res = await userService.getDetailClinicById(id);
            console.log('bb', res)
            if (res && res.errCode === 0) {
                let arrDoctorId = [];
                let data = res.data;
                if (data && !_.isEmpty(data)) {
                    let arr = data.doctorClinic;
                    if (arr && arr.length > 0) {
                        arr.map(item => {
                            return arrDoctorId.push(item.doctorId);
                        })
                    }

                }
                this.setState({
                    dataClinic: data,
                    arrDoctorId: arrDoctorId,
                })
            }
        }
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }
    }
    toggleExpand = () => {
        this.setState({
            isExpandDescription: !this.state.isExpandDescription
        })
    }
    render() {
        let { arrDoctorId, dataClinic, isExpandDescription } = this.state;
        let { language } = this.props;
        console.log('aa', dataClinic)
        let htmlClean = DOMpurify.sanitize(dataClinic.descriptionHTML);
        return (
            <>
                <div className='detail-clinic-container'>
                    <HomeHeader />
                    <div className='detail-clinic-body'>
                        <div className='description-clinic'>
                            {dataClinic && !_.isEmpty(dataClinic)
                                &&
                                <>
                                    <div className='name-clinic'>
                                        {dataClinic.name}
                                    </div>
                                    <div>
                                        <div className={`text-description ${!isExpandDescription ? 'expanded' : 'clamped'}`} dangerouslySetInnerHTML={{ __html: htmlClean }}></div>
                                        <div className='btn-expand' onClick={this.toggleExpand}> {!isExpandDescription ? 'Xem thêm' : 'Ẩn đi'}</div>
                                    </div>
                                </>


                            }
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailClinic);
