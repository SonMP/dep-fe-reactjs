import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import HandBookImg1 from "../../../assets/handbook/img-handbook1.png";


class HandBook extends Component {

    render() {
        return (
            <div>

                <div className='section-share section-handbook'>
                    <div className='section-container'>
                        <div className='section-header'>
                            <span className='title-section'> Cẩm nang</span>
                            <button className='btn-section'>Xem thêm</button>
                        </div>
                        <div className='section-body'>
                            <Slider {...this.props.settings}>
                                <div className='section-customize'>
                                    <img src={HandBookImg1} />
                                    <div>Bệnh viện hữu nghị Việt Đức</div>
                                </div>
                                <div className='section-customize'>
                                    <img src={HandBookImg1} />
                                    <div>Bệnh viện hữu nghị Việt Đức</div>
                                </div>
                                <div className='section-customize'>
                                    <img src={HandBookImg1} />
                                    <div>Bệnh viện hữu nghị Việt Đức</div>
                                </div>

                                <div className='section-customize'>
                                    <img src={HandBookImg1} />
                                    <div>Bệnh viện hữu nghị Việt Đức</div>
                                </div>

                                <div className='section-customize'>
                                    <img src={HandBookImg1} />
                                    <div>Bệnh viện hữu nghị Việt Đức</div>
                                </div>

                                <div className='section-customize'>
                                    <img src={HandBookImg1} />
                                    <div>Bệnh viện hữu nghị Việt Đức</div>
                                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(HandBook);
