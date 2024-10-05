import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import specialtyImg1 from "../../../assets/specialty/101627-co-xuong-khop.png";
import userService from '../../../services/userService';
import { withRouter } from 'react-router-dom';

class Specialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSpecialty: []
        }
    }
    async componentDidMount() {
        let res = await userService.getAllSpecialty();
        if (res && res.errCode === 0) {
            this.setState({
                dataSpecialty: res.data ? res.data : ''
            })
        }
    }
    handleViewDetailSpecialty = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-specialty/${item.id}`);
        }

    }
    render() {
        let { dataSpecialty } = this.state;
        return (
            <>
                <div className='section-share section-specialty'>
                    <div className='section-container'>
                        <div className='section-header'>
                            <span className='title-section'> <FormattedMessage id='home-page.specialty-popular' /></span>
                            <button className='btn-section'>Xem thêm</button>
                        </div>
                        <div className='section-body'>
                            <Slider {...this.props.settings}>
                                {dataSpecialty && dataSpecialty.length > 0
                                    &&
                                    dataSpecialty.map((item, index) => {
                                        return (
                                            <div className='section-customize specialty'
                                                key={index}
                                                onClick={() => this.handleViewDetailSpecialty(item)}
                                            >
                                                <img src={item.image} />
                                                <div className='name'>{item.name}</div>
                                            </div>
                                        )
                                    })}
                            </Slider>
                        </div>
                    </div>
                </div>

            </>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Specialty));
