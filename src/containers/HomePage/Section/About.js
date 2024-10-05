import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import video from '../../../assets/video/anhKingen.mp4';


class About extends Component {

    render() {
        return (
            <div className='section-share section-about'>
                <div className='section-about-header'>
                    <div>Anh Kingen</div>
                </div>
                <div className='section-about-content'>
                    <div className='content-left'>
                        {/* <iframe width="100%" height="400px"
                            src="https://www.youtube.com/embed/r7qovpFAGrQ"
                            title="Lil Nas X - Old Town Road (Official Video) ft. Billy Ray Cyrus"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerpolicy="strict-origin-when-cross-origin"
                            allowfullscreen>
                        </iframe> */}
                        <video width="auto" height='400px' controls>

                            <source src={video} type='video/mp4' />
                        </video>
                    </div>
                    <div className='content-right'>

                        <p>Với con bài Aatrox áp đảo thì ở ván thi đấu thứ 4, bộ đôi DRX Kingen và Pyosik đã không để T1 sở hữu bất kỳ một mạng nào.
                            Giây phút toả sáng của Kingen đã được thể hiện rất tốt ở ván thứ 5 khi có những pha gánh team và giải quyết những sai lầm của đồng đội đầy khéo léo.</p>
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

export default connect(mapStateToProps, mapDispatchToProps)(About);
