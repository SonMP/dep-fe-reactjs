import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import medicalFacilityImg1 from "../../../assets/medical-facility/img-medical-facility1.jpg";
import userService from '../../../services/userService';
import { withRouter } from 'react-router-dom';

class MedicalFacility extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataClinic: []
        }
    }
    async componentDidMount() {
        let res = await userService.getAllClinic();
        if (res && res.errCode === 0) {
            this.setState({
                dataClinic: res.data ? res.data : ''
            })
        }
    }
    handleViewDetailClinic = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-clinic/${item.id}`);
        }
    }
    render() {
        let { dataClinic } = this.state;
        return (
            <div>
                <div className='section-share section-medical-facility'>
                    <div className='section-container'>
                        <div className='section-header'>
                            <span className='title-section'> Cơ sở y tế</span>
                            <button className='btn-section'>Xem thêm</button>
                        </div>
                        <div className='section-body'>
                            <Slider {...this.props.settings}>
                                {dataClinic && dataClinic.length > 0 &&
                                    dataClinic.map((item, index) => {
                                        return (
                                            <div className='section-customize clinic'
                                                key={index}
                                                onClick={() => this.handleViewDetailClinic(item)}
                                            >
                                                <img src={item.image} />
                                                <div className='clinic-name'>{item.name}</div>
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
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MedicalFacility));
