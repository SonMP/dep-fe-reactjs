import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import doctorImg1 from "../../../assets/doctor/img-doctor.png";
import * as action from "../../../store/actions";
import { LANGUAGES, path } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';

class OutStandingDoctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            doctorArr: []
        }
    }
    async componentDidMount() {
        await this.props.fetchTopDoctor();
        this.setState({
            doctorArr: this.props.doctors
        })
    }

    handleViewDetailDoctor = (doctor) => {
        if (this.props.history) {
            this.props.history.push(`/detail-doctor/${doctor.id}`);
        }

    }
    render() {
        let { doctorArr } = this.state;
        let language = this.props.language;
        // console.log('nn', language);
        // console.log(doctorArr);
        // console.log('dasda', this.props.doctors);
        return (
            <div>
                <div className='section-share section-outstanding-doctor'>
                    <div className='section-container'>
                        <div className='section-header'>
                            <span className='title-section'><FormattedMessage id='home-page.outstanding-doctor' /> </span>
                            <button className='btn-section'><FormattedMessage id='home-page.more-info' /></button>
                        </div>
                        <div className='section-body'>
                            <Slider {...this.props.settings}>

                                {doctorArr && doctorArr.length > 0 &&
                                    doctorArr.map((item, index) => {

                                        let nameVi = `${item.positionData.valueVi}, ${item.lastName} ${item.firstName}`;
                                        let nameEn = `${item.positionData.valueEn}, ${item.firstName} ${item.lastName}`;
                                        let imageBase64 = '';
                                        if (item.image) {
                                            imageBase64 = new Buffer(item.image, 'base64').toString('binary');
                                        }

                                        return (
                                            <div className='section-customize doctor' key={index} onClick={() => this.handleViewDetailDoctor(item)}>
                                                <div className='customize-border'>
                                                    <img className='image-doctor' src={imageBase64} />
                                                    <div> {language === LANGUAGES.VI ? nameVi : nameEn} </div>
                                                    <div>Cơ xương khớp</div>
                                                </div>

                                            </div>
                                        )
                                    })}
                            </Slider>
                        </div>
                    </div>
                </div>
            </div>

        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        doctors: state.admin.doctors,
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchTopDoctor: () => dispatch(action.fetchTopDoctor()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OutStandingDoctor));
