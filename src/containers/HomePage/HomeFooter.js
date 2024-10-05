import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './HomeHeader.scss';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from '../../utils/constant';
import { changeLanguageApp } from '../../store/actions';
class HomeHeader extends Component {

    //fire redux event: actions
    changeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language);
    }

    render() {
        console.log(this.props);
        let language = this.props.language;
        return (
            <>

                <div className='home-footer'>footer
                    <p>&copy;2024 Hồ Thái Sơn. More information
                        <a target='_blank' href='https://www.facebook.com/thaison.ho.3990'> &#8594; Click here &#8592;</a></p>
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
        changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeHeader);
